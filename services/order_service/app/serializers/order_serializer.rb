class OrderSerializer < ActiveModel::Serializer
  attributes :id,
             :user_id,
             :order_number,
             :status,
             :total_amount,
             :created_at,
             :updated_at

  has_many :order_items
end
