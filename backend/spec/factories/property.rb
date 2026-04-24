FactoryBot.define do
  factory :property do
    title         { Faker::Lorem.sentence(word_count: 4) }
    description   { Faker::Lorem.paragraph(sentence_count: 3) }
    price         { Faker::Number.between(from: 300_000, to: 3_000_000).to_f }
    bedrooms      { Faker::Number.between(from: 1, to: 5) }
    bathrooms     { Faker::Number.between(from: 1, to: 3) }
    property_type { Property::PROPERTY_TYPES.sample }
    address       { Faker::Address.street_address }
    suburb        { Faker::Address.city }
    state         { 'NSW' }
    postcode      { Faker::Address.zip_code.first(4) }
    status        { 'active' }
    images        { [] }

    trait :under_contract do
      status { 'under_contract' }
    end

    trait :sold do
      status { 'sold' }
    end

    trait :house do
      property_type { 'house' }
    end

    trait :apartment do
      property_type { 'apartment' }
      bedrooms      { Faker::Number.between(from: 1, to: 3) }
    end
  end
end
