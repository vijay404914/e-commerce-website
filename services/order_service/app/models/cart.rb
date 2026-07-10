class Cart < ApplicationRecord
  has_many :cart_items, dependent: :destroy

  validates :user_id, presence: true

  enum :status, {
    active: "active",
    checked_out: "checked_out"
  }
end
