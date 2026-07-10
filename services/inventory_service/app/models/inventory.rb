class Inventory < ApplicationRecord
  validates :product_id, presence: true, uniqueness: true
  validates :quantity,
            presence: true,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }
end
