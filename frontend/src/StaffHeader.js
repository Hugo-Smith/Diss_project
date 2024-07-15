import React from "react";

function StaffHeader(props){
    return <h2>{props.firstName + ' ' + props.surname}</h2>;
};

export default StaffHeader;