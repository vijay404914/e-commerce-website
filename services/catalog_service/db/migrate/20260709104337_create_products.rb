class CreateProducts < ActiveRecord::Migration[8.0]
  def change
    create_table :products do |t|
      t.string  :name, null: false
      t.text    :description
      t.string  :sku, null: false
      t.string  :category
      t.string  :brand
      t.decimal :price, precision: 10, scale: 2, null: false
      t.integer :stock, default: 0
      t.integer :status, default: 0
      t.float   :weight
      t.string  :color

      t.timestamps
    end
  end
end