class CreatePayments < ActiveRecord::Migration[8.0]
  def change
    create_table :payments do |t|
      t.bigint :order_id
      t.bigint :user_id
      t.decimal :amount
      t.string :currency
      t.string :payment_method
      t.string :payment_status
      t.string :transaction_id
      t.string :gateway_name
      t.string :gateway_payment_id
      t.string :gateway_order_id
      t.text :gateway_response
      t.text :failure_reason
      t.datetime :paid_at
      t.datetime :refunded_at

      t.timestamps
    end
  end
end
