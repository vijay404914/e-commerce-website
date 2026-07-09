class ProductSerializer < ActiveModel::Serializer
  attributes :id,
             :name,
             :description,
             :sku,
             :category,
             :brand,
             :price,
             :stock,
             :status
end
