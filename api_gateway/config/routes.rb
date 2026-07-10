Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      match "/auth",
            to: "proxy#forward",
            defaults: { service: "user" },
            via: :all

      match "/auth/*path",
            to: "proxy#forward",
            defaults: { service: "user" },
            via: :all

      match "/products",
            to: "proxy#forward",
            defaults: { service: "product" },
            via: :all

      match "/products/*path",
            to: "proxy#forward",
            defaults: { service: "product" },
            via: :all

      match "/inventories",
            to: "proxy#forward",
            defaults: { service: "inventory" },
            via: :all

      match "/inventories/*path",
            to: "proxy#forward",
            defaults: { service: "inventory" },
            via: :all

      match "/orders",
            to: "proxy#forward",
            defaults: { service: "order" },
            via: :all

      match "/orders/*path",
            to: "proxy#forward",
            defaults: { service: "order" },
            via: :all

      match "/carts",
          to: "proxy#forward",
          defaults: { service: "order" },
          via: :all

      match "/carts/*path",
            to: "proxy#forward",
            defaults: { service: "order" },
            via: :all

      match "/payments",
            to: "proxy#forward",
            defaults: { service: "payment" },
            via: :all

      match "/payments/*path",
            to: "proxy#forward",
            defaults: { service: "payment" },
            via: :all
    end
  end
end
