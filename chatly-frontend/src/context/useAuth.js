import { useContext } from "react";
import { AuthContext } from "./auth-store";

export const useAuth = () => useContext(AuthContext);
