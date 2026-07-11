class User < ApplicationRecord
  has_secure_password

  validates :email, presence: true,
                    uniqueness: { case_sensitive: false },
                    format: { with: URI::MailTo::EMAIL_REGEXP }

  validates :password, length: { minimum: 8 },
                       if: -> { new_record? || password.present? }

  before_save :downcase_email

  enum :role, { user: 0, admin: 1 }


  def self.find_by_email(email)
    find_by("LOWER(email) = ?", email.downcase)
  end

  def self.authenticate(email, password)
    user = find_by_email(email)
    return nil unless user

    user.authenticate(password) || nil
  end

  private

  def downcase_email
    self.email = email.downcase
  end
end
