Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :orders
      resources :carts, only: [:show, :destroy, :create] do
        delete "items/:id", action: :remove_item
        patch "items/:id", action: :update_item
      end
    end
  end
end
