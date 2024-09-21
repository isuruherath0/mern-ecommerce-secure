import axios from 'axios';

export const Login = (email, password) => {
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/login`, { email, password });
};

export const Register = (firstName, lastName, email, password, phone, address) => {
    return axios.post(`${process.env.REACT_APP_API_BASE_URL}/users/register`, { firstName, lastName, email, password, phone, address });
};