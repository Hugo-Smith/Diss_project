import React from "react";
import StaffHeader from "./StaffHeader";
import StaffBody from "./StaffBody";

function StaffList(props){
    return (
        <div className="staffProfile">
            <StaffHeader 
            firstName={props.staffObject.firstName}
            surname={props.staffObject.surname}
            img={props.staffObject.img}/>
            <StaffBody 
            biography={props.staffObject.biography}/>
        </div>
    );
}

export default StaffList;