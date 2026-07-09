class JwtService
  ALGORITHM = "HS256".freeze

  class << self
    def encode(payload, expiry = access_token_expiry)
      payload_with_claims = payload.merge(
        exp: expiry.seconds.from_now.to_i,
        iat: Time.current.to_i,
        jti: SecureRandom.uuid
      )

      JWT.encode(payload_with_claims, secret_key, ALGORITHM)
    end

    def decode(token)
      decoded = JWT.decode(
        token,
        secret_key,
        true,
        {
          algorithm: ALGORITHM,
          verify_expiration: true
        }
      )

      decoded.first.with_indifferent_access
    rescue JWT::ExpiredSignature
      raise JWT::DecodeError, "Token has expired"
    rescue JWT::DecodeError => e
      raise JWT::DecodeError, "Invalid token: #{e.message}"
    end

    def create_access_token(user_id)
      encode(
        {
          sub: user_id.to_s,
          type: "access"
        },
        access_token_expiry
      )
    end

    def create_refresh_token(user_id)
      encode(
        {
          sub: user_id.to_s,
          type: "refresh"
        },
        refresh_token_expiry
      )
    end

    def create_token_pair(user_id)
      {
        access_token: create_access_token(user_id),
        refresh_token: create_refresh_token(user_id)
      }
    end

    private

    def secret_key
      key = ENV.fetch("JWT_SECRET_KEY") do
        raise "JWT_SECRET_KEY environment variable is not set"
      end

      if key.length < 32
        raise "JWT_SECRET_KEY must be at least 32 characters"
      end

      key
    end

    def access_token_expiry
      ENV.fetch("JWT_ACCESS_TOKEN_EXPIRY", 900).to_i
    end

    def refresh_token_expiry
      ENV.fetch("JWT_REFRESH_TOKEN_EXPIRY", 604800).to_i
    end
  end
end
