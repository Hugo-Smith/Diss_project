import React from "react";

function StaffBody(props){
    return (
    <div className="staffDescription">
        <p>{props.biography}</p>
    </div>
    );
};

export default StaffBody;