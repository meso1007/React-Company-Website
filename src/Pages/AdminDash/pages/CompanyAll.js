import FormCompo from "../../Components/FormCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import { useEffect, useState, useCallback } from "react";

export default function CompanyAll(props) {
  const [companyName, setCompanyName] = useState();
  const [projCode, setProjCode] = useState("");
  const [cid, setCid] = useState("");
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
        name: "project",
        type: "select",
        placeHolder: "Select Project",
        required: true,
        disable: false,
        options: [],
        inputfunction: (e) => {
          console.log(e.target.value);
          setProjCode(e.target.value);
        },
      },
      {
        name: "company",
        type: "select",
        placeHolder: "Select Company",
        required: true,
        disable: false,
        options: [],
        inputfunction: (e) => {
          console.log(e.target.value);
          setCid(e.target.value);
        },
      },
    ],
    formButtons: [{ type: "submit", label: "Assign", color: "success" }],
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
    console.log(sid);
    console.log(projCode);
    console.log(cid);
    regCompForm.append("sid", sid);
    regCompForm.append("projectCode", projCode);
    regCompForm.append("cid", cid);

    PostService.post("projassigncom", regCompForm).then(
      (axObj) => {
        setAlert({
          title: "Success",
          content: "You have been registered",
          color: "success",
        });
        alertDismisFun("block");
      },
      (err) => {
        console.error("Server error:", err.response);
        handleError(err);
      }
    );
  };

  useEffect(() => {
    let sid = props.sid || sessionStorage.getItem("sid");
    const projData = new FormData();
    projData.append("sid", sid);
    PostService.post("projall", projData)
      .then((response) => {
        const updatedUserOptions = response.data.map((proj) => ({
          label: `${proj.projectName}`,
          val: proj.projectCode,
        }));
        setAssignForm((prevForm) => ({
          ...prevForm,
          formContent: [
            {
              ...prevForm.formContent[0],
              options: updatedUserOptions,
            },
            {
              ...prevForm.formContent[1],
            },
          ],
        }));
      })
      .catch((err) => {
        console.error("Project API error:", err.response);
        handleError(err);
      });

    const compData = new FormData();
    compData.append("sid", sid);
    PostService.post("copall", compData)
      .then((response) => {
        const updatedUserOptions = response.data.map((comp) => ({
          label: `${comp.companyName}`,
          val: comp.cid,
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
      .catch((err) => {
        console.error("Company API error:", err.response);
        handleError(err);
      });
  }, [props.sid]);

  return (
    <>
      <div className="col-4">
        <FormCompo inputPattern={assignForm} submitHandler={submitHandler} />
        <AlertCompo alert={alert} alertFlag={alertFlag} />
      </div>
    </>
  );
}
