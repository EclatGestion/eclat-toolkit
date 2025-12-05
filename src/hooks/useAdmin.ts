import { useAuth } from "@/contexts/AuthContext";

// Liste des emails administrateurs (doit correspondre à l'edge function)
const ADMIN_EMAILS = ["a.negro@eclat-gp.com"];

export function useAdmin() {
  const { user } = useAuth();
  
  const isAdmin = user?.email ? ADMIN_EMAILS.includes(user.email) : false;
  
  return { isAdmin };
}
