class ApplicationRecord < ActiveRecord::Base
  primary_key_type :id
  self.abstract_class = true
end
