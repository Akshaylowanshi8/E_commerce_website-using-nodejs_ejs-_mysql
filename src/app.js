const express = require('express')
const app = express()
// const morgan = require('morgan')
const cors = require('cors')
const flash = require('connect-flash')
const cookieParser = require('cookie-parser')
const adminRoute=require('./routes/admin/adminRoutes')
const userRoute=require('./routes/user/userRoutes')


require('dotenv').config()
// const i18n = require("./middleware/i18n.config");
const session = require("./middlewear/session");
const catchGlobalError = require("./middlewear/catch.global.error")
const parser = require("./middlewear/parser")
// const adminRoute = require("./routes/admin/index.route");
// const apiRoute = require("./routes/api/index.route");

app.use(cors())
app.use(cookieParser())
app.use(session);

app.use(flash())
// app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public/"));
app.get('/', (req, res) => {
    // req.flash('info', 'Flash is back!')
res.redirect('/user/home')
})
app.use('/admin',adminRoute)    
app.use('/user',userRoute)

app.use(catchGlobalError)
module.exports = app