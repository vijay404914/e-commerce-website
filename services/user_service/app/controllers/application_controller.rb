class ApplicationController < ActionController::API
  include Authenticatable

  rescue_from StandardError, with: :handle_standard_error
  rescue_from ActiveRecord::RecordNotFound, with: :handle_not_found
  rescue_from ActionController::ParameterMissing, with: :handle_parameter_missing

  private

  def handle_standard_error(error)
    Rails.logger.error("Unhandled error: #{error.message}")
    Rails.logger.error(error.backtrace.join("\n"))

    render json: { error: "Internal server error" }, status: :internal_server_error
  end

  def handle_not_found(error)
    render json: { error: "Resource not found" }, status: :not_found
  end

  def handle_parameter_missing(error)
    render json: { error: error.message }, status: :bad_request
  end
end
