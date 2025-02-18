import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <h1>404: Page Not Found</h1>
    </>
  );
}
