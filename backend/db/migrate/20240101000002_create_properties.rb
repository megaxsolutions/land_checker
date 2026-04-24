class CreateProperties < ActiveRecord::Migration[7.1]
  def change
    create_table :properties do |t|
      t.string  :title,         null: false
      t.text    :description,   null: false
      t.decimal :price,         null: false, precision: 12, scale: 2
      t.integer :bedrooms,      null: false, default: 0
      t.integer :bathrooms,     null: false, default: 0
      t.string  :property_type, null: false
      t.string  :address,       null: false
      t.string  :suburb,        null: false
      t.string  :state,         null: false
      t.string  :postcode,      null: false
      t.decimal :latitude,      precision: 10, scale: 7
      t.decimal :longitude,     precision: 10, scale: 7
      t.string  :status,        null: false, default: 'active'
      t.jsonb   :images,        default: []

      t.timestamps
    end

    add_index :properties, :property_type
    add_index :properties, :status
    add_index :properties, :suburb
    add_index :properties, :price
    add_index :properties, :bedrooms
    add_index :properties, [:status, :property_type]
  end
end
