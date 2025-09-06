const authService = require("../services/auth.service");

const signup = async (req, res) => {
    try {
        const result = await authService.signUp(req.body);
        res.send(result);
    } catch (error) {
        console.error(error?.message,"Error");
    }
}
const signIn = async (req, res) => {
    try {
        const result = await authService.signin(req.body);
        res.send(result);
    } catch (error) {
        console.error(error?.message, "Error");
    }
}
const LogOut = async (req, res) => {
    try {
        const result = await authService.logout(req.body);
        res.send(result);
    } catch (error) {
        console.error(error?.message, "Error here !!!!");
    }
}

module.exports = {
    signup,
    signIn,
    LogOut
}