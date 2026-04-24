module Api
  module V1
    class AuthController < ApplicationController
      skip_before_action :authenticate_request, only: [:register, :login]

      def register
        user = User.new(register_params)
        if user.save
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            message: 'Registration successful',
            token: token,
            user: user_payload(user)
          }, status: :created
        else
          render_unprocessable(user.errors.full_messages)
        end
      end

      def login
        user = User.find_by(email: params[:email]&.downcase)

        if user&.authenticate(params[:password])
          token = JsonWebToken.encode(user_id: user.id)
          render json: {
            message: 'Login successful',
            token: token,
            user: user_payload(user)
          }
        else
          render json: { error: 'Invalid email or password' }, status: :unauthorized
        end
      end

      def me
        render json: { user: user_payload(current_user) }
      end

      private

      def register_params
        params.permit(:name, :email, :password, :password_confirmation)
      end

      def user_payload(user)
        {
          id: user.id,
          name: user.name,
          email: user.email,
          created_at: user.created_at
        }
      end
    end
  end
end
