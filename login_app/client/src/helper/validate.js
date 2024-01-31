import toast from "react-hot-toast"
import { authenticate } from "./helper";

/** validate login page username */

export async function usernameValidate(values) {
    const errors = usernameVerify({}, values);

    if (values.username) {
        // check user exist or not
        try {
            const response = await authenticate(values.username);

            //console.log("full ersponse ",response)

            //const status = response ? response.status : undefined;

           // console.log("this is the status", status);

            if (response !== 200) {
                errors.exist = toast.error('User does not exist...!')
            }
        } catch (error) {
            //console.error("Error during authentication:", error.message);
            errors.exist = toast.error('User does not exist...!')
            // Handle errors as needed
        }
    }

    return errors;
}



/** validate password**/
export async function passwordValidate(values){
    const errors = passwordVerify({}, values);
    return errors;
}

/**validate reset password**/
export async function resetPasswordValidation(values){
    const errors = passwordVerify({}, values);

    if(values.password !== values.confirm_password){
        errors.exists = toast.error("Password don't match...!")
    }
    return errors;
}

/** validate register form **/
export async function registerValidation(values){
    const errors = usernameVerify({},values);
    passwordVerify(errors, values);
    emailVerify(errors,values);

    return errors;
}

/** validate profile page**/
export async function profileValidation(values){
    const errors = emailVerify({}, values);
    return errors;
}

/************************************************************************************************************************ */
/**   **/

/** validate password **/
function passwordVerify(errors = {},values){

    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/; 

    if(!values.password){
        errors.password = toast.error("Password Required...!");
    }else if(values.password.includes(" ")){
        errors.password = toast.error("Wrong Password...!");
    }else if(values.password.length < 4){
        errors.password = toast.error("Password too short");
    }else if(!specialChars.test(values.password)){
        errors.password = toast.error("Password must have a special character");
    }
    return errors;
}

/** validate username */
function usernameVerify(error = {}, values){
    if(!values.username){
        error.username = toast.error('Username Required...!');
    }else if(values.username.includes(" ")){
        error.username = toast.error('Invalid Username...!')
    }

    return error;
}

/** validate email**/
function emailVerify(error = {}, values){
    if(!values.email){
    error.email = toast.error("Email Required...!");
    }else if(values.email.includes(" ")){
        error.email = toast.error("Wrong email...?");
    }else if(!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)){
        error.email = toast.error("Invalid email address...!")
    }
    return error;
}