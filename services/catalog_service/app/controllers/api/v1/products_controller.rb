class Api::V1::ProductsController < ApplicationController
  before_action :set_product, only: %i[show update destroy]

  def index
    products = Product.all.order(created_at: :desc)

    render json: products,
           each_serializer: ProductSerializer,
           status: :ok
  end

  def show
    render json: @product,
           serializer: ProductSerializer,
           status: :ok
  end

  def create
    product = Product.new(product_params)

    if product.save
      render json: product,
             serializer: ProductSerializer,
             status: :created
    else
      render json: { errors: product.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def update
    if @product.update(product_params)
      render json: @product,
             serializer: ProductSerializer,
             status: :ok
    else
      render json: { errors: @product.errors.full_messages },
             status: :unprocessable_entity
    end
  end

  def destroy
    @product.destroy

    render json: {
      message: "Product deleted successfully."
    }, status: :ok
  end

  private

  def set_product
    @product = Product.find(params[:id])
  end

  def product_params
    params.require(:product).permit(
      :name,
      :description,
      :sku,
      :category,
      :brand,
      :price,
      :stock,
      :status
    )
  end
end
