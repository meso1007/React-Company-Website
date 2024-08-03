import FormCompo from "../../Components/FormCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import { useState, useCallback } from "react";

export default function ProjectRegister(props) {
  let sid;
  if (sessionStorage.getItem("sid") != undefined) {
    sid = sessionStorage.getItem("sid");
  } else {
    console.log("no sid");
  }

  const alertDismisFun = (val) => {
    setAlertFlag((prevVal) => ({
      ...prevVal,
      alertDis: val,
    }));
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

  const handleError = useCallback(
    //useCallBack
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

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(sid);
    const projRegForm = new FormData(e.target);
    projRegForm.append("sid", sid);
    PostService.post("projreg", projRegForm).then(
      (axObj) => {
        setAlert({
          title: "Success",
          content: "Your project has been registered",
          color: "success",
        });
        alertDismisFun("block");
      },
      (err) => {
        handleError(err);
      }
    );
  };

  const RegisterForm = {
    formContent: [
      {
        name: "projectCode",
        type: "text",
        placeHolder: "Project Code",
        required: true,
        disable: false,
      },
      {
        name: "projectName",
        type: "text",
        placeHolder: "Project Name",
        required: true,
        disable: false,
      },
      {
        name: "projectScheme",
        type: "text",
        placeHolder: "Project Scheme",
        required: true,
        disable: false,
      },
      {
        name: "pps",
        type: "select",
        placeHolder: "Select pps",
        required: true,
        disable: false,
        options: [
          { label: "NDcPP", val: "ndc" },
          { label: "OSPP", val: "os" },
          { label: "APP_PP", val: "app" },
          { label: "MAIL_PP", val: "mail" },
          { label: "MDM_PP", val: "mdm" },
          { label: "BIO_PP", val: "bio" },
          { label: "BT_PP", val: "bt" },
        ],
      },
      {
        name: "fgaTime",
        type: "number",
        placeHolder: "FGA TIME",
        required: true,
        disable: false,
      },
    ],
    formButtons: [{ type: "submit", label: "Register", color: "success" }],
  };

  return (
    <div className="col-4">
      <FormCompo inputPattern={RegisterForm} submitHandler={submitHandler} />
      <AlertCompo alert={alert} alertFlag={alertFlag} />
    </div>
  );
}
