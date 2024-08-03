import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { TableCompo } from "../../Components/TableCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import FormCompo from "../../Components/FormCompo";

export default function UserDisplay(props) {
  const nav = useNavigate();
  const [selectRole, setSelectRole] = useState("default");
  const [title, setTitle] = useState("");

  const [tableData, setTableData] = useState([
    {
      header: ["uid", "fname", "lname", "companyName", "email"],
      content: [],
    },
  ]);

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
    }
  }, [props.sid]);

  const inputHandler = (e) => {
    console.log(e.target.value);
    const selectedValue = e.target.value;
    const selectedText = e.target.options[e.target.selectedIndex].text;

    setSelectRole(selectedValue);
    setTitle(selectedText);

    const projData = new FormData();
    projData.append("sid", props.sid);
    projData.append("role", selectedValue);

    PostService.post("users", projData).then(
      (response) => {
        const newContent = response.data;

        setTableData({
          header: ["uid", "fname", "lname", "companyName", "email"],
          content: [newContent],
        });
        console.log(tableData);
      },
      (err) => {
        handleError(err);
      }
    );
  };

  const RegisterForm = {
    formContent: [
      {
        name: "role",
        type: "select",
        placeHolder: "Select Login Type",
        required: true,
        disable: false,
        options: [
          { id: 0, label: "Select Role", val: "default" },
          { id: 1, label: "Client", val: "c" },
          { id: 2, label: "Staff", val: "s" },
          { id: 3, label: "Admin", val: "a" },
        ],
        inputfunction: inputHandler,
      },
    ],
    formButtons: [],
  };

  return (
    <>
      <div className="">
        <FormCompo inputPattern={RegisterForm} />
        <TableCompo title={`${title} PROJECTS`} inputPattern={tableData} />
      </div>
      <AlertCompo alert={alert} alertFlag={alertFlag} />
    </>
  );
}
