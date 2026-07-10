class Api::V1::PaymentsController < ApplicationController
  before_action :set_payment, only: :show

  def index
    payments = Payment.order(created_at: :desc)

    render json: payments,
           each_serializer: PaymentSerializer,
           status: :ok
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
end
