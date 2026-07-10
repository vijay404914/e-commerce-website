class Order < ApplicationRecord
  has_many :order_items, dependent: :destroy

  validates :user_id, presence: true
  validates :order_number, presence: true, uniqueness: true

  validates :total_amount,
            presence: true,
            numericality: {
              greater_than_or_equal_to: 0
            }

  enum :status, {
    pending: "pending",
    confirmed: "confirmed",
    processing: "processing",
    shipped: "shipped",
    delivered: "delivered",
    cancelled: "cancelled"
  }
end
