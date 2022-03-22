// declaring all the modules and stuff that will be required
// if (process.env.NODE_ENV !== 'production') {
//     require ('dotenv').parse()
// }

const express = require ('express')
const app = express ()
const expressLayouts = require ('express-ejs-layouts')

//declaring all routes
const indexRouter = require ('./routes/index')

// setting things up 
app.set ('view engine', 'ejs')
app.set ('views', __dirname + '/views')
app.use(express.static('public'))
app.set ('layout', 'layouts/layout')
app.use (expressLayouts)
app.use(express.static("public"));

// setting routes to addresses
app.use ('/', indexRouter)

app.listen (process.env.PORT || 3000)
console.log("server started (port 3000)")