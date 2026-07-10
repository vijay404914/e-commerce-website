class CartItemSerializer < ActiveModel::Serializer
  attributes :id,
             :product_id,
             :quantity,
             :created_at,
             :updated_at
end
