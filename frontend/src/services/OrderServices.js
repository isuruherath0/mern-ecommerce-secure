import axios from 'axios';

export const getAllOrders = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders`);
    return data;
};

export const getOrderById = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders/${id}`);
    return data;
};

export const getOrdersByStatus = async (status) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders/status/${status}`);
    return data;
};

export const getOrdersByUserId = async (id) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/orders/user/${id}`);
    return data;
};

// Function to create a new order with CSRF protection
export const addOrder = async (products, buyer, address, csrfToken) => {
    const { data } = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/orders`, {
        products,
        buyer,
        address
    }, {
        headers: {
            'CSRF-Token': csrfToken // Send the CSRF token in the request headers
        }
    });
    return data;
};

export const updateOrderStatus = async (id, status, prepare, onWay, delivered, cancel) => {
    const { data } = await axios.put(`${process.env.REACT_APP_API_BASE_URL}/orders/${id}`, {
        status,
        prepare,
        onWay,
        delivered,
        cancel
    });
    return data;
};

export const deleteOrder = async (id) => {
    const { data } = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/orders/${id}`);
    return data;
};