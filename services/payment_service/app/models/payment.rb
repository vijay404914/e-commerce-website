# app/models/payment.rb

class Payment < ApplicationRecord
  has_many :refunds, dependent: :destroy

  enum :payment_status, {
    pending: "pending",
    processing: "processing",
    paid: "paid",
    failed: "failed",
    cancelled: "cancelled",
    refunded: "refunded"
  }

  enum :payment_method, {
    card: "card",
    upi: "upi",
    net_banking: "net_banking",
    wallet: "wallet",
    cod: "cod"
  }

  validates :order_id, presence: true
  validates :user_id, presence: true

  validates :amount,
            presence: true,
            numericality: {
              greater_than: 0
            }

  validates :currency,
            presence: true,
            length: { is: 3 }

  validates :payment_method, presence: true
  validates :payment_status, presence: true

  validates :transaction_id,
            uniqueness: true,
            allow_nil: true

  validates :gateway_payment_id,
            uniqueness: true,
            allow_nil: true
end
