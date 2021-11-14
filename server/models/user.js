const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique:true
  },
  email: {
    type: String,
    unique: true,
  },
  hash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },

  isVerified:{
    type:Boolean
  },
  
  token: {type: String},
  admin: {
    default: false,
    type: Boolean
  },
  products: [
    { type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true}
  ],
  verified: {type: Boolean,default:false},
  verificationToken: {type: String,default: ''},
  resetToken: {type: String, default: ''},
},{ timestamps: true });

UserSchema.methods.generateAuthToken = async function () {
  const user = this
  const token = jwt.sign({_id: user._id.toString(), isCustomer: user._isCustomer }, "secret_key_for_recycleBuddy")

  user.tokens = user.tokens.concat({token})
  await user.save()

  return token
}

const User = mongoose.model('User', UserSchema);



module.exports = User;