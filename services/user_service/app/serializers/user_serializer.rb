# app/serializers/user_serializer.rb

class UserSerializer < ActiveModel::Serializer
  attributes :id,
             :first_name,
             :last_name,
             :email,
             :mobile_number,
             :created_at
end
