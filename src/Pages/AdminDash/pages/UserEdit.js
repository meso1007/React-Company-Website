import { useNavigate } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import { TableCompo } from "../../Components/TableCompo";
import PostService from "../../../services/http-services";
import AlertCompo from "../../Components/AlertCompo";
import FormCompo from "../../Components/FormCompo";

export default function UserEdit(props) {
  const [selectedName, setName] = useState("User");
  const [uid, setUid] = useState("");
  const [selectProjData, setSelectProjData] = useState([]);
  const [cid, setCid] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const alertDismisFun = (val) => {
    setAlertFlag((prevVal) => {
      return { ...prevVal, alertDis: val };
    });
  };
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
    formButtons: [{ type: "submit", label: "Change", color: "success" }],
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
            formContent: prevForm.formContent.map((item) =>
              item.name === "user"
                ? { ...item, options: updatedUserOptions }
                : item
            ),
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

          // Fetch companies
          const compData = new FormData();
          compData.append("sid", sid);
          PostService.post("copall", compData)
            .then((response) => {
              const updatedCompanyOptions = response.data.map((comp) => ({
                label: `${comp.companyName}`,
                val: comp.cid,
              }));
              setAssignForm((prevForm) => ({
                ...prevForm,
                formContent: prevForm.formContent.map((item) =>
                  item.name === "company"
                    ? { ...item, options: updatedCompanyOptions }
                    : item
                ),
              }));
            })
            .catch((err) => {
              console.error("Company API error:", err.response);
              handleError(err);
            });
        }
      } catch (err) {
        handleError(err);
      }

      // Fetch selected projects
      if (uid) {
        const selectData = new FormData();
        selectData.append("sid", props.sid);
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
    };

    fetchData();
  }, [props.sid, uid]);

  const submitHandler = (e) => {
    e.preventDefault();
    console.log(modalContent);
    let sid = props.sid || sessionStorage.getItem("sid");
    const userEditData = new FormData(e.target);
    userEditData.append("sid", sid);
    userEditData.append("uid", uid);
    userEditData.append("cid", cid);
    userEditData.append("fname", modalContent.fname);
    userEditData.append("lname", modalContent.lname);
    userEditData.append("email", modalContent.email);
    userEditData.append("role", modalContent.role);
    userEditData.append("phone", modalContent.phone);

    PostService.post("useredit", userEditData).then(
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
        alertDismisFun("block");
      }
    );
  };

  return (
    <>
      <div className="">
        <FormCompo inputPattern={assignForm} submitHandler={submitHandler} />
        <TableCompo
          title={`${selectedName} Projects`}
          inputPattern={selectProjData}
          link={true}
          setModalContent={setModalContent}
        />
      </div>
      <AlertCompo alert={alert} alertFlag={alertFlag} />
    </>
  );
}
