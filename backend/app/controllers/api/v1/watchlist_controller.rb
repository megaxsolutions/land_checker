module Api
  module V1
    class WatchlistController < ApplicationController
      def index
        watchlist_items = current_user.watchlist_items.includes(:property).order(created_at: :desc)
        render json: {
          watchlist: watchlist_items.map { |item| watchlist_payload(item) }
        }
      end

      def create
        property = Property.find(params[:property_id])
        item = current_user.watchlist_items.build(property: property)

        if item.save
          render json: {
            message: 'Property added to watchlist',
            watchlist_item: watchlist_payload(item)
          }, status: :created
        else
          render_unprocessable(item.errors.full_messages)
        end
      rescue ActiveRecord::RecordNotFound
        render_not_found('Property not found')
      end

      def destroy
        item = current_user.watchlist_items.find(params[:id])
        item.destroy
        render json: { message: 'Property removed from watchlist' }
      rescue ActiveRecord::RecordNotFound
        render_not_found('Watchlist item not found')
      end

      private

      def watchlist_payload(item)
        {
          id: item.id,
          property_id: item.property_id,
          property: {
            id: item.property.id,
            title: item.property.title,
            price: item.property.price,
            suburb: item.property.suburb,
            state: item.property.state,
            bedrooms: item.property.bedrooms,
            bathrooms: item.property.bathrooms,
            property_type: item.property.property_type,
            status: item.property.status
          },
          created_at: item.created_at
        }
      end
    end
  end
end
