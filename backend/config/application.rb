require_relative 'boot'
require 'rails/all'

Bundler.require(*Rails.groups)

module PropertySearchApp
  class Application < Rails::Application
    config.load_defaults 7.1
    config.api_only = true
    config.time_zone = 'UTC'
    config.active_record.default_timezone = :utc

    config.middleware.use ActionDispatch::Cookies
    config.middleware.use ActionDispatch::Session::CookieStore

    config.action_cable.mount_path = '/cable'
    config.action_cable.allowed_request_origins = [
      /http:\/\/localhost:.*/,
      /https?:\/\/.*/
    ]
  end
end
