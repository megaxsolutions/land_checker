module JsonWebToken
  SECRET_KEY = ENV.fetch('JWT_SECRET') { 'development_secret_key_change_in_production' }
  TOKEN_EXPIRY = 24.hours

  def self.encode(payload, exp = TOKEN_EXPIRY.from_now)
    payload[:exp] = exp.to_i
    JWT.encode(payload, SECRET_KEY, 'HS256')
  end

  def self.decode(token)
    decoded = JWT.decode(token, SECRET_KEY, true, { algorithm: 'HS256' })[0]
    HashWithIndifferentAccess.new(decoded)
  rescue JWT::ExpiredSignature
    raise JWT::ExpiredSignature, 'Token has expired'
  rescue JWT::DecodeError => e
    raise JWT::DecodeError, e.message
  end
end
