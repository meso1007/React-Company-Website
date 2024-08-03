import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import FormCompo from "./Components/FormCompo";
import PostService from "../services/http-services";
import AlertCompo from "./Components/AlertCompo";
import { Staff, Customer, Admin } from "../Classes/Classes";
import { Link } from "react-router-dom";
import "./css/Login.css";

export default function Login(props) {
  const nav = useNavigate();
  const [user, setUser] = useState({ email: "", pass: "", role: "" });
  const [role, setRole] = useState();
  const [sid, setSid] = useState(null);

  const alertDismisFun = (val) => {
    setAlertFlag((prevVal) => {
      return { ...prevVal, alertDis: val };
    });
  };
  const [alertFlag, setAlertFlag] = useState({
    alertDis: "none",
    alertDismis: alertDismisFun,
  });
  const [alert, setAlert] = useState({
    title: "Error",
    content: "",
    color: "danger",
  });
  const handleError = useCallback(
    (err) => {
      if (err.response && err.response.status === 408) {
        sessionStorage.removeItem("sid");
        props.sidHandler(null);
      }
      setAlert({
        title: "Error",
        content: err.response ? err.response.data : "Unknown error",
        color: "danger",
      });
      setAlertFlag((prevVal) => ({
        ...prevVal,
        alertDis: "block",
      }));
    },
    [props]
  );

  let userObj;
  useEffect(() => {
    if (props.sid == null) {
      if (sessionStorage.getItem("sid") != null) {
        props.sidHandler(sessionStorage.getItem("sid"));
        props.setSessionID(sessionStorage.getItem("sid"));
      }
    } else {
      const sidData = new FormData();
      sidData.append("sid", props.sid);
      PostService.post("info", sidData).then(
        (axObj) => {
          let loginUser = axObj.data;
          props.loginUserHandler(loginUser);
          switch (loginUser.role) {
            case "c":
              userObj = new Customer(
                loginUser.uid,
                loginUser.fname,
                loginUser.lname,
                loginUser.email,
                loginUser.role
              );
              break;
            case "s":
              userObj = new Staff(
                loginUser.uid,
                loginUser.fname,
                loginUser.lname,
                loginUser.email,
                "s"
              );
              break;
            default:
              userObj = new Admin(
                loginUser.uid,
                loginUser.fname,
                loginUser.lname,
                loginUser.email,
                "a"
              );
              break;
          }
          props.loginUserHandler(userObj);
        },
        (err) => {
          handleError(err);
        }
      );
    }
  }, [props.sid]);

  const submithandler = (e) => {
    e.preventDefault();
    const loginForm = new FormData(e.target);
    PostService.post("login", loginForm).then(
      (axObj) => {
        console.log(axObj.data);
        let loginUser = axObj.data;
        props.loginUserHandler(loginUser);
        setSid(axObj.data);
        props.sidHandler(axObj.data);
        switch (role) {
          case "u":
            nav("/user");
            break;
          case "s":
            nav("/staff");
            break;
          default:
            nav("/admin");
        }
      },
      (err) => {
        handleError(err);
        setAlertFlag("block");
      }
    );
  };
  const userHanlder = (propertyName, newVal) => {
    setUser((prevUser) => {
      return { ...prevUser, [propertyName]: newVal };
    });
  };
  const inputHandler = (e) => {
    userHanlder(e.target.name, e.target.value);
  };

  const roleHandler = (e) => {
    setRole(e.target.value);
  };

  const LoginForm = {
    formContent: [
      {
        id: 10,
        name: "email",
        type: "email",
        placeHolder: "Email",
        value: user.email,
        required: true,
        disable: false,
        inputfunction: inputHandler,
      },
      {
        id: 20,
        name: "pass",
        type: "password",
        placeHolder: "Password",
        value: user.pass,
        required: true,
        disable: false,
        inputfunction: inputHandler,
      },
      {
        id: 30,
        name: "role",
        type: "select",
        placeHolder: "Select Login Type",
        required: true,
        disable: false,
        defaultVal: user.role,
        options: [
          { id: 31, label: "Client", val: "c" },
          { id: 32, label: "Staff", val: "s" },
          { id: 33, label: "Admin", val: "a" },
        ],
        inputfunction: roleHandler,
      },
    ],
    formButtons: [{ id: 40, type: "submit", label: "Login", color: "primary" }],
  };
  return (
    <div className="login-register-container">
      <div className="form-container">
        <FormCompo inputPattern={LoginForm} submitHandler={submithandler} />
        <div className="text-end">
          <Link to="/reg" className="btn btn-link">
            Don't have an account yet? Sign up here.
          </Link>
        </div>
        <AlertCompo alert={alert} alertFlag={alertFlag} />
      </div>
    </div>
  );
}
