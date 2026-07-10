class CreateRefunds < ActiveRecord::Migration[8.0]
  def change
    create_table :refunds do |t|
      t.references :payment, null: false, foreign_key: true
      t.decimal :refund_amount
      t.text :refund_reason
      t.string :refund_status
      t.string :gateway_refund_id
      t.text :gateway_response

      t.timestamps
    end
  end
end
