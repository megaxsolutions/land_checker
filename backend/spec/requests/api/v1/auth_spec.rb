require 'rails_helper'

RSpec.describe 'Api::V1::Auth', type: :request do
  describe 'POST /api/v1/auth/register' do
    let(:valid_params) do
      {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        password_confirmation: 'password123'
      }
    end

    context 'with valid params' do
      it 'creates a new user and returns a token' do
        post '/api/v1/auth/register', params: valid_params, as: :json

        expect(response).to have_http_status(:created)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
        expect(json['user']['email']).to eq('test@example.com')
      end
    end

    context 'with invalid params' do
      it 'returns errors for duplicate email' do
        create(:user, email: 'test@example.com')
        post '/api/v1/auth/register', params: valid_params, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
        json = JSON.parse(response.body)
        expect(json['errors']).to be_present
      end

      it 'returns errors for missing fields' do
        post '/api/v1/auth/register', params: { email: 'bad' }, as: :json

        expect(response).to have_http_status(:unprocessable_entity)
      end
    end
  end

  describe 'POST /api/v1/auth/login' do
    let!(:user) { create(:user, email: 'login@example.com', password: 'secret123') }

    context 'with valid credentials' do
      it 'returns a token' do
        post '/api/v1/auth/login', params: { email: 'login@example.com', password: 'secret123' }, as: :json

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['token']).to be_present
      end
    end

    context 'with invalid credentials' do
      it 'returns unauthorized for wrong password' do
        post '/api/v1/auth/login', params: { email: 'login@example.com', password: 'wrong' }, as: :json

        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns unauthorized for non-existent email' do
        post '/api/v1/auth/login', params: { email: 'nobody@example.com', password: 'password123' }, as: :json

        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'GET /api/v1/auth/me' do
    let!(:user) { create(:user) }
    let(:token) { JsonWebToken.encode(user_id: user.id) }

    it 'returns the current user' do
      get '/api/v1/auth/me', headers: { 'Authorization' => "Bearer #{token}" }

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['user']['id']).to eq(user.id)
    end

    it 'returns unauthorized without a token' do
      get '/api/v1/auth/me'
      expect(response).to have_http_status(:unauthorized)
    end
  end
end
