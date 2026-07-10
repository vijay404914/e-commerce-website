class OrderItemSerializer < ActiveModel::Serializer
  attributes :id,
             :product_id,
             :quantity,
             :unit_price,
             :total_price,
             :created_at,
             :updated_at
end
