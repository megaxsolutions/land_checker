class WatchlistItem < ApplicationRecord
  belongs_to :user
  belongs_to :property

  validates :user_id,     presence: true
  validates :property_id, presence: true,
                          uniqueness: { scope: :user_id, message: 'already in watchlist' }
end
