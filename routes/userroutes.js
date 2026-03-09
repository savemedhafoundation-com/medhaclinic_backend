const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const User = require("../models/User");


const crypto = require("crypto");
function hashPassword(password){
  return crypto
  .createHash("sha256")
  .update(password)
  .digest("hex");
}
// REGISTER API
router.post("/register", async (req, res) => {      
  try {

    const { fullname , email, password,gender,age,fulladdress,phone,weight } = req.body;
const hashedPassword = hashPassword(password);

    // check existing user
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }
    let phonenumber = await User.findOne({ phone });
   if (phonenumber) {
      return res.status(400).json({
        message: "Phone number already exists",
      });
    }
    // hash password

    // create user
    user = new User({
      fullname,
      email,
      password: hashedPassword,
      gender,
      age,
      fulladdress,
      phone,
      weight
    });

    await user.save();

    res.status(201).json({
      message: "User Registered Successfully",
      user,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Server Error",          


    });
  }
});
router.post("/login", async (req,res)=>{

try{

const {email,password} = req.body;

const user = await User.findOne({email});
const hashedPassword = hashPassword(password);

if(!user){
return res.json({message:"User not found"});
}else{
if(user.password !== hashedPassword){
return res.json({message:"Invalid password"});
}

const token = jwt.sign(
{ id:user._id },
"secretkey",
{ expiresIn:"7d" }
);

res.json({
message:"Login successful",
token,
user
});

}

// compare plain password


}catch(error){

res.status(500).json({message:"Server Error"});

}

});
module.exports = router;