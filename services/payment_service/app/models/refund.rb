# app/models/refund.rb

class Refund < ApplicationRecord
  belongs_to :payment

  enum :refund_status, {
    pending: "pending",
    processing: "processing",
    completed: "completed",
    failed: "failed"
  }

  validates :refund_amount,
            presence: true,
            numericality: {
              greater_than: 0
            }

  validates :refund_status, presence: true
end
