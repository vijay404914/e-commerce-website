# app/controllers/concerns/authenticatable.rb
# Concern for JWT authentication in controllers

module Authenticatable
  extend ActiveSupport::Concern

  included do
    before_action :authenticate_request
    attr_reader :current_user
  end

  private

  def authenticate_request
    header = request.headers["Authorization"]
    token = extract_token(header)

    unless token
      render_unauthorized("Missing authentication token")
      return
    end

    begin
      payload = JwtService.decode(token)

      unless payload[:type] == "access"
        render_unauthorized("Invalid token type")
        return
      end

      @current_token_jti = payload[:jti]

      if access_token_blacklisted?(payload[:jti])
        render_unauthorized("Token has been revoked")
        return
      end

      @current_user = User.find_by(id: payload[:sub])

      unless @current_user
        render_unauthorized("User not found")
        nil
      end

    rescue JWT::DecodeError => e
      render_unauthorized(e.message)
    end
  end

  def extract_token(header)
    return nil unless header.present?
    return nil unless header.start_with?("Bearer ")

    header.split(" ").last
  end

  def render_unauthorized(message = "Unauthorized")
    render json: { error: message }, status: :unauthorized
  end

  def access_token_blacklisted?(jti)
    AccessTokenBlacklist.blacklisted?(jti)
  end
end
