class Property < ApplicationRecord
  has_many :watchlist_items, dependent: :destroy
  has_many :watchers, through: :watchlist_items, source: :user

  PROPERTY_TYPES = %w[house apartment townhouse unit villa land commercial].freeze
  STATUSES = %w[active under_contract sold].freeze

  validates :title,         presence: true
  validates :description,   presence: true
  validates :price,         presence: true, numericality: { greater_than: 0 }
  validates :bedrooms,      presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :bathrooms,     presence: true, numericality: { only_integer: true, greater_than_or_equal_to: 0 }
  validates :property_type, presence: true, inclusion: { in: PROPERTY_TYPES }
  validates :address,       presence: true
  validates :suburb,        presence: true
  validates :state,         presence: true
  validates :postcode,      presence: true
  validates :status,        presence: true, inclusion: { in: STATUSES }

  scope :active,        -> { where(status: 'active') }
  scope :by_type,       ->(type) { where(property_type: type) if type.present? }
  scope :by_bedrooms,   ->(n) { where(bedrooms: n.to_i) if n.present? }
  scope :price_min,     ->(min) { where('price >= ?', min.to_f) if min.present? }
  scope :price_max,     ->(max) { where('price <= ?', max.to_f) if max.present? }
  scope :keyword,       ->(kw) {
    if kw.present?
      term = "%#{sanitize_sql_like(kw)}%"
      where('title ILIKE ? OR description ILIKE ? OR suburb ILIKE ?', term, term, term)
    end
  }
  scope :ordered, -> { order(created_at: :desc) }

  after_update :broadcast_update, if: :should_broadcast?

  private

  def should_broadcast?
    saved_change_to_status? || saved_change_to_price?
  end

  def broadcast_update
    ActionCable.server.broadcast(
      'property_updates',
      {
        id: id,
        title: title,
        price: price,
        status: status,
        event: 'property_updated'
      }
    )
  end
end
