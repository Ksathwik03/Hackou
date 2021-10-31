const User = require("../models/user");
const express = require("express");

const router = express.Router();




const payment = async(req,res) => {
    try{
        const token = req.headers["x-access-token"];
        const {product_name,product_link,bank} = req.body
        const user = await User.findOne({'token': token})
        if(!user){
            return res.json({
                stats: 400,
                sucess: false,
                message: "Auth token required"
            })
        }
        const chat_id = crypto.randomBytes(12).toString('hex');
        const product = new Product({
            userId: user._id,
            product_name : product_name,
            product_link: product_link,
            bank: bank,
            chat_id: chat_id,
            admin_details: {
                "admin_id": "i394neuIHS0",
                "admin_name": "admin"
            },
        })
        await product.save()
        return res.json({
            stats: 200,
            sucess: "Successfully created",
            product: product
        }) 
    }
    catch(err){
        return (res.json({
            success: false,
            message: "Some error occured"
        }))
    }
}

const pay = async(req,res) => {
    return res.json({
        Success: true,
        message: "Payment Successfull"
    })
}

router.get('/', pay)

module.exports = router;
