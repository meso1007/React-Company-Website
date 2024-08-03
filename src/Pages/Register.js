import FormCompo from "./Components/FormCompo";
import PostService from "../services/http-services";
import AlertCompo from "./Components/AlertCompo";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./css/Login.css"; // Ensure the CSS file is imported

export default function Register(props) {
  const [pass, setPass] = useState({ pass: "", passrepeat: "" });
  const [companyDisabled, setCompanyDisabled] = useState(false);
  const [companyName, setCompanyName] = useState();

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
    content: "Password doesn't match.",
    color: "danger",
  });

  const submitHandler = (e) => {
    e.preventDefault();
    if (pass.pass == pass.passrepeat) {
      const regForm = new FormData(e.target);
      if (companyDisabled) {
        regForm.append("companyName", companyName);
      }
      PostService.post("reg", regForm).then(
        (axObj) => {
          setAlert({
            title: "Success",
            content: "You have been registered",
            color: "success",
          });
          alertDismisFun("block");
        },
        (err) => {
          setAlert({
            title: "Error",
            content: err.response.data,
            color: "danger",
          });
          alertDismisFun("block");
        }
      );
    } else {
      alertDismisFun("block");
    }
  };

  const inputHandler = (e) => {
    setPass((prevPass) => {
      return { ...prevPass, [e.target.name]: e.target.value };
    });
  };

  const companyHandler = (e) => {
    setCompanyName(e.target.value);
  };

  const roleChangeHandler = (e) => {
    const selectedRole = e.target.value;
    if (selectedRole == "s" || selectedRole == "a") {
      setCompanyDisabled(true);
      setCompanyName("Staff");
    } else {
      setCompanyDisabled(false);
      setCompanyName("");
    }
  };

  const RegisterForm = {
    formContent: [
      {
        name: "fname",
        type: "text",
        placeHolder: "First Name",
        required: true,
        disable: false,
      },
      {
        name: "lname",
        type: "text",
        placeHolder: "Last Name",
        required: true,
        disable: false,
      },
      {
        name: "email",
        type: "email",
        placeHolder: "Email",
        required: true,
        disable: false,
      },
      {
        name: "pass",
        type: "password",
        placeHolder: "Password",
        value: pass.pass,
        required: true,
        disable: false,
        inputfunction: inputHandler,
      },
      {
        name: "passrepeat",
        type: "password",
        placeHolder: "Repeat Password",
        value: pass.passrepeat,
        required: true,
        disable: false,
        inputfunction: inputHandler,
      },
      {
        name: "companyName",
        type: "text",
        placeHolder: "Company Name",
        value: companyName,
        required: true,
        disable: companyDisabled,
        inputfunction: companyHandler,
      },
      {
        name: "phone",
        type: "phone",
        placeHolder: "Phone Number",
        required: true,
        disable: false,
      },
      {
        name: "role",
        type: "select",
        placeHolder: "Select User Type",
        required: true,
        disable: false,
        options: [
          { label: "Client", val: "c" },
          { label: "Staff", val: "s" },
          { label: "Admin", val: "a" },
        ],
        inputfunction: roleChangeHandler,
      },
    ],
    formButtons: [{ type: "submit", label: "Register", color: "success" }],
  };

  return (
    <div className="login-register-container mt-5">
      <div className="form-container">
        <FormCompo inputPattern={RegisterForm} submitHandler={submitHandler} />
        <div className="text-end">
          <Link to="/" className="btn btn-link">
            Already have an account? Sign in here.
          </Link>
        </div>
        <AlertCompo alert={alert} alertFlag={alertFlag} />
      </div>
    </div>
  );
}
