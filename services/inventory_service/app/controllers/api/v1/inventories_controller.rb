module Api
  module V1
    class InventoriesController < ApplicationController
      before_action :set_inventory, only: %i[show update destroy]

      def index
        inventories = Inventory.all

        render json: inventories, each_serializer: InventorySerializer, status: :ok
      end

      def show
        render json: @inventory, serializer: InventorySerializer, status: :ok
      end

      def create
        inventory = Inventory.new(inventory_params)

        if inventory.save
          render json: inventory,
                 serializer: InventorySerializer,
                 status: :created
        else
          render json: { errors: inventory.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      def update
        if @inventory.update(inventory_params)
          render json: @inventory,
                 serializer: InventorySerializer,
                 status: :ok
        else
          render json: { errors: @inventory.errors.full_messages },
                 status: :unprocessable_entity
        end
      end

      def destroy
        @inventory.destroy

        render json: { message: "Inventory deleted successfully" }, status: :ok
      end

      private

      def set_inventory
        @inventory = Inventory.find(params[:id])
      rescue ActiveRecord::RecordNotFound
        render json: { error: "Inventory not found" }, status: :not_found
      end

      def inventory_params
        params.require(:inventory).permit(:product_id, :quantity)
      end
    end
  end
end
