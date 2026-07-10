# app/serializers/payment_serializer.rb

class PaymentSerializer < ActiveModel::Serializer
  attributes :id,
             :order_id,
             :user_id,
             :amount,
             :currency,
             :payment_method,
             :payment_status,
             :transaction_id,
             :gateway_name,
             :gateway_payment_id,
             :gateway_order_id,
             :failure_reason,
             :paid_at,
             :refunded_at,
             :created_at,
             :updated_at
end