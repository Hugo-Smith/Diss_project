import axios from "axios";

export const deleteTreatment = async (treatment_id, accessToken) => {
    
    try {

        const response = await axios.get(`http://localhost:5000/api/v1/treatment/${treatment_id}`);
        const treatment = response.data;

        if (!treatment) {
        throw new Error("Treatment not found");
        }

        await axios.delete(`http://localhost:5000/api/v1/delete-treatment/${treatment_id}`, {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });
        return treatment;

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