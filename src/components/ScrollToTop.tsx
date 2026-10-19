import { useEffect, useLayoutEffect } from "react";
import { useLocation } from "react-router-dom";

const isProjectSectionLink = (pathname: string, hash: string) => {
  if (hash === "#individual-interaction") {
    return /^\/project\/[^/]+$/.test(pathname);
  }

  return /^\/project\/team\/[^/]+$/.test(pathname) &&
    (hash === "#team-film" || hash === "#team-interaction");
};

export default function ScrollToTop() {
  const location = useLocation();

  useEffect(() => {
    const previousRestoration = window.history.scrollRestoration;
    window.history.scrollRestoration = "manual";

    return () => {
      window.history.scrollRestoration = previousRestoration;
    };
  }, []);

  useLayoutEffect(() => {
    if (!isProjectSectionLink(location.pathname, location.hash)) {
      window.scrollTo(0, 0);
    }
  }, [location.key, location.pathname, location.hash]);

  return null;
}
