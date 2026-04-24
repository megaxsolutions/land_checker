class Rack::Attack
  throttle('req/ip', limit: 300, period: 5.minutes) do |req|
    req.ip
  end

  throttle('logins/ip', limit: 10, period: 20.minutes) do |req|
    req.ip if req.path == '/api/v1/auth/login' && req.post?
  end

  throttle('registrations/ip', limit: 5, period: 20.minutes) do |req|
    req.ip if req.path == '/api/v1/auth/register' && req.post?
  end

  self.throttled_responder = lambda do |_env|
    [429, { 'Content-Type' => 'application/json' }, [{ error: 'Too many requests. Please try again later.' }.to_json]]
  end
end
