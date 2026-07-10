class ProductClient
  include HTTParty

  base_uri ENV.fetch("PRODUCT_SERVICE_URL")

  class << self
    def find(product_id)
      response = get("/api/v1/products/#{product_id}")

      return nil unless response.success?

      response.parsed_response
    rescue HTTParty::Error, StandardError => e
      Rails.logger.error("Product Service Error: #{e.message}")
      nil
    end
  end
end
