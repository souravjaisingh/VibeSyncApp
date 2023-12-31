import RegisterUser, { LoginUser } from "../components/services/UserService"

export default async function registerUserHelper(fName,lName,emailid,pass,phoneNum,gen, isUserOrDj='user', isSsologin = false) {
    var userModel = {
        firstName:fName,
        lastName:lName,
        email:emailid,
        phoneNumber:phoneNum,
        gender:gen,
        password:pass,
        isSsologin:isSsologin,
        userOrDj:isUserOrDj
    }
    var res = await RegisterUser(userModel);
    return res;
}

export async function googleLoginHelper(fName,lName,emailid, isUserOrDj='user', isSsologin = true) {
    var userModel = {
        firstName:fName,
        lastName:lName,
        email:emailid,
        isSsologin:isSsologin,
        userOrDj:isUserOrDj
    }
    var res = await RegisterUser(userModel);
    return res;
}

export async function loginUserHelper(email, pass){
    var userModel = {
        email:email,
        password:pass
    }
    var res = await LoginUser(userModel);
    return res;
}