class Api::V1::RegistrationsController < ApplicationController
  skip_before_action :authenticate_request, only: [ :create ]
  def create
    user = User.new(user_params)

    if user.save
      render json: {
        user: UserSerializer.new(user)
      }, status: :created

    else
      render json: {
        errors: user.errors.full_messages
      }, status: :unprocessable_entity
    end
  end

  private

  def user_params
    params.permit(:first_name, :last_name, :email, :password, :password_confirmation)
  end
end
