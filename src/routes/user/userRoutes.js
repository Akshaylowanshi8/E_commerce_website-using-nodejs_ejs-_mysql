const express = require("express");
const router = express.Router();
const userController = require('../../controllers/user/userController')

router.get('/home',userController.home)
router.get('/viewOne/:id',userController.viewOneProduct)
router.get("/womenProduct",userController.wonenProduct)
// router.get('/womenProduct/:page/:limit',userController.wonenProduct);
router.get('/kidsProduct',userController.kidsProduct)
router.get('/menProduct',userController.menProduct)
router.post('/addtocart',userController.addToCart)
router.post('/loginData',userController.loginData)
router.get('/loginUser',userController.loginUser)
router.get('/logout',userController.logout)
router.get('/shop',userController.shopCart)
router.get('/removeProduct/:id',userController.removeProduct)
router.get('/quantityInc/:id',userController.quantityInc)
router.get('/quantityDec/:id',userController.quantityDec)
router.get('/signUp',userController.signUp)
router.post('/signUpData',userController.signUpData)
router.get('/checkout',userController.checkout)
router.post('/createOrder',userController.createOrder)
module.exports=router