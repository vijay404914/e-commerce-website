import { Navigate } from "react-router-dom";
import { getToken } from "../services/token.service";

export default function PublicRoute({ children }) {
  return getToken() ? <Navigate to="/" replace /> : children;
}