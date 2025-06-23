import { JSX } from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth";

type Props = {
  children: JSX.Element;
};

export default function PrivateRoute({ children }: Props) {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
}
