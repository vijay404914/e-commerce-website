class CreateOrders < ActiveRecord::Migration[8.0]
  def change
    create_table :orders do |t|
      t.bigint :user_id
      t.string :order_number
      t.string :status
      t.decimal :total_amount, precision: 10, scale: 2

      t.timestamps
    end
  end
end
