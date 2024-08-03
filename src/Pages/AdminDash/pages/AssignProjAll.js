import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { TableCompo } from "../../Components/TableCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import FormCompo from "../../Components/FormCompo";

export default function AssignProjAll(props) {
  const [selectedName, setName] = useState("User");
  const [uid, setUid] = useState("");
  const nav = useNavigate();
  const [modalContent, setModalContent] = useState(null);
  const [projData, setProjData] = useState([]);
  const [selectProjData, setSelectProjData] = useState([]);
  const [assignForm, setAssignForm] = useState({
    formContent: [
      {
        name: "user",
        type: "select",
        placeHolder: "Select User",
        required: true,
        disable: false,
        options: [],
        inputfunction: (e) => {
          setName(e.target.options[e.target.selectedIndex].text);
          setUid(e.target.value);
        },
      },
    ],
    formButtons: [],
  });
  const [alertFlag, setAlertFlag] = useState({
    alertDis: "none",
    alertDismis: (val) => {
      setAlertFlag((prevVal) => ({
        ...prevVal,
        alertDis: val,
      }));
    },
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
    const fetchData = async () => {
      try {
        if (props.sid == null) {
          if (sessionStorage.getItem("sid") != null) {
            props.sidHandler(sessionStorage.getItem("sid"));
          }
        } else {
          const sid = props.sid || sessionStorage.getItem("sid");

          // Fetch users
          const userData = new FormData();
          userData.append("sid", sid);
          userData.append("role", "s");
          const userResponse = await PostService.post("users", userData);
          const updatedUserOptions = userResponse.data.map((user) => ({
            label: `${user.fname} ${user.lname}`,
            val: user.uid,
          }));
          setAssignForm((prevForm) => ({
            ...prevForm,
            formContent: [
              {
                ...prevForm.formContent[0],
                options: updatedUserOptions,
              },
            ],
          }));

          // Fetch projects
          const projData = new FormData();
          projData.append("sid", sid);
          const projResponse = await PostService.post(
            "projassignall",
            projData
          );
          const updatedContent = projResponse.data.map((item) => ({
            ...item,
            Name: `${item.fname} ${item.lname}`,
          }));

          setProjData([
            {
              header: ["projectName"],
              content: updatedContent,
            },
          ]);

          // Fetch selected projects
          if (uid) {
            const selectData = new FormData();
            selectData.append("sid", sid);
            selectData.append("uid", uid);
            const selectResponse = await PostService.post(
              "projassignall",
              selectData
            );
            const updatedSelectContent = selectResponse.data.map((item) => ({
              ...item,
              Name: `${item.fname} ${item.lname}`,
            }));
            setSelectProjData([
              {
                header: ["projectName"],
                content: updatedSelectContent,
              },
            ]);
          }
        }
      } catch (err) {
        handleError(err);
      }
    };

    fetchData();
  }, [props.sid, uid]);

  return (
    <>
      <div className="">
        <FormCompo inputPattern={assignForm} />
        <TableCompo
          title={`${selectedName} Projects`}
          inputPattern={selectProjData}
          link={true}
          setModalContent={setModalContent}
          isChangeable={false}
        />
        <TableCompo
          title={`All Projects`}
          inputPattern={projData}
          link={true}
          setModalContent={setModalContent}
          isChangeable={false}
        />
      </div>
      <AlertCompo alert={alert} alertFlag={alertFlag} />
    </>
  );
}
