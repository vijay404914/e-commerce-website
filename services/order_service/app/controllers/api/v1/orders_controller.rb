class Api::V1::OrdersController < ApplicationController
  before_action :set_order, only: :show

  def index
    orders = Order.where(user_id: current_user_id)
                  .includes(:order_items)
                  .order(created_at: :desc)

    render json: orders,
           each_serializer: OrderSerializer,
           status: :ok
  end

  def show
    render json: @order,
           serializer: OrderSerializer,
           status: :ok
  end

  def create
    cart = Cart.find_by(user_id: current_user_id)

    return render json: {
      error: "Cart is empty"
    }, status: :unprocessable_entity if cart.cart_items.blank?

    total_amount = 0

    order = Order.create!(
      user_id: current_user_id,
      status: "pending",
      total_amount: total_amount
    )

    cart.cart_items.each do |cart_item|
      product = ProductClient.find(cart_item.product_id)

      price = product["price"].to_i
      quantity = cart_item.quantity

      OrderItem.create!(
        order: order,
        product_id: product["id"],
        quantity: quantity,
        unit_price: price,
        total_price: price * quantity
      )

      total_amount += price * quantity
    end

    order.update!(total_amount: total_amount)

    render json: order,
           serializer: OrderSerializer,
           status: :created
  end

  private

  def set_order
    @order = Order.find_by!(
      id: params[:id],
      user_id: current_user_id
    )
  end
end
