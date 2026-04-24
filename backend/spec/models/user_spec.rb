require 'rails_helper'

RSpec.describe User, type: :model do
  subject(:user) { build(:user) }

  describe 'associations' do
    it { should have_many(:watchlist_items).dependent(:destroy) }
    it { should have_many(:watched_properties).through(:watchlist_items).source(:property) }
  end

  describe 'validations' do
    it { should validate_presence_of(:name) }
    it { should validate_presence_of(:email) }
    it { should validate_uniqueness_of(:email).case_insensitive }

    it 'is valid with valid attributes' do
      expect(user).to be_valid
    end

    it 'is invalid with a bad email format' do
      user.email = 'not-an-email'
      expect(user).not_to be_valid
      expect(user.errors[:email]).to be_present
    end

    it 'is invalid with a short password' do
      user.password = 'abc'
      expect(user).not_to be_valid
    end
  end

  describe 'email downcasing' do
    it 'saves email in lowercase' do
      user.email = 'TEST@EXAMPLE.COM'
      user.save!
      expect(user.reload.email).to eq('test@example.com')
    end
  end

  describe '#authenticate' do
    let!(:saved_user) { create(:user, password: 'password123') }

    it 'returns user with correct password' do
      expect(saved_user.authenticate('password123')).to eq(saved_user)
    end

    it 'returns false with wrong password' do
      expect(saved_user.authenticate('wrongpassword')).to be_falsey
    end
  end
end
