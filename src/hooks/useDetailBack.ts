import { useNavigate } from "react-router-dom";

export function useDetailBack(fallbackPath: string) {
  const navigate = useNavigate();

  return () => {
    // BrowserRouter initializes direct entries at 0 and increments for in-app visits.
    const historyIndex: unknown = window.history.state?.idx;

    if (typeof historyIndex === "number" && historyIndex > 0) {
      navigate(-1);
    } else {
      navigate(fallbackPath);
    }
  };
}
