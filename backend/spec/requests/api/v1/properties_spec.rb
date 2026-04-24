require 'rails_helper'

RSpec.describe 'Api::V1::Properties', type: :request do
  let!(:house)     { create(:property, property_type: 'house', price: 500_000, bedrooms: 3, suburb: 'Bondi', status: 'active') }
  let!(:apartment) { create(:property, property_type: 'apartment', price: 900_000, bedrooms: 2, suburb: 'Sydney CBD', status: 'active') }
  let!(:sold)      { create(:property, property_type: 'house', price: 700_000, bedrooms: 4, status: 'sold') }

  describe 'GET /api/v1/properties' do
    it 'returns all properties with pagination' do
      get '/api/v1/properties'

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['properties']).to be_an(Array)
      expect(json['meta']).to include('current_page', 'total_pages', 'total_count', 'per_page')
    end

    context 'filtering' do
      it 'filters by property_type' do
        get '/api/v1/properties', params: { property_type: 'apartment' }
        json = JSON.parse(response.body)
        expect(json['properties'].map { |p| p['property_type'] }.uniq).to eq(['apartment'])
      end

      it 'filters by price_min' do
        get '/api/v1/properties', params: { price_min: 600_000 }
        json = JSON.parse(response.body)
        prices = json['properties'].map { |p| p['price'].to_f }
        expect(prices.all? { |p| p >= 600_000 }).to be true
      end

      it 'filters by price_max' do
        get '/api/v1/properties', params: { price_max: 600_000 }
        json = JSON.parse(response.body)
        prices = json['properties'].map { |p| p['price'].to_f }
        expect(prices.all? { |p| p <= 600_000 }).to be true
      end

      it 'filters by bedrooms' do
        get '/api/v1/properties', params: { bedrooms: 3 }
        json = JSON.parse(response.body)
        expect(json['properties'].map { |p| p['bedrooms'] }.uniq).to eq([3])
      end

      it 'filters by keyword (suburb)' do
        get '/api/v1/properties', params: { keyword: 'Bondi' }
        json = JSON.parse(response.body)
        expect(json['properties'].any? { |p| p['suburb'] == 'Bondi' }).to be true
      end
    end

    context 'pagination' do
      it 'respects per_page param' do
        get '/api/v1/properties', params: { per_page: 1 }
        json = JSON.parse(response.body)
        expect(json['properties'].length).to eq(1)
        expect(json['meta']['per_page']).to eq(1)
      end
    end
  end

  describe 'GET /api/v1/properties/:id' do
    it 'returns a single property' do
      get "/api/v1/properties/#{house.id}"

      expect(response).to have_http_status(:ok)
      json = JSON.parse(response.body)
      expect(json['property']['id']).to eq(house.id)
    end

    it 'returns 404 for non-existent property' do
      get '/api/v1/properties/99999'
      expect(response).to have_http_status(:not_found)
    end
  end
end
