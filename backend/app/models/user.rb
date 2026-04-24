class User < ApplicationRecord
  has_secure_password

  has_many :watchlist_items, dependent: :destroy
  has_many :watched_properties, through: :watchlist_items, source: :property

  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :name, presence: true
  validates :password, length: { minimum: 6 }, if: -> { new_record? || !password.nil? }

  before_save :downcase_email

  private

  def downcase_email
    self.email = email.downcase
  end
end
