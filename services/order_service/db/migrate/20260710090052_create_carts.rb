class CreateCarts < ActiveRecord::Migration[8.0]
  def change
    create_table :carts do |t|
      t.bigint :user_id
      t.string :status

      t.timestamps
    end
  end
end
