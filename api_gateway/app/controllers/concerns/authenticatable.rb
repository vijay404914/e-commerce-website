module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
    attr_reader :current_user_id
  end

  private

  def authenticate_request
    token = extract_token(request.headers["Authorization"])

    return render_unauthorized("Missing authentication token") unless token

    begin
      payload = JwtService.decode(token)

      unless payload[:type] == "access"
        return render_unauthorized("Invalid token type")
      end

      if AccessTokenBlacklist.blacklisted?(payload[:jti])
        return render_unauthorized("Token has been revoked")
      end
      @current_user_id = payload[:sub]
    rescue JWT::DecodeError => e
      render_unauthorized(e.message)
    end
  end

  def extract_token(header)
    return nil if header.blank?
    return nil unless header.start_with?("Bearer ")

    header.split.last
  end

  def render_unauthorized(message)
    render json: { error: message }, status: :unauthorized
  end
end
