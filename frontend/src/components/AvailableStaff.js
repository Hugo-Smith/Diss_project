import React, { useEffect, useState } from 'react';
import { getStaff } from '../API/AvailableStaffAPI';

function AvailableStaff ({ handleStaffInput }){

    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedStaff, setSelectedStaff] = useState(null);

    const fetchData = async () => {
        try {
  
            // Fetch staff data
            const staffData = await getStaff();
            setStaffList(staffData.staff);
  
            setIsLoading(false);
  
        } catch (error) {
            setError(error.message);
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleStaffSelect = (staff) => {
        // Deselects staff if the same button is clicked
        const newSelectedStaff = selectedStaff?.staff_id === staff.staff_id ? null : staff;
        setSelectedStaff(newSelectedStaff);
        //raises staff obj to parent
        handleStaffInput(newSelectedStaff);
    };
    
    return(
        <div className='staff_list'>
                <h2>Staff</h2>
                <ul>
                    {staffList.map(staff => (
                        <li
                            key={staff.staff_id}
                            onClick={() => handleStaffSelect(staff)}
                            style={{
                                backgroundColor: selectedStaff && selectedStaff.staff_id === staff.staff_id ? 'lightblue' : 'white',
                                cursor: 'pointer',
                                padding: '10px',
                                margin: '5px 0',
                                border: '1px solid #ccc',
                                listStyleType: 'none'
                            }}
                        >
                            <div>
                                {staff.first_name} {staff.surname}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
    )
}

export default AvailableStaff;