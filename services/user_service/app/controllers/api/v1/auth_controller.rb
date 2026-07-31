module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [ :login ]

      def login
        unless params[:email].present? && params[:password].present?
          return render_error("Email and password are required", :bad_request)
        end

        user = User.authenticate(params[:email], params[:password])

        unless user
          return render_error("Invalid email or password", :unauthorized)
        end

        tokens = JwtService.create_token_pair(user.id)

        refresh_data = RefreshTokenService.create(
          user.id,
          request.user_agent
        )

        render json: {
          access_token: tokens[:access_token],
          refresh_token: refresh_data[:token],
          token_type: "Bearer",
          expires_in: ENV.fetch("JWT_ACCESS_TOKEN_EXPIRY", 3600).to_i,
          user: UserSerializer.new(user)
        }, status: :ok
      end

      # def refresh
      #   refresh_token = params[:refresh_token]

      #   unless refresh_token.present?
      #     return render_error('Refresh token is required', :bad_request)
      #   end

      #   begin
      #     tokens = RefreshTokenService.rotate(refresh_token)

      #     render json: {
      #       access_token: tokens[:access_token],
      #       refresh_token: tokens[:refresh_token],
      #       token_type: 'Bearer',
      #       expires_in: ENV.fetch('JWT_ACCESS_TOKEN_EXPIRY', 900).to_i
      #     }, status: :ok

      #   rescue JWT::DecodeError => e
      #     render_error(e.message, :unauthorized)

      #   rescue SecurityError => e
      #     render_error(e.message, :forbidden)
      #   end
      # end

      def logout
        if @current_token_jti && @current_token_exp
          AccessTokenBlacklist.add(
            @current_token_jti,
            Time.at(@current_token_exp)
          )
        end


        render json: { message: "Logged out successfully" }, status: :ok
      end

      private

      def render_error(message, status)
        render json: { error: message }, status: status
      end
    end
  end
end
