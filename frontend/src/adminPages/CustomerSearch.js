import { useState, useEffect } from "react";
import checkStaffAuth from "../checkStaffAuth";
import { searchCustomers } from "../API/CustomerSearchAPI";
import CustomerBookingsList from "../components/CustomerBookingsList";
import StaffHomeButton from "../components/StaffHomeButton";

const CustomerSearch = () => {

    const accessToken = localStorage.getItem('accessToken')

    const initialValues = {
        'first_name': '',
        'surname': ''
    }

    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(false)
    const [formValues, setFormValues] = useState(initialValues)
    const [response, setResponse] = useState({'success': false})
    const [feedback, setFeedback] = useState(''); 
    const [status, setStatus] = useState('');
    const [customers, setCustomers] = useState([]); 
    const [selectedCustomer, setSelectedCustomer] = useState(null)
    
    useEffect(() => {
        const checkAuth = async () => {
            const response = await checkStaffAuth();
            setUser(response);
        };

        checkAuth();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault()

        try{
            console.log(formValues);
            setIsLoading(true);
            const response = await searchCustomers(formValues, accessToken);
            setResponse(response);
            console.log(response);
            setIsLoading(false);

            if (response.success) {
                const length = response.customers.length
                setFeedback(`Returned ${length} results`);
                setStatus('success');
                setCustomers(response.customers); 
            } else {
                setFeedback('An error occurred: ' + response.error);
                setStatus('error');
                setCustomers([]); 
            }
        } catch (error) {
            if (error.response && error.response.status === 404) {
                setIsLoading(false);
                setFeedback('No results found.');
                setStatus('error');
            }else {

                setFeedback(error.message);
                setIsLoading(false);
                setCustomers([]);
            }  
        }
    };

    const handleCustomerSelection = (customer) => {
        //deselects booking if clicked again
        const newCustomerSelection = selectedCustomer?.customer_id === customer.customer_id ? null : customer;
        setSelectedCustomer(newCustomerSelection);
        console.log(newCustomerSelection);
    }

    if (!user) {
        return <div>You are not authorised to view this page</div>
    };

    return(
        <div className="container">
            <h1>Customer Search</h1>

            <form onSubmit={handleSubmit}>

                <div className="input-container">
                    <label htmlFor="first_name">First Name: </label>
                    <input
                        id="first_name"
                        type="text"
                        name="first_name"
                        value={formValues.first_name}
                        onChange={handleInputChange}/>

                </div>

                <div className="input-container">
                    <label htmlFor="surname">Surname: </label>
                    <input
                        id='surname'
                        type="text"
                        name="surname"
                        value={formValues.surname}
                        onChange={handleInputChange} />
                </div>

                <button type="submit" disabled={isLoading}>Search</button>
            </form>

            {isLoading && <p>Loading...</p>}
            {status === 'success' && (
                <div>
                    <h2>Search Results</h2>
                    <ul>
                        {customers.map((customer, index) => (
                            <li key={index}>
                                {customer.first_name} - {customer.surname} - {customer.email}
                                <div>
                                <input 
                                    onClick={() => handleCustomerSelection(customer)}
                                    type='checkbox'
                                    checked={selectedCustomer?.customer_id === customer.customer_id}>
                                </input>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div>
                        {selectedCustomer? <CustomerBookingsList customer_id={selectedCustomer.customer_id}/>: null}
                    </div>
                </div>
            )}
            {<p>{feedback}</p>}
            <StaffHomeButton />
        </div>
    )
};

export default CustomerSearch;
