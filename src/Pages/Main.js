import { Outlet } from "react-router-dom";
export default function Main(props) {
  return (
    <>
      <Outlet className="row justify-content-start align-items-start g-2" />
    </>
  );
}
