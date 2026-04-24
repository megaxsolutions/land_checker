class PropertyUpdatesChannel < ApplicationCable::Channel
  def subscribed
    stream_from 'property_updates'
  end

  def unsubscribed
    stop_all_streams
  end
end
