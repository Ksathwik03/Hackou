const express = require("express");
const { 
    addProduct, updateProductStatus, getUserProducts, getAllProducts, getChat
 } = require("../controllers/ProductController");
const router = express.Router();

router.post('/add', addProduct)
router.put('/update/:pid',updateProductStatus)
router.post('/user',getUserProducts)
router.get('/',getAllProducts)
router.get('/:cid',getChat)
module.exports = router;
