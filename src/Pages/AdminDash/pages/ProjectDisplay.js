import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { TableCompo } from "../../Components/TableCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import FormCompo from "../../Components/FormCompo";

export default function ProjectDisplay(props) {
  const nav = useNavigate();

  const [tableData, setTableData] = useState([
    {
      header: ["projectCode", "projectName", "projectScheme", "pps", "fgaTime"],
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
      const projData = new FormData();
      projData.append("sid", props.sid);

      PostService.post("projall", projData).then(
        (axObj) => {
          const newContent = axObj.data;
          setTableData((prevData) => [
            {
              ...prevData[0], //for header
              content: [...prevData[0].content, ...newContent],
            },
          ]);
        },
        (err) => {
          handleError(err);
        }
      );
    }
  }, [props.sid]);

  return (
    <>
      <div className="">
        <TableCompo title={`All PROJECTS`} inputPattern={tableData} />
      </div>
      <AlertCompo alert={alert} alertFlag={alertFlag} />
    </>
  );
}
