import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";

export default function AdminDashBoard(props) {
  const nav = useNavigate();
  const [userInfo, setUserInfo] = useState({
    name: "User",
    email: "user@example.com",
  });
  useEffect(() => {
    if (props.sid == null) {
      nav("/");
    } else if (props.loginUser == null || props.loginUser.role != "a") {
      nav("/");
    } else {
      setUserInfo({
        name: `${props.loginUser.fname} ${props.loginUser.lname}`,
        email: props.loginUser.email,
      });
    }
  }, [props.sid, props.loginUser, nav]);

  return (
    <div className="container">
      <div className="row justify-content-start align-items-start g-2 mt-3">
        <div className="col-12">
          <div className="d-flex justify-content-end">
            <div className="text-end small">
              <h6>Login User: {userInfo.name}</h6>
              <p>Email: {userInfo.email}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="row justify-content-start align-items-start g-2">
        <Outlet />
      </div>
    </div>
  );
}
