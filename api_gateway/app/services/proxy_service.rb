class ProxyService
  include HTTParty

  def initialize(request, service, path)
    @request = request
    @service = service
    @path = path
  end

  def call
    HTTParty.send(
      @request.request_method.downcase,
      target_url,
      headers: headers,
      body: @request.raw_post
    )
  end

  private

  def target_url
    case @service
    when "user"
      path = @path.present? ? "/#{@path}" : ""
      "#{ENV['USER_SERVICE_URL']}/api/v1/auth/#{@path}"
    when "product"
      path = @path.present? ? "/products/#{@path}" : "/products"
      "#{ENV['PRODUCT_SERVICE_URL']}/api/v1#{path}"
    when "inventory"
      path = @path.present? ? "/inventories/#{@path}" : "/inventories"
      "#{ENV['INVENTORY_SERVICE_URL']}/api/v1#{path}"
    when "order"
      if @request.path.include?("/carts")
        path = @path.present? ? "/carts/#{@path}" : "/carts"
      else
        path = @path.present? ? "/orders/#{@path}" : "/orders"
      end

      "#{ENV['ORDER_SERVICE_URL']}/api/v1#{path}"
    when "payment"
      path = @path.present? ? "/payments/#{@path}" : "/payments"
      "#{ENV['PAYMENT_SERVICE_URL']}/api/v1#{path}"
    else
      raise "Unknown service: #{@service}"
    end
  end

  def headers
    {
      "Content-Type" => @request.headers["Content-Type"],
      "Authorization" => @request.headers["Authorization"]
    }
  end
end
