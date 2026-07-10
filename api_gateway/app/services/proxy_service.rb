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