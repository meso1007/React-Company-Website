import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Main from "./Pages/Main";
import Login from "./Pages/Login";
import StaffDashboard from "./Pages/StaffDash/StaffDashboard";
import UserDashboard from "./Pages/UserDash/UserDashboard";
import AdminDashBoard from "./Pages/AdminDash/AdminDashBoard";
import Register from "./Pages/Register";
import Logout from "./Pages/Logout";
import NoPage from "./Pages/NoPage";
import InfoPage from "./Pages/UserDash/pages/InfoPage";
import ProjectPage from "./Pages/UserDash/pages/ProjectPage";
import ProjectRegister from "./Pages/AdminDash/pages/ProjectRegister";
import LoadingScreen from "./Pages/Components/LoadingCompo";
import ProjectDisplay from "./Pages/AdminDash/pages/ProjectDisplay";
import UserDisplay from "./Pages/AdminDash/pages/UserDisplay";
import ProjAssign from "./Pages/AdminDash/pages/ProjAssign";
import AssignProjAll from "./Pages/AdminDash/pages/AssignProjAll";
import CompanyRegister from "./Pages/AdminDash/pages/CompanyRegister";
import CompanyAll from "./Pages/AdminDash/pages/CompanyAll";
import NavbarCompo from "./Pages/Components/NavbarCompo";
import UserEdit from "./Pages/AdminDash/pages/UserEdit";
import "./App.css";

export default function App() {
  const [SessionID, setSessionID] = useState("");
  const [sid, setSid] = useState(null);
  const [loginUser, setLoginUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const defaultNavbar = [
    { id: 100, link: "/", label: "Login", disFlag: true },
    { id: 104, link: "/reg", label: "Register", disFlag: true },
  ];
  const loginUserHandler = (user) => {
    console.log(user);
    setLoginUser(user);
  };

  const adminNavbar = [
    { id: 200, link: "/admin", label: "Admin Dashboard", disFlag: true },
    {
      id: 201,
      link: "/admin/regproj",
      label: "Register Project",
      disFlag: true,
    },
    { id: 202, link: "/admin/useredit", label: "User Edit", disFlag: true },
    { id: 203, link: "/admin/compall", label: "Company All", disFlag: true },
    { id: 204, link: "/admin/projectAll", label: "Project All", disFlag: true },

    {
      id: 206,
      link: "/admin/projassign",
      label: "Project Assignment",
      disFlag: true,
    },
    {
      id: 207,
      link: "/admin/assignprojall",
      label: "Assigned Project All",
      disFlag: true,
    },
    {
      id: 208,
      link: "/admin/compreg",
      label: "Company Register",
      disFlag: true,
    },

    { id: 209, link: "/logout", label: "Logout", disFlag: true },
  ];

  const userNavbar = [
    { id: 300, link: "/user", label: "User Dashboard", disFlag: true },
    { id: 302, link: "/logout", label: "Logout", disFlag: true },
  ];

  const staffNavbar = [
    { id: 400, link: "/staff", label: "Staff Dashboard", disFlag: true },
    { id: 402, link: "/logout", label: "Logout", disFlag: true },
  ];

  const [navbarItems, setNavbarItems] = useState(defaultNavbar);

  useEffect(() => {
    if (sessionStorage.getItem("sid")) {
      sidHandler(sessionStorage.getItem("sid"));
    }

    if (loginUser) {
      switch (loginUser.role) {
        case "a":
          setNavbarItems(adminNavbar);
          break;
        case "u":
          setNavbarItems(userNavbar);
          break;
        case "s":
          setNavbarItems(staffNavbar);
          break;
        default:
          setNavbarItems(defaultNavbar);
      }
    } else {
      setNavbarItems(defaultNavbar);
    }
  }, [loginUser, sid, SessionID]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const sidHandler = (sid) => {
    setSid(sid);
    if (sid) {
      sessionStorage.setItem("sid", sid);
    }
  };

  const handleLogout = () => {
    setSid(null);
    setLoginUser(null);
    setNavbarItems(defaultNavbar);
  };

  return (
    <div>
      {loading ? (
        <LoadingScreen />
      ) : (
        <BrowserRouter>
          <NavbarCompo NavbarItems={navbarItems} />
          <Routes>
            <Route path="/" element={<Main />}>
              <Route
                index
                element={
                  <Login
                    sid={sid}
                    sidHandler={sidHandler}
                    loginUserHandler={loginUserHandler}
                  />
                }
              />
              <Route path="reg" element={<Register />} />
              <Route
                path="logout"
                element={
                  <Logout
                    sid={sid}
                    sidHandler={sidHandler}
                    loginUserHandler={loginUserHandler}
                    handleLogout={handleLogout}
                  />
                }
              />
              <Route path="*" element={<NoPage />} />
            </Route>

            <Route
              path="/admin/"
              element={<AdminDashBoard sid={sid} loginUser={loginUser} />}
            >
              <Route index element={<InfoPage />} />
              <Route
                path="regproj"
                element={<ProjectRegister sid={sid} sidHandler={sidHandler} />}
              />
              <Route
                path="useredit"
                element={<UserEdit sid={sid} sidHandler={sidHandler} />}
              />
              <Route
                path="compall"
                element={<CompanyAll sid={sid} sidHandler={sidHandler} />}
              />
              <Route
                path="projectAll"
                element={<ProjectDisplay sid={sid} sidHandler={sidHandler} />}
              />

              <Route
                path="projassign"
                element={<ProjAssign sid={sid} sidHandler={sidHandler} />}
              />
              <Route
                path="assignprojall"
                element={<AssignProjAll sid={sid} sidHandler={sidHandler} />}
              />
              <Route
                path="compreg"
                element={<CompanyRegister sid={sid} sidHandler={sidHandler} />}
              />
              <Route path="*" element={<NoPage />} />
            </Route>

            <Route
              path="/staff/*"
              element={<StaffDashboard sid={sid} loginUser={loginUser} />}
            >
              <Route index element={<InfoPage />} />
              <Route path="proj" element={<ProjectPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>

            <Route
              path="/user/*"
              element={<UserDashboard sid={sid} loginUser={loginUser} />}
            >
              <Route index element={<InfoPage />} />
              <Route path="proj" element={<ProjectPage />} />
              <Route path="*" element={<NoPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </div>
  );
}
