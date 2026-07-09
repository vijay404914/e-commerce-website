class RefreshTokenService
  TOKEN_PREFIX = "refresh_token:".freeze
  FAMILY_PREFIX = "token_family:".freeze
  USER_TOKENS_PREFIX = "user_tokens:".freeze

  class << self
    def create(user_id, device_info = nil)
      token = JwtService.create_refresh_token(user_id)
      payload = JwtService.decode(token)

      family_id = SecureRandom.uuid

      store_token(
        jti: payload[:jti],
        user_id: user_id,
        family_id: family_id,
        device_info: device_info,
        expires_at: Time.at(payload[:exp])
      )

      add_to_user_tokens(user_id, payload[:jti])

      { token: token, family_id: family_id, jti: payload[:jti] }
    end

    def rotate(old_token)
      payload = JwtService.decode(old_token)

      unless payload[:type] == "refresh"
        raise JWT::DecodeError, "Not a refresh token"
      end

      token_data = get_token(payload[:jti])

      unless token_data
        raise JWT::DecodeError, "Refresh token not found"
      end

      if token_data[:revoked]
        revoke_family(token_data[:family_id])

        Rails.logger.warn(
          "Token reuse detected for user #{token_data[:user_id]}, " \
          "family #{token_data[:family_id]}"
        )

        raise SecurityError, "Token reuse detected - all sessions revoked"
      end

      user_id = token_data[:user_id].to_i
      family_id = token_data[:family_id]

      revoke_token(payload[:jti])

      new_access = JwtService.create_access_token(user_id)
      new_refresh = JwtService.create_refresh_token(user_id)
      new_payload = JwtService.decode(new_refresh)

      store_token(
        jti: new_payload[:jti],
        user_id: user_id,
        family_id: family_id,
        device_info: token_data[:device_info],
        expires_at: Time.at(new_payload[:exp])
      )

      remove_from_user_tokens(user_id, payload[:jti])
      add_to_user_tokens(user_id, new_payload[:jti])

      {
        access_token: new_access,
        refresh_token: new_refresh
      }
    end

    def revoke_token(jti)
      token_key = "#{TOKEN_PREFIX}#{jti}"

      redis.multi do |multi|
        multi.hset(token_key, "revoked", "true")
        multi.expire(token_key, 86400)
      end
    end

    def revoke_family(family_id)
      pattern = "#{TOKEN_PREFIX}*"

      redis.scan_each(match: pattern) do |key|
        if redis.hget(key, "family_id") == family_id
          redis.hset(key, "revoked", "true")
        end
      end
    end

    def revoke_all_user_tokens(user_id)
      user_key = "#{USER_TOKENS_PREFIX}#{user_id}"
      token_jtis = redis.smembers(user_key)

      token_jtis.each do |jti|
        revoke_token(jti)
      end

      redis.del(user_key)
    end

    def validate(token)
      payload = JwtService.decode(token)
      return nil unless payload[:type] == "refresh"

      token_data = get_token(payload[:jti])
      return nil unless token_data
      return nil if token_data[:revoked]

      token_data
    rescue JWT::DecodeError
      nil
    end

    private

    def store_token(jti:, user_id:, family_id:, device_info:, expires_at:)
      token_key = "#{TOKEN_PREFIX}#{jti}"
      ttl = (expires_at - Time.current).to_i

      redis.multi do |multi|
        multi.hset(
          token_key,
          "user_id", user_id.to_s,
          "family_id", family_id,
          "device_info", device_info.to_s,
          "revoked", "false",
          "created_at", Time.current.iso8601
        )
        multi.expire(token_key, ttl + 86400)
      end
    end

    def get_token(jti)
      token_key = "#{TOKEN_PREFIX}#{jti}"
      data = redis.hgetall(token_key)

      return nil if data.empty?

      {
        user_id: data["user_id"],
        family_id: data["family_id"],
        device_info: data["device_info"],
        revoked: data["revoked"] == "true",
        created_at: data["created_at"]
      }
    end

    def add_to_user_tokens(user_id, jti)
      user_key = "#{USER_TOKENS_PREFIX}#{user_id}"
      redis.sadd(user_key, jti)
    end

    def remove_from_user_tokens(user_id, jti)
      user_key = "#{USER_TOKENS_PREFIX}#{user_id}"
      redis.srem(user_key, jti)
    end

    def redis
      @redis ||= Redis.new(url: ENV.fetch("REDIS_URL", "redis://localhost:6379/0"))
    end
  end
end
