class ProductSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  attributes :id,
             :name,
             :description,
             :sku,
             :price,
             :stock,
             :category,
             :brand,
             :status,
             :image_url

  def image_url
    return unless object.image.attached?

    rails_blob_url(
      object.image,
      host: "http://localhost:3002"
    )
  end
end
