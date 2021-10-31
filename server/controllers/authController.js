const User = require("../models/user");
const genPassword = require("../utils/passwordUtils").genPassword;
const validator = require('validator');
const { ObjectId } = require('mongodb');
const jwt = require("jsonwebtoken");
const validPassword = require("../utils/passwordUtils").validPassword;
const {sendEmail} = require("./emailController")
const {secureId} = require('../utils/emailUtils')
const {addIp} = require("../utils/DDOS")

const requestIp = require('request-ip');
 
exports.ipMiddleware = function(req, res, next) {
    const clientIp = requestIp.getClientIp(req); 
    if(!addIp(clientIp)){
      return res.status(500).json({
        success: false,
        message : 'Too many requests please try again'
      })
    }
    next();
};

exports.verifyUser = async(req,res,next) => {
  const token = req.headers["x-access-token"];
  if(!token){
    return res.status(403).json({
      success: false,
      error: "Token is required"
    }) 
  }
    try {
      const decoded = jwt.verify(token, "secret_key_for_recycleBuddy")
        const user_check = await User.findOne({_id:decoded._id})
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token })

        if (!user_check) {
          return res.status(404).json({
            success: false,
            error: 'User Not Found'
          });
        }

        if(!user) {
          return res.status(404).json({
            success: false,
            error: 'Please authenticate'
          });
        }

        req.user =user
        req.token = token
    } catch (err) {
      return res.status(404).json({
        success: false,
        error: err
      });
    }
    next();
}

exports.verifyOnlyDealers = async(req,res,next)=>{
  const token = req.headers["x-access-token"];
  if(!token){
    return res.status(403).json({
      success: false,
      error: "Token is required"
    }) 
  }
    try {
      const decoded = jwt.verify(token, "secret_key_for_recycleBuddy")
        const user_check = await User.findOne({_id:decoded._id})
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token,isCustomer:false })

        if (!user_check) {
          return res.status(404).json({
            success: false,
            error: 'User Not Found'
          });
        }

        if(!user) {
          return res.status(404).json({
            success: false,
            error: 'Please authenticate'
          });
        }

        req.user =user
        req.token = token
    } catch (err) {
      return res.status(404).json({
        success: false,
        error: err
      });
    }
    next();
}

exports.verifyOnlyCustomers = async(req,res,next)=>{
  const token = req.headers["x-access-token"];
  if(!token){
    return res.status(403).json({
      success: false,
      error: "Token is required"
    }) 
  }
    try {
      const decoded = jwt.verify(token, "secret_key_for_recycleBuddy")
        const user_check = await User.findOne({_id:decoded._id})
        const user = await User.findOne({ _id: decoded._id, 'tokens.token': token,isCustomer:true })

        if (!user_check) {
          return res.status(404).json({
            success: false,
            error: 'User Not Found'
          });
        }

        if(!user) {
          return res.status(404).json({
            success: false,
            error: 'Please authenticate'
          });
        }

        req.user =user
        req.token = token
    } catch (err) {
      return res.status(404).json({
        success: false,
        error: err
      });
    }
    next();
}



exports.addProfile = async (req, res, next) => {
  console.log(req.body)
  try {
    const {username,email,password} = req.body

    if (!( password && email && username )) {
      return res.status(400).json({
        success: false,
        error: "All input is required"
      });
    }

    const saltHash = genPassword(password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    const secureToken = secureId();

    // // if(email){
    // //   if (!validator.isEmail(req.body.email)) {
    // //     throw new Error("Email is invalid");
    // //   }
    // // }

    const newUser = new User({
      username: username,
      hash: hash,
      salt: salt,
      email: email,
      verificationToken: secureToken,
    });

    const link = `http://localhost:8000/verifyEmail/${username}/${secureToken}`
    
    /* -------Save Profile------- */
    // DO NOT DELETE IT
    // TO BE USED AFTER DEVOLOPMENT
    //sendEmail(link,email,username,'Verify email')
    
    await newUser.save();
    const token = await newUser.generateAuthToken()
    return res.status(201).json({
      success: true,
      data: newUser,
      token:token
      // message: 'Verify the email via link to activate your account'
    });
  } catch (err) {
    return res.json({
      success: false,
      error: `Error Adding User: ${err}`,
    });
  }
};


// -------LOGIN-------
exports.login = async (req, res, next) => {
  console.log(req.body)

    try {
      const { username, password } = req.body;
      
      if (!(password || username)) {
        res.status(400).json({
          success: false,
          error: "Username and password are required"});
      }

      let user;
      user = await User.findOne({username: username})
      

    // DO NOT DELETE IT
    // TO BE USED AFTER DEVOLOPMENT
    // if(req.originalUrl !== '/devoloperLogin/'){
    //   if(!(user.verified)){
    //     return res.json({
    //       success: false,
    //       error: "Verify your email first"
    //     })
    //   }
    // }
  
      if (user && (await validPassword(password,user.hash, user.salt))) {
          const token = await user.generateAuthToken();
          await user.save();
  
        return res.status(200).json({
          success: true,
          data:user,
          token:token });
      }
      return res.status(400).json({
        success: false,
        error: `Invalid credentials`,
      });
    } catch (err) {
        return res.json({
        status: "500",
        success: false,
        error: `Error loging in : ${err.message}`,
      });    
  }
};


// -------LOGOUT USER-------
exports.logoutUser =  async (req,res) => {
  try {
      req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token
      })
      await req.user.save()

      res.send()
  } catch (e) {
      res.status(500).send()
  }
};


// -------UPDATE USER-------
exports.updateUser = async (req, res, next) => {
  try {
    const user = await req.user

    user.set(req.body);
    var update = await user.save();
    return res.status(200).json({
      success: true,
      data: update
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error Getting User ${req.params.id}: ${error.message}`
    });
  }
};


//-------DELETE USER-------
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await req.user

    await user.remove();

    return res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error Deleting User: ${error.message}`,
    });
  }
};


// -------GET USER BY ID-------
exports.getUserById = async (req, res, next) => {
  try {
    const user = await req.user
    
    return res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: `Error Getting User ${req.params.id}: ${error.message}`
    });
  }
};


exports.forgotPassword = async(req,res) => {
  try{
    const {username} = req.body
    const user = await User.findOne({'username': username})
    if(!user){
      return res.status(400).json({
        success: false,
        error: 'Invalid user'
      })
    }
    const hashid = secureId()
    user.resetToken  = hashid
    await user.save();
    const link =`http://localhost:8000/reset/${hashid}`
    sendEmail(link,user.email,username,'Password reset')
    return res.status(200).json({
      sucess: true,
    })
  }
  catch(err){
    return res.status(400).json({
      success: false,
      error: `some error occured ${err}`
    })

  }
  
}

exports.resetPassword = async(req,res) => {
  try{
    const {password} = req.body
    const user = await User.findOne({'resetToken': req.params.hashid})
    if(!user){
      return res.status(400).json({
        success: false,
        error: 'Invalid user'
      })
    }
    if(!password){
      return res.status(400).json({
        success: false,
        error: 'New password required'
      })
    }
    const saltHash = genPassword(req.body.password);
    const salt = saltHash.salt;
    const hash = saltHash.hash;
    user.salt = salt;
    user.hash = hash;
    user.resetToken = '';
    await user.save()
    return res.status(200).json({
      sucess: true,
      message: 'Successfully changed password'
    })
  }
  catch(err){
    return res.status(400).json({
      success: false,
      error: `some error occured ${err}`
    })
  }
  
}
