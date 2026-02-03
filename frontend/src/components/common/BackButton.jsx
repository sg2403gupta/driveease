import { ArrowLeft } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const BackButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide on home page
  if (location.pathname === "/") return null;

  return (
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 rounded-lg border border-border-light px-3 py-1.5
                 text-sm font-medium text-text-primary-light transition
                 hover:bg-bg-muted-light
                 dark:border-border-dark dark:text-text-primary-dark
                 dark:hover:bg-bg-muted-dark"
    >
      <ArrowLeft className="h-4 w-4" />
      Back
    </button>
  );
};

export default BackButton;
