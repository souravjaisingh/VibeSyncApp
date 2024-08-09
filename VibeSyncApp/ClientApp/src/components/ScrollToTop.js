import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.scrollTop = 0; // For modern browsers
    document.body.scrollTop = 0; // For older browsers
    }, [pathname]);

  return null;
}