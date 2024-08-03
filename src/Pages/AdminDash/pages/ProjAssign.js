import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { TableCompo } from "../../Components/TableCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import FormCompo from "../../Components/FormCompo";

export default function ProjAssign(props) {
  const UserSelectHandler = (e) => {
    console.log(e.target.value);
    setUid(e.target.value);
  };
  const ProjectSelectHandler = (e) => {
    console.log(e.target.value);
    setProjCode(e.target.value);
  };
  const nav = useNavigate();
  const [uid, setUid] = useState("");
  const [projCode, setProjCode] = useState();

  const [assignForm, setAssignForm] = useState({
    formContent: [
      {
        name: "project",
        type: "select",
        placeHolder: "Select Project",
        required: true,
        disable: false,
        options: [],
        inputfunction: ProjectSelectHandler,
      },
      {
        name: "user",
        type: "select",
        placeHolder: "Select User",
        required: true,
        disable: false,
        options: [],
        inputfunction: UserSelectHandler,
      },
    ],
    formButtons: [{ type: "submit", label: "Assign", color: "success" }],
  });

  let sid;
  if (sessionStorage.getItem("sid") != null) {
    sid = sessionStorage.getItem("sid");
  } else {
    sid = props.sid;
  }

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
  useEffect(() => {
    if (props.sid == null) {
      if (sessionStorage.getItem("sid") != null) {
        props.sidHandler(sessionStorage.getItem("sid"));
      }
    } else {
      const projData = new FormData();
      projData.append("sid", props.sid);

      // Projects
      PostService.post("projall", projData).then(
        (axObj) => {
          const newContent = axObj.data;
          const updatedProjectOptions = newContent.map((project) => ({
            label: project.projectName,
            val: project.projectCode,
          }));

          setAssignForm((prevForm) => ({
            ...prevForm,
            formContent: [
              {
                ...prevForm.formContent[0],
                options: updatedProjectOptions,
              },
              {
                ...prevForm.formContent[1],
                options: prevForm.formContent[1].options, // Preserve user options for now
              },
            ],
          }));
        },
        (err) => {
          handleError(err);
        }
      );

      // Fetch users
      const userData = new FormData();
      userData.append("sid", props.sid);
      userData.append("role", "c");

      PostService.post("users", userData).then(
        (response) => {
          const newContent = response.data;
          const updatedUserOptions = newContent.map((user) => ({
            label: `${user.fname} ${user.lname}`,
            val: user.uid,
          }));

          setAssignForm((prevForm) => ({
            ...prevForm,
            formContent: [
              {
                ...prevForm.formContent[0],
                options: prevForm.formContent[0].options,
              },
              {
                ...prevForm.formContent[1],
                options: updatedUserOptions,
              },
            ],
          }));
        },
        (err) => {
          handleError(err);
        }
      );
    }
  }, [props.sid]);

  const submitHandler = (e) => {
    e.preventDefault();
    // Assign
    const assignData = new FormData();
    assignData.append("sid", props.sid);
    assignData.append("projectCode", projCode);
    assignData.append("uid", uid);
    PostService.post("projassign", assignData).then(
      (axObj) => {
        setAlert({
          title: "Success",
          content: "You are the best",
          color: "success",
        });
        setAlertFlag((prevVal) => ({
          ...prevVal,
          alertDis: "block",
        }));
      },
      (err) => {
        handleError(err);
      }
    );
  };

  return (
    <>
      <div className=""></div>
      <FormCompo inputPattern={assignForm} submitHandler={submitHandler} />
      <AlertCompo alert={alert} alertFlag={alertFlag} />
    </>
  );
}
