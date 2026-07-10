class CartSerializer < ActiveModel::Serializer
  attributes :id, :user_id, :status

  has_many :cart_items
end
