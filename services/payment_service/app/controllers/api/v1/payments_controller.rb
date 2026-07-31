class Api::V1::PaymentsController < ApplicationController
  before_action :set_payment, only: :show

  def index
    payments = Payment.order(created_at: :desc)

    render json: payments,
           each_serializer: PaymentSerializer,
           status: :ok
  end

  def create
    payment = Payment.create!(
      payment_params.merge(
        user_id: current_user_id,
        payment_status: "pending"
      )
    )

    intent = StripePaymentService.create_payment_intent(payment)

    payment.update!(
      gateway_payment_id: intent.id
    )

    render json: {
      payment_id: payment.id,
      client_secret: intent.client_secret
    }, status: :created
  end

  def webhook
    payload = request.body.read
    signature = request.env["HTTP_STRIPE_SIGNATURE"]

    event = Stripe::Webhook.construct_event(
      payload,
      signature,
      ENV.fetch("STRIPE_WEBHOOK_SECRET")
    )

    case event.type
    when "payment_intent.succeeded"
      intent = event.data.object

      payment = Payment.find_by!(
        gateway_payment_id: intent.id
      )

      payment.update!(
        payment_status: "paid",
        transaction_id: intent.latest_charge,
        paid_at: Time.current
      )

    when "payment_intent.payment_failed"
      intent = event.data.object

      payment = Payment.find_by!(
        gateway_payment_id: intent.id
      )

      payment.update!(
        payment_status: "failed",
        failure_reason: intent.last_payment_error&.message
      )
    end

    head :ok
  end

  def show
    render json: @payment,
           serializer: PaymentSerializer,
           status: :ok
  end

  private

  def set_payment
    @payment = Payment.find(params[:id])
  end

  def payment_params
    params.require(:payment).permit(
      :order_id,
      :user_id,
      :amount,
      :currency,
      :payment_method
    )
  end
end
