Rails.application.routes.draw do
  mount ActionCable.server => '/cable'

  namespace :api do
    namespace :v1 do
      post 'auth/register', to: 'auth#register'
      post 'auth/login',    to: 'auth#login'
      get  'auth/me',       to: 'auth#me'

      resources :properties, only: [:index, :show]

      resources :watchlist, only: [:index, :create, :destroy]
    end
  end

  get '/health', to: proc { [200, {}, ['OK']] }
end
