const usermodel = require('../model/Auth.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

async function registeruser(req, res) {
    const { username, email, password } = req.body;

    try{
        const isuser = await usermodel.findOne({ email });
        if (isuser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newuser = await usermodel.create({
            username,
            email,
            password: hashedPassword
        });
        const token = jwt.sign({ id: newuser._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });

        res.status(201).json({ success: true, message: "User registered successfully" });

    }catch(err){
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }




}
async function loginuser(req, res) {
    const { email, password } = req.body;
    
    try{
        const user = await usermodel.findOne({ email });
        if(!user) {
            return res.status(400).json({ message: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if(!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none' });
    res.status(200).json({ 
        success: true,
        message: "Login successful",
        token: token,
        user:{
            id: user._id,
            username: user.username,
            email: user.email
        }
     });
    }
    catch(err){
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
    }
}
async function logoutuser(req, res) {
    res.clearCookie('token',{httpOnly: true, secure: true, sameSite: 'none'});
    res.status(200).json({ message: "Logout successful" });
}




module.exports = {
    registeruser,
    loginuser,
    logoutuser

}