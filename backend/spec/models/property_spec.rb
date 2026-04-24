require 'rails_helper'

RSpec.describe Property, type: :model do
  subject(:property) { build(:property) }

  describe 'associations' do
    it { should have_many(:watchlist_items).dependent(:destroy) }
    it { should have_many(:watchers).through(:watchlist_items).source(:user) }
  end

  describe 'validations' do
    it { should validate_presence_of(:title) }
    it { should validate_presence_of(:description) }
    it { should validate_presence_of(:price) }
    it { should validate_presence_of(:bedrooms) }
    it { should validate_presence_of(:bathrooms) }
    it { should validate_presence_of(:property_type) }
    it { should validate_presence_of(:address) }
    it { should validate_presence_of(:suburb) }
    it { should validate_presence_of(:state) }
    it { should validate_presence_of(:postcode) }
    it { should validate_presence_of(:status) }

    it { should validate_inclusion_of(:property_type).in_array(Property::PROPERTY_TYPES) }
    it { should validate_inclusion_of(:status).in_array(Property::STATUSES) }

    it 'is valid with valid attributes' do
      expect(property).to be_valid
    end
  end

  describe 'scopes' do
    let!(:cheap_house) { create(:property, price: 400_000, bedrooms: 2, property_type: 'house', suburb: 'Bondi', status: 'active') }
    let!(:expensive_apartment) { create(:property, price: 1_500_000, bedrooms: 3, property_type: 'apartment', suburb: 'Sydney', status: 'active') }
    let!(:sold_villa) { create(:property, price: 800_000, bedrooms: 4, property_type: 'villa', suburb: 'Manly', status: 'sold') }

    describe '.price_min' do
      it 'filters properties by minimum price' do
        expect(Property.price_min(1_000_000)).to include(expensive_apartment)
        expect(Property.price_min(1_000_000)).not_to include(cheap_house)
      end
    end

    describe '.price_max' do
      it 'filters properties by maximum price' do
        expect(Property.price_max(500_000)).to include(cheap_house)
        expect(Property.price_max(500_000)).not_to include(expensive_apartment)
      end
    end

    describe '.by_bedrooms' do
      it 'filters properties by bedroom count' do
        expect(Property.by_bedrooms(2)).to include(cheap_house)
        expect(Property.by_bedrooms(2)).not_to include(expensive_apartment)
      end
    end

    describe '.by_type' do
      it 'filters properties by type' do
        expect(Property.by_type('house')).to include(cheap_house)
        expect(Property.by_type('house')).not_to include(expensive_apartment)
      end
    end

    describe '.keyword' do
      it 'searches by suburb' do
        expect(Property.keyword('Bondi')).to include(cheap_house)
        expect(Property.keyword('Bondi')).not_to include(expensive_apartment)
      end

      it 'searches by title' do
        prop = create(:property, title: 'Amazing waterfront property')
        expect(Property.keyword('waterfront')).to include(prop)
      end
    end

    describe '.active' do
      it 'returns only active properties' do
        expect(Property.active).to include(cheap_house, expensive_apartment)
        expect(Property.active).not_to include(sold_villa)
      end
    end
  end

  describe 'ActionCable broadcast' do
    let!(:property) { create(:property) }

    it 'broadcasts when status changes' do
      expect(ActionCable.server).to receive(:broadcast).with('property_updates', anything)
      property.update!(status: 'under_contract')
    end

    it 'broadcasts when price changes' do
      expect(ActionCable.server).to receive(:broadcast).with('property_updates', anything)
      property.update!(price: property.price + 50_000)
    end

    it 'does not broadcast when other fields change' do
      expect(ActionCable.server).not_to receive(:broadcast)
      property.update!(description: 'Updated description')
    end
  end
end
