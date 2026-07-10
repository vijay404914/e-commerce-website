class CreateInventories < ActiveRecord::Migration[8.0]
  def change
    create_table :inventories do |t|
      t.bigint :product_id
      t.integer :quantity

      t.timestamps
    end
  end
end
