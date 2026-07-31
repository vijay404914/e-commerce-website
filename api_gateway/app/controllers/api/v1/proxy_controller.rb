class Api::V1::ProxyController < ApplicationController
  skip_before_action :authenticate_request, if: :public_route?
  def forward
    response = ProxyService.new(
      request,
      params[:service],
      params[:path],
      current_user_id
    ).call

    render json: response.parsed_response,
           status: response.code
  end

  private

  def public_route?
    return false unless params[:service] == "user"

    public_paths = [
      "",
      "login",
      "register",
      "refresh"
    ]

    public_paths.include?(params[:path].to_s)
  end
end
