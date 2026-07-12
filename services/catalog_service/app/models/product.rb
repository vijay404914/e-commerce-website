class Product < ApplicationRecord
  has_one_attached :image
  CATEGORIES = %w[
    electronics
    fashion
    books
    home
    sports
  ].freeze

  enum :status, {
    inactive: 0,
    active: 1
  }

  validates :name, presence: true, length: { minimum: 3, maximum: 100 }

  # validates :sku,
  #           presence: true,
  #           uniqueness: true

  validates :price,
            presence: true,
            numericality: { greater_than: 0 }

  validates :stock,
            numericality: {
              only_integer: true,
              greater_than_or_equal_to: 0
            }

  validates :category,
            presence: true,
            inclusion: { in: CATEGORIES }

  scope :active_products, -> { active }
end
