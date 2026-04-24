FactoryBot.define do
  factory :watchlist_item do
    association :user
    association :property
  end
end
