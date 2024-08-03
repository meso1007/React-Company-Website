import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import PostService from "../services/http-services";

export default function Logout({
  sid,
  sidHandler,
  loginUserHandler,
  handleLogout,
}) {
  const nav = useNavigate();
  useEffect(() => {
    if (sessionStorage.getItem("sid")) {
      sid = sessionStorage.getItem("sid");
    }
    if (sid == null) {
      nav("/");
    } else {
      const logoutData = new FormData();
      logoutData.append("sid", sid);
      PostService.post("logout", logoutData).then(
        (axObj) => {
          if (axObj.status === 200) {
            sessionStorage.removeItem("sid");
            sidHandler(null);
            loginUserHandler(null);
            handleLogout();
            nav("/");
          }
        },
        (err) => {
          console.log(err.response.data);
        }
      );
    }
  }, [sid, nav, sidHandler, loginUserHandler, handleLogout]);

  return null;
}
