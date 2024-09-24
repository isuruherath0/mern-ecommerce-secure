import * as yup from 'yup';

const LoginValidations = yup.object().shape({
    email: yup.string().required().email(),
    
});

export default LoginValidations;