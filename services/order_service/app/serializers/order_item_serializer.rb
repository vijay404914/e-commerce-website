class OrderItemSerializer < ActiveModel::Serializer
  attributes :id,
             :product_id,
             :quantity,
             :unit_price,
             :total_price,
             :created_at,
             :updated_at,
             :product_name

  def product_name
    product = ProductClient.find(object.product_id)
    product["name"] if product.present?
  end
end
