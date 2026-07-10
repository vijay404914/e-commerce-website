# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.0].define(version: 2026_07_10_080018) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "payments", force: :cascade do |t|
    t.bigint "order_id"
    t.bigint "user_id"
    t.decimal "amount"
    t.string "currency"
    t.string "payment_method"
    t.string "payment_status"
    t.string "transaction_id"
    t.string "gateway_name"
    t.string "gateway_payment_id"
    t.string "gateway_order_id"
    t.text "gateway_response"
    t.text "failure_reason"
    t.datetime "paid_at"
    t.datetime "refunded_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "refunds", force: :cascade do |t|
    t.bigint "payment_id", null: false
    t.decimal "refund_amount"
    t.text "refund_reason"
    t.string "refund_status"
    t.string "gateway_refund_id"
    t.text "gateway_response"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["payment_id"], name: "index_refunds_on_payment_id"
  end

  add_foreign_key "refunds", "payments"
end
