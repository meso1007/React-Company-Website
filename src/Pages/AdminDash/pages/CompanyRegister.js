import FormCompo from "../../Components/FormCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import { useEffect, useState, useCallback } from "react";
export default function CompanyRegister(props) {
  const [companyName, setCompanyName] = useState();
  const [uid, setUid] = useState("");
  const alertDismisFun = (val) => {
    setAlertFlag((prevVal) => {
      return { ...prevVal, alertDis: val };
    });
  };
  const companyHandler = (e) => {
    setCompanyName(e.target.value);
  };
  const [assignForm, setAssignForm] = useState({
    formContent: [
      {
        name: "companyName",
        type: "text",
        placeHolder: "Company Name",
        value: companyName,
        required: true,
        inputfunction: companyHandler,
      },
      {
        name: "user",
        type: "select",
        placeHolder: "Select User",
        required: true,
        disable: false,
        options: [],
        inputfunction: (e) => {
          setUid(e.target.value);
        },
      },
    ],
    formButtons: [{ type: "submit", label: "Register", color: "success" }],
  });

  const [alertFlag, setAlertFlag] = useState({
    alertDis: "none",
    alertDismis: alertDismisFun,
  });
  const [alert, setAlert] = useState({
    title: "Error",
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
    let sid = props.sid || sessionStorage.getItem("sid");
    const regCompForm = new FormData(e.target);
    regCompForm.append("sid", sid);
    regCompForm.append("companyname", companyName);
    regCompForm.append("uid", uid);
    PostService.post("compreg", regCompForm).then(
      (axObj) => {
        setAlert({
          title: "Success",
          content: "You have been registered",
          color: "success",
        });
        alertDismisFun("block");
      },
      (err) => {
        handleError(err);
      }
    );
  };

  useEffect(() => {
    let sid = props.sid || sessionStorage.getItem("sid");
    const userData = new FormData();
    userData.append("sid", sid);
    userData.append("role", "c");
    PostService.post("users", userData)
      .then((response) => {
        const updatedUserOptions = response.data.map((user) => ({
          label: `${user.fname} ${user.lname}`,
          val: user.uid,
        }));
        setAssignForm((prevForm) => ({
          ...prevForm,
          formContent: [
            {
              ...prevForm.formContent[0],
            },
            {
              ...prevForm.formContent[1],
              options: updatedUserOptions,
            },
          ],
        }));
      })
      .catch((err) => handleError(err));
  }, [props.sid, uid]);

  return (
    <>
      <div className="col-4">
        <FormCompo inputPattern={assignForm} submitHandler={submitHandler} />
        <AlertCompo alert={alert} alertFlag={alertFlag} />
      </div>
    </>
  );
}
