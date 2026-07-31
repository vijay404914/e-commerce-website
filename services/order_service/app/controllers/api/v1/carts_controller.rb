module Api
  module V1
    class CartsController < ApplicationController
      before_action :set_cart, only: %i[show destroy update_item remove_item destroy]

      def show
        if @cart
          render json: @cart,
                 serializer: CartSerializer,
                 status: :ok
        else
          render json: { message: "Cart is empty" }, status: :ok
        end
      end

      def create
        validation_error = validate_cart_params
        return render json: { error: validation_error }, status: :unprocessable_entity if validation_error

        product = ProductClient.find(params[:product_id])

        return render json: { error: "Product not found" }, status: :not_found unless product

        cart = Cart.find_or_create_by!(
          user_id: current_user_id,
          status: "active"
        )

        if cart.cart_items.exists?(product_id: product["id"])
          return render json: {
            error: "Product already added to cart."
          }, status: :unprocessable_entity
        end

        cart_item = cart.cart_items.create!(
          product_id: product["id"],
          quantity: params[:quantity].to_i
        )


        render json: cart,
               serializer: CartSerializer,
               status: :created
      end

      def destroy
        if @cart
          @cart.destroy
          render json: { message: "Cart cleared successfully" }, status: :ok
        else
          render json: { message: "Cart not found" }, status: :not_found
        end
      end

      def update_item
        cart_item = @cart.cart_items.find_by(id: params[:id])

        return render json: { error: "Cart item not found" }, status: :not_found unless cart_item

        if params[:quantity].blank?
          return render json: { error: "Quantity is required" }, status: :unprocessable_entity
        end

        quantity = params[:quantity].to_i

        if quantity <= 0
          return render json: { error: "Quantity must be greater than zero" }, status: :unprocessable_entity
        end

        cart_item.update!(quantity: quantity)

        render json: cart_item,
               serializer: CartItemSerializer,
               status: :ok
      end

      def remove_item
        cart_item = @cart.cart_items.find_by(id: params[:id])

        return render json: { error: "Cart item not found" }, status: :not_found unless cart_item

        cart_item.destroy

        render json: {
          message: "Item removed from cart successfully"
        }, status: :ok
      end

      private

      def set_cart
        @cart = Cart.find_by(user_id: current_user_id)
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Cart not found" }, status: :not_found
      end

      def validate_cart_params
        return "Product id is required" if params[:product_id].blank?
        return "Quantity is required" if params[:quantity].blank?
        return "Quantity must be greater than zero" if params[:quantity].to_i <= 0

        nil
      end
    end
  end
end
