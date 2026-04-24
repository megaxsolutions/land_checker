puts 'Seeding database...'

# Clean existing data
WatchlistItem.destroy_all
Property.destroy_all
User.destroy_all

# Create test users
admin = User.create!(
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'password123'
)

buyer = User.create!(
  name: 'Jane Buyer',
  email: 'jane@example.com',
  password: 'password123'
)

puts "Created #{User.count} users"

# Property data
suburbs = {
  'Sydney' => { state: 'NSW', postcodes: ['2000', '2010', '2026', '2060', '2065'] },
  'Melbourne' => { state: 'VIC', postcodes: ['3000', '3004', '3121', '3141', '3205'] },
  'Brisbane' => { state: 'QLD', postcodes: ['4000', '4006', '4101', '4120', '4151'] },
  'Perth' => { state: 'WA', postcodes: ['6000', '6005', '6008', '6009', '6018'] },
  'Adelaide' => { state: 'SA', postcodes: ['5000', '5006', '5035', '5041', '5062'] }
}

property_types = Property::PROPERTY_TYPES
statuses = Property::STATUSES

streets = ['Main St', 'High St', 'Park Ave', 'Oak Rd', 'River Dr', 'Beach Rd', 'Hill St', 'Lake Ave', 'Forest Rd', 'Valley Way']

properties_data = []

60.times do |i|
  suburb_data = suburbs.to_a.sample
  suburb_name = suburb_data[0]
  state = suburb_data[1][:state]
  postcode = suburb_data[1][:postcodes].sample
  property_type = property_types.sample
  status = i < 45 ? 'active' : (i < 55 ? 'under_contract' : 'sold')

  bedrooms = case property_type
             when 'land', 'commercial' then 0
             when 'apartment', 'unit' then rand(1..3)
             else rand(2..5)
             end

  bathrooms = [bedrooms - 1, 1].max
  base_price = case state
               when 'NSW' then rand(600_000..3_000_000)
               when 'VIC' then rand(550_000..2_500_000)
               when 'QLD' then rand(450_000..1_800_000)
               when 'WA'  then rand(400_000..1_500_000)
               else rand(350_000..1_200_000)
               end

  lat_base = { 'NSW' => -33.8688, 'VIC' => -37.8136, 'QLD' => -27.4698, 'WA' => -31.9505, 'SA' => -34.9285 }
  lng_base = { 'NSW' => 151.2093, 'VIC' => 144.9631, 'QLD' => 153.0251, 'WA' => 115.8605, 'SA' => 138.6007 }

  descriptions = [
    "Stunning #{property_type} in the heart of #{suburb_name}. Features modern kitchen, open plan living, and private outdoor entertaining area. Close to schools, shops, and public transport.",
    "Beautiful #{bedrooms}-bedroom #{property_type} in sought-after #{suburb_name}. Recently renovated with high-end finishes throughout. Perfect for families or investors.",
    "Charming #{property_type} nestled in a quiet street in #{suburb_name}. Spacious rooms, natural light, and a lovely garden. Move-in ready.",
    "Contemporary #{property_type} offering the best of #{suburb_name} living. Open-plan design, quality appliances, and easy access to local amenities.",
    "Luxurious #{property_type} in premier #{suburb_name} location. Exceptional build quality with premium materials throughout."
  ]

  properties_data << {
    title: "#{bedrooms > 0 ? "#{bedrooms} Bed " : ''}#{property_type.capitalize} in #{suburb_name}",
    description: descriptions.sample,
    price: base_price,
    bedrooms: bedrooms,
    bathrooms: bathrooms,
    property_type: property_type,
    address: "#{rand(1..200)} #{streets.sample}",
    suburb: suburb_name,
    state: state,
    postcode: postcode,
    latitude: (lat_base[state] + rand(-0.1..0.1)).round(7),
    longitude: (lng_base[state] + rand(-0.1..0.1)).round(7),
    status: status,
    images: (1..rand(3..6)).map { |j| "https://picsum.photos/seed/prop#{i}img#{j}/800/600" }
  }
end

properties_data.each { |data| Property.create!(data) }
puts "Created #{Property.count} properties"

# Create some watchlist items
5.times do
  property = Property.active.sample
  next unless property
  WatchlistItem.find_or_create_by(user: buyer, property: property)
end

puts "Created #{WatchlistItem.count} watchlist items"
puts 'Seeding complete!'
puts "\nTest credentials:"
puts "  Admin: admin@example.com / password123"
puts "  Buyer: jane@example.com  / password123"
