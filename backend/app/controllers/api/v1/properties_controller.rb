module Api
  module V1
    class PropertiesController < ApplicationController
      skip_before_action :authenticate_request, only: [:index, :show]

      def index
        properties = Property.all
        properties = properties.keyword(params[:keyword])
        properties = properties.price_min(params[:price_min])
        properties = properties.price_max(params[:price_max])
        properties = properties.by_bedrooms(params[:bedrooms])
        properties = properties.by_type(params[:property_type])
        properties = properties.ordered

        per_page = (params[:per_page] || 12).to_i.clamp(1, 100)
        properties = properties.page(params[:page]).per(per_page)

        render json: {
          properties: properties.map { |p| property_payload(p) },
          meta: {
            current_page: properties.current_page,
            total_pages: properties.total_pages,
            total_count: properties.total_count,
            per_page: per_page
          }
        }
      end

      def show
        property = Property.find(params[:id])
        render json: { property: property_payload(property) }
      rescue ActiveRecord::RecordNotFound
        render_not_found('Property not found')
      end

      private

      def property_payload(property)
        {
          id: property.id,
          title: property.title,
          description: property.description,
          price: property.price,
          bedrooms: property.bedrooms,
          bathrooms: property.bathrooms,
          property_type: property.property_type,
          address: property.address,
          suburb: property.suburb,
          state: property.state,
          postcode: property.postcode,
          latitude: property.latitude,
          longitude: property.longitude,
          status: property.status,
          images: property.images,
          created_at: property.created_at,
          updated_at: property.updated_at
        }
      end
    end
  end
end
