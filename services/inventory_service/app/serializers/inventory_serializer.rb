class InventorySerializer < ActiveModel::Serializer
  attributes :id, :product_id, :quantity
end
