import React from "react";


const images = require.context('./PracticeJS/StaffImages', false, /\.(png|jpe?g|svg)$/);

function StaffHeader(props) {
    console.log(props.img);
    const imgSrc = images(`./${props.img}`);
    console.log(imgSrc);

    return (
        <div>
            <h3>{props.firstName + ' ' + props.surname}</h3>
            <img src={imgSrc} 
            alt={props.firstName}
            className="staffImage" />
        </div>
    );
}

export default StaffHeader;