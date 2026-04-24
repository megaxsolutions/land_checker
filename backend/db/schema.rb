# This file is auto-generated from the current state of the database.
# Run `rails db:schema:load` to recreate the database.

ActiveRecord::Schema[7.1].define(version: 2024_01_01_000003) do
  enable_extension "plpgsql"

  create_table "users", force: :cascade do |t|
    t.string "name",            null: false
    t.string "email",           null: false
    t.string "password_digest", null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  create_table "properties", force: :cascade do |t|
    t.string  "title",         null: false
    t.text    "description",   null: false
    t.decimal "price",         precision: 12, scale: 2, null: false
    t.integer "bedrooms",      null: false, default: 0
    t.integer "bathrooms",     null: false, default: 0
    t.string  "property_type", null: false
    t.string  "address",       null: false
    t.string  "suburb",        null: false
    t.string  "state",         null: false
    t.string  "postcode",      null: false
    t.decimal "latitude",      precision: 10, scale: 7
    t.decimal "longitude",     precision: 10, scale: 7
    t.string  "status",        null: false, default: "active"
    t.jsonb   "images",        default: []
    t.datetime "created_at",   null: false
    t.datetime "updated_at",   null: false
    t.index ["bedrooms"], name: "index_properties_on_bedrooms"
    t.index ["price"], name: "index_properties_on_price"
    t.index ["property_type"], name: "index_properties_on_property_type"
    t.index ["status"], name: "index_properties_on_status"
    t.index ["suburb"], name: "index_properties_on_suburb"
    t.index ["status", "property_type"], name: "index_properties_on_status_and_property_type"
  end

  create_table "watchlist_items", force: :cascade do |t|
    t.bigint "user_id",     null: false
    t.bigint "property_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["property_id"], name: "index_watchlist_items_on_property_id"
    t.index ["user_id", "property_id"], name: "index_watchlist_items_on_user_id_and_property_id", unique: true
    t.index ["user_id"], name: "index_watchlist_items_on_user_id"
  end

  add_foreign_key "watchlist_items", "properties"
  add_foreign_key "watchlist_items", "users"
end
