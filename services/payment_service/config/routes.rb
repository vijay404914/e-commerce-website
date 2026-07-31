Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      resources :payments, only: %i[index show create] do
        collection do
          post :webhook
        end
      end
    end
  end
end
