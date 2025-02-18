import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function PageNotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate(-1);
    }, 1500);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <h1>404: Page Not Found</h1>
      <Link to="/">回到首頁</Link>
    </>
  );
}
