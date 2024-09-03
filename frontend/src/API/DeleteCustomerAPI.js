import axios from "axios";

export const deleteCustomer = async (customer_id, accessToken) => {
    
    try {
        console.log(customer_id)

        const response = await axios.get(`http://localhost:5000/api/v1/customer/${customer_id}`);
        const customer = response.data;

        if (!customer) {
        throw new Error("Customer not found");
        }

        await axios.delete(`http://localhost:5000/api/v1/delete-customer/${customer_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return customer;

    } catch (err) {
        if (err.response) {
            const { status, data } = err.response;
            throw new Error(`${status}: ${data.error}`);
    } else if (err.request) {
    throw new Error('Error: No response received from server');
    } else {
    throw new Error(err.message);
    }
    }
};