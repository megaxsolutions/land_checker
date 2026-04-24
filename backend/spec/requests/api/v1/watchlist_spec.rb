require 'rails_helper'

RSpec.describe 'Api::V1::Watchlist', type: :request do
  let!(:user)     { create(:user) }
  let!(:property) { create(:property) }
  let(:token)     { JsonWebToken.encode(user_id: user.id) }
  let(:headers)   { { 'Authorization' => "Bearer #{token}" } }

  describe 'GET /api/v1/watchlist' do
    context 'when authenticated' do
      it 'returns the users watchlist' do
        create(:watchlist_item, user: user, property: property)
        get '/api/v1/watchlist', headers: headers

        expect(response).to have_http_status(:ok)
        json = JSON.parse(response.body)
        expect(json['watchlist'].length).to eq(1)
      end
    end

    context 'when unauthenticated' do
      it 'returns 401' do
        get '/api/v1/watchlist'
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/v1/watchlist' do
    it 'adds a property to the watchlist' do
      post '/api/v1/watchlist', params: { property_id: property.id }, headers: headers, as: :json

      expect(response).to have_http_status(:created)
      json = JSON.parse(response.body)
      expect(json['watchlist_item']['property_id']).to eq(property.id)
    end

    it 'returns error for duplicate watchlist item' do
      create(:watchlist_item, user: user, property: property)
      post '/api/v1/watchlist', params: { property_id: property.id }, headers: headers, as: :json

      expect(response).to have_http_status(:unprocessable_entity)
    end

    it 'returns 404 for non-existent property' do
      post '/api/v1/watchlist', params: { property_id: 99999 }, headers: headers, as: :json

      expect(response).to have_http_status(:not_found)
    end
  end

  describe 'DELETE /api/v1/watchlist/:id' do
    let!(:item) { create(:watchlist_item, user: user, property: property) }

    it 'removes a property from the watchlist' do
      delete "/api/v1/watchlist/#{item.id}", headers: headers

      expect(response).to have_http_status(:ok)
      expect(WatchlistItem.find_by(id: item.id)).to be_nil
    end

    it 'returns 404 for non-existent item' do
      delete '/api/v1/watchlist/99999', headers: headers
      expect(response).to have_http_status(:not_found)
    end
  end
end
