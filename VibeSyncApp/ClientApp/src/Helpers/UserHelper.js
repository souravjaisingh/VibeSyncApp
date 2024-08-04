import RegisterUser, { LoginUser } from "../components/services/UserService"

export default async function registerUserHelper(fName, lName, emailid, pass, phoneNum, gen, isUserOrDj = 'user', isSsologin = false) {
    var userModel = {
        firstName: fName,
        lastName: lName,
        email: emailid,
        phoneNumber: phoneNum,
        gender: gen,
        password: pass,
        isSsologin: isSsologin,
        userOrDj: isUserOrDj
    }
    var res = await RegisterUser(userModel);
    return res;
}

export async function googleLoginHelper(fName, lName, emailid, isUserOrDj = 'user', isSsologin = true) {
    var userModel = {
        firstName: fName,
        lastName: lName,
        email: emailid,
        isSsologin: isSsologin,
        userOrDj: isUserOrDj
    }
    var res = await RegisterUser(userModel);
    return res;
}

export async function loginUserHelper(email, pass) {
    var userModel = {
        email: email,
        password: pass
    }
    var res = await LoginUser(userModel);
    return res;
}

export async function loginWithOTPHelper(phoneNum, isSsologin = true) {
    var userModel = {
        firstName: 'guest',
        email: generateUniqueEmail(),
        phoneNumber: phoneNum,
        isSsologin: isSsologin,
        userOrDj: 'user'
    }
    var res = await RegisterUser(userModel);
    return res;
}

const generateUniqueEmail = () => {
    const uniqueId = Date.now(); // You can use Date.now() or any other method to generate a unique ID
    return `otp_${uniqueId}@otp.com`;
};