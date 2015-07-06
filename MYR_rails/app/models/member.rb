class Member < ActiveRecord::Base
	attr_accessor :remember_token, :activation_token
	before_save { self.email = email.downcase }
# Associations
	before_create :create_activation_digest
	belongs_to :team


# Validations
    validates :name, presence: true, uniqueness: true, length: { in: 3..30, too_long: "%{count} characters is the maximum allowed", too_short:"%{count} characters is the minimum allowed"  }
    has_secure_password
    validates :password, presence: true, confirmation: true, length: { in: 6..30, too_long: "%{count} characters is the maximum allowed", too_short:"%{count} characters is the minimum allowed"  }
    validates :email, presence: true, uniqueness: true, length: { in: 5..300, too_long: "%{count} characters is the maximum allowed", too_short:"%{count} characters is the minimum allowed"  }, format: {with: /\A([^@\s]+)@((?:[-a-z0-9]+\.)+[a-z]{2,})\z/i, message: 'must be a email address ex: exemple@ofE.mail'}
    validates :role, inclusion: { in: %w(administrator visitor player), message: "%{value} is not a valid role" }, allow_nil: true
    validates :logo, allow_blank: true, format: {with: %r{\.(gif|jpg|png)\Z}i, message: 'must be a URL for GIF, JPG or PNG image'}
    validate :valid_size
    def valid_size
        if self.logo != ""
            if FastImage.size(self.logo)!= nil
                if FastImage.size(self.logo)[0] > 150
                    errors.add(:logo, "width must be under 150 pixels")
                end
                if FastImage.size(self.logo)[1] > 150
                    errors.add(:logo, "height must be under 150 pixels")
                end
            end
        end
    end
    
    def Member.digest(string)
		  cost = ActiveModel::SecurePassword.min_cost ? BCrypt::Engine::MIN_COST :
		                                                BCrypt::Engine.cost
		  BCrypt::Password.create(string, cost: cost)
		  #need to check cost https://www.railstutorial.org/book/log_in_log_out
		end
    
    def Member.new_token
    	SecureRandom.urlsafe_base64
  	end
  	
  	def remember
			self.remember_token = Member.new_token
			update_attribute(:remember_digest, Member.digest(remember_token))
		end
		
		 # Returns true if the given token matches the digest.
		def authenticated?(remember_token)
			return false if remember_token.nil?
			BCrypt::Password.new(remember_digest).is_password?(remember_token)
		end
		
		# Forgets a user.
		def forget
			update_attribute(:remember_digest, nil)
		end
		
		private

		  # Converts email to all lower-case.
		  def downcase_email
		    self.email = email.downcase
		  end

		  # Creates and assigns the activation token and digest.
		  def create_activation_digest
		    self.activation_token  = User.new_token
		    self.activation_digest = User.digest(activation_token)
		  end
		
end
