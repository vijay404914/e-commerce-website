Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      scope :auth do
        post :register, to: "registrations#create"
        post :login,    to: "auth#login"
        post :logout,   to: "auth#logout"
      end
    end
  end
end
