import RegisterUser, { LoginUser } from "../components/services/UserService"

export default async function registerUserHelper(fName,lName,emailid,pass,phoneNum,gen,isUserOrDj='user') {
    var userModel = {
        firstName:fName,
        lastName:lName,
        email:emailid,
        phoneNumber:phoneNum,
        gender:gen,
        password:pass,
        isSsologin:true,
        userOrDj:isUserOrDj
    }
    var res = await RegisterUser(userModel);
    return res;
}
