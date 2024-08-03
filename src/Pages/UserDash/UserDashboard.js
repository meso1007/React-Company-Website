import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";
export default function UserDashboard(props) {
  const nav = useNavigate();
  useEffect(() => {
    if (props.sid == null) {
      nav("/");
    }
  }, []);

  return (
    <>
      <Outlet className="row justify-content-start align-items-start g-2" />
    </>
  );
}
