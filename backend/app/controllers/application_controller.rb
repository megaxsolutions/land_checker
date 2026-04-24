class ApplicationController < ActionController::API
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate_request

  attr_reader :current_user

  private

  def authenticate_request
    token = extract_token
    return render_unauthorized('Missing token') unless token

    begin
      decoded = JsonWebToken.decode(token)
      @current_user = User.find(decoded[:user_id])
    rescue JWT::ExpiredSignature
      render_unauthorized('Token has expired')
    rescue JWT::DecodeError
      render_unauthorized('Invalid token')
    rescue ActiveRecord::RecordNotFound
      render_unauthorized('User not found')
    end
  end

  def extract_token
    auth_header = request.headers['Authorization']
    return nil unless auth_header&.start_with?('Bearer ')

    auth_header.split(' ').last
  end

  def render_unauthorized(message = 'Unauthorized')
    render json: { error: message }, status: :unauthorized
  end

  def render_not_found(message = 'Not found')
    render json: { error: message }, status: :not_found
  end

  def render_unprocessable(errors)
    render json: { errors: errors }, status: :unprocessable_entity
  end
end
