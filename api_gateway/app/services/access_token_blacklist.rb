class AccessTokenBlacklist
  BLACKLIST_PREFIX = 'access_blacklist:'.freeze

  class << self
    def add(jti, expires_at)
      key = "#{BLACKLIST_PREFIX}#{jti}"
      ttl = (expires_at - Time.current).to_i

      return if ttl <= 0

      redis.setex(key, ttl, 'revoked')
    end

    def blacklisted?(jti)
      key = "#{BLACKLIST_PREFIX}#{jti}"
      redis.exists?(key)
    end

    def revoke(token)
      payload = JwtService.decode(token)
      expires_at = Time.at(payload[:exp])
      add(payload[:jti], expires_at)
    rescue JWT::DecodeError
      nil
    end

    private

    def redis
      @redis ||= Redis.new(url: ENV.fetch('REDIS_URL', 'redis://localhost:6379/0'))
    end
  end
end
