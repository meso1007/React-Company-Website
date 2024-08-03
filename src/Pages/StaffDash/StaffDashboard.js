import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
export default function StaffDashboard(props){
    const nav = useNavigate();
    useEffect(()=>{
        if(props.sid == null){
            nav("/");
        }
    },[]);
    return(
        <h1>Staff Dash</h1>
    )
}