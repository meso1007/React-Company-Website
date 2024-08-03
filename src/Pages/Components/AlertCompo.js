export default function AlertCompo(props){
    return(
        <div className={`alert mt-3 alert-${props.alert.color} alert-dismissible fade show`} role="alert" style={{display:props.alertFlag.alertDis}}>
            <button
                type="button"
                className="btn-close"
                aria-label="Close"
                onClick={()=>props.alertFlag.alertDismis("none")}
            ></button>
        
            <strong>{props.alert.title}</strong> {props.alert.content}
        </div>
        
    )
}