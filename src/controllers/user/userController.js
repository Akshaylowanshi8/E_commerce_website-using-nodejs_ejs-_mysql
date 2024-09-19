var jwt = require('jsonwebtoken')
const { Product, Category, User, Cart } = require('../../models')
const { Op, where } = require('sequelize')
const { Where } = require('sequelize/lib/utils')
const Razorpay = require('razorpay');
const home = async (req, res) => {
  try {
    const proData = await Product.findAll({
      include: [Category]
    })
    const message = {
      type: 'info',
      text: req.flash('info')
    }
    res.render('userPages/home', {
      products: proData,
      message: message
    })
  } catch (error) {
    console.log(error)
  }
}
const viewOneProduct = async (req, res) => {
  try {
    const productId = req.params.id
    const productData = await Product.findAll({
      where: {
        id: productId
      },

      include: [Category]
    })
    // res.send(productData)
    // const message = {
    //     type: 'error', // 'success', 'error', or 'info'
    //     text: 'This is a success message!'
    // };
    res.render('userPages/viewOne', { products: productData, message: 'ok' })
  } catch (error) {
    console.log(error)
  }
}
const wonenProduct = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 4
    const offset = (page - 1) * limit

    const { count, rows: proData } = await Product.findAndCountAll({
      include: [
        {
          model: Category,
          where: { id: 1 }
        }
      ],
      limit: limit,
      offset: offset
    })
    const totalPages = Math.ceil(count / limit)
    res.render('userPages/womenProduct', {
      products: proData,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      message: 'ok'
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}

const menProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 4
    const offset = (page - 1) * limit
    const { count, rows: proData } = await Product.findAndCountAll({
      include: [
        {
          model: Category,
          where: { id: 2 }
        }
      ],
      limit: limit,
      offset: offset
    })
    const totalPages = Math.ceil(count / limit)
    res.render('userPages/menProduct', {
      products: proData,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      message: 'ok'
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}
const kidsProduct = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1
    const limit = parseInt(req.query.limit, 10) || 4
    const offset = (page - 1) * limit
    const { count, rows: proData } = await Product.findAndCountAll({
      include: [
        {
          model: Category,
          where: { id: 3 }
        }
      ],
      limit: limit,
      offset: offset
    })
    const totalPages = Math.ceil(count / limit)
    res.render('userPages/kidsProduct', {
      products: proData,
      currentPage: page,
      totalPages: totalPages,
      limit: limit,
      message: 'ok'
    })
  } catch (error) {
    console.error(error)
    res.status(500).send('Server Error')
  }
}

const loginUser = async (req, res) => {
  res.render('userPages/loginUser', { message: 'ok' })
}
const loginData = async (req, res) => {
  try {
    const { email, password } = req.body
    const Users = await User.findOne({
      where: { email: email }
    })
    if (!Users) {
      const message = {
        type: 'error',
        text: 'Invalid user name.!'
      }
      res.render('userPages/loginUser', { message: message })
    }
    if (Users.password === password) {    
      let token = jwt.sign(
        { id: Users.id, email: Users.email, name: Users.name },
        process.env.SECRET,
        { expiresIn: '365d' }
      )
      await User.update({ token: token }, { where: { id: Users.id } })
      res.cookie('Usertoken', token, { maxAge: 1000 * 60 * 60 * 24 * 365 })
      req.flash('sucsess', 'welcome user!')
      return res.redirect('/')
    } else {
      const message = {
        type: 'error',
        text: 'Invalid user!'
      }
      res.render('userPages/loginUser', { message: message })
    }
  } catch (err) {
    console.log(err)
  }
}
const logout = async (req, res, next) => {
  try {
    res.clearCookie('Usertoken')
    req.success = 'Successfully Logout'
    res.redirect('/')
  } catch (err) {
    next(err)
  }
}
const addToCart = async (req, res) => {
  try {
    const token = req.cookies.Usertoken
    const decoded = jwt.decode(token)
    if (!decoded) {
      req.flash('error', 'Please login to add items to the cart!')
      return res.redirect('/user/loginUser')
    }

    const productId = parseInt(req.body.productId, 10)
    if (isNaN(productId)) {
      req.flash('error', 'Invalid product ID.')
      return res.redirect('/')
    }
    const isProductAvailable = await Cart.findOne({
      where: {
        userId: decoded.id,
        productId: productId
      }
    })
    if (isProductAvailable) {
      req.flash('info', 'This product is already in your cart.')
    } else {
      await Cart.create({
        userId: decoded.id,
        productId: productId
      })
      req.flash('info', 'Product added to your cart successfully!')
      return res.redirect('/')
    }
    return res.redirect('/')
  } catch (error) {
    console.error('Error adding product to cart:', error)
    req.flash(
      'error',
      'An error occurred while adding the product to the cart.'
    )
    return res.redirect('/')
  }
}
const shopCart = async (req, res) => {
  const token = req.cookies.Usertoken
  const decoded = jwt.decode(token)
  if (!decoded) {
    req.flash('error', 'Please login to add items to the cart!')
    return res.redirect('/user/loginUser')
  }
  try {
    const cart = await Cart.findAll({
      include: {
        model: Product
      },
      where: {
        userId: decoded.id
      }
    })
    //  console.log({products: cart })
    res.render('userPages/shopCart', {
      message: 'ok',
      products: cart
    })
  } catch (error) {
    console.log(error)
  }
}
const removeProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const token = req.cookies.Usertoken
    const decoded = jwt.decode(token)
    if (!decoded) {
      req.flash('error', 'Please login to add items to the cart!')
      return res.redirect('/user/loginUser')
    }
    const userid = decoded.id
    console.log('id=====', productId, 'userid=====', decoded.id);
    await Cart.destroy({
      where: {
        userId: userid,
        productId: productId,
      },
      force: true,
    });
    console.log("after delete ....");

    res.redirect('/user/shop')
  } catch (error) {
    console.log(error);
  }
}
const quantityDec = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('id///////......', id);
    await Cart.decrement('quantity', {
      by: 1,
      where: { id: id }
    });
    res.redirect('/user/shop')
  } catch (error) {
    console.log(error);
  }
}
const quantityInc = async (req, res) => {
  try {
    const id = req.params.id;
    console.log('id///////......', id);
    await Cart.increment('quantity', {
      by: 1,
      where: { id: id }
    });
    res.redirect('/user/shop')
  }
  catch (error) {
    console.log(error);
  }
}
const signUp=async(req,res)=>{
res.render('userPages/signUp',{message:'ok'})
}

const signUpData=async(req,res)=>{
try {
  await User.create(req.body)
  return res.redirect('/user/loginUser')
} catch (error) {
  console.log(error);
}
}






const razorpay = new Razorpay({
  key_id: process.env.KEY_ID,
  key_secret: process.env.KEY_SECRET,
});


const createOrder = async (req, res) => {
  const options = {
    amount: req.body.amount * 100, 
    currency: 'INR',
    receipt: 'receipt#1',
  };

  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

const checkout=async(req,res) =>{

res.render('userPages/razorpay',{ message:'ok'})

}
module.exports = {
  home,
  viewOneProduct,
  wonenProduct,
  menProduct,
  kidsProduct,
  addToCart,
  loginUser,
  loginData,
  logout,
  shopCart,
  removeProduct,
  quantityDec,
  quantityInc,
  signUp,
  signUpData,
  createOrder , 
  checkout
}
