Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do

      match "/auth",
            to: "proxy#forward",
            defaults: { service: "user", path: "" },
            via: :all

      match "/auth/*path",
            to: "proxy#forward",
            defaults: { service: "user" },
            via: :all

      match "/products",
            to: "proxy#forward",
            defaults: { service: "product", path: "products" },
            via: :all

      match "/products/*path",
            to: "proxy#forward",
            defaults: { service: "product" },
            via: :all
    end
  end
end