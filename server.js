// declaring all the modules and stuff that will be required
if (process.env.NODE_ENV !== 'production') {
    require ('dotenv').config()
}

// NOTE 
	//--------------------------------------------------------------------------------------------------------
	// the way i've set up the login system is a little weird, but basically i use an object called "passObj"
	// when i need to pass data to a view while rendering it, this works fine it's just that you need to add
	// add an if statement to every get request to pass the user inside the pass obj so the page knows the 
	//user is logged in
	//--------------------------------------------------------------------------------------------------------

const express = require ('express')
const app = express ()
const bodyParser = require ("body-parser");
const passport = require ('passport');
const expressLayouts = require ('express-ejs-layouts')
const mongoose = require ('mongoose')
const methodOverride = require ("method-override")
const flash = require ('express-flash')
const session = require ('express-session')
const bcrypt = require ('bcrypt');

//passport
const initializePassport = require ('./passport-config');
    initializePassport (
        passport, 
        email => User.find ({email:email}),
        id => User.findById(id)
    );

//models
const User = require ('./models/user')

//connecting db
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser:true})
const db=mongoose.connection
db.on('error', error => console.error())
db.once('open', ()=>console.log('connected to mongoose'))

//declaring all routes
const indexRouter = require ('./routes/index')

// setting things up 
app.set ('view engine', 'ejs')
app.set ('views', __dirname + '/views')
app.use(expressLayouts);
app.use (methodOverride('_method'));
app.use(bodyParser.urlencoded({limit:'20mb', extended:true}));
app.use(express.static('public'))
app.set ('layout', 'layouts/layout')
app.use (expressLayouts)
app.use (flash ())
app.use(express.static("public"));
app.use (session ({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized : false
}))
app.use (passport.initialize())
app.use (passport.session())
app.use (session ({
    secret : process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized : false
}))

// setting routes to addresses
app.use ('/', indexRouter)

//user auth
    // user auth setup 

    //login render
    app.get('/login',checkNotAuthenticated, async (req, res) => {
        res.render('user/login')
    })

    //check login
        app.post('/login',checkNotAuthenticated, passport.authenticate('local', {
            successRedirect: '/',
            failureRedirect: '/login',
            failureFlash: true
        }))

    //register render
        app.get('/register',checkNotAuthenticated, async (req, res) => {
            res.render('user/register')
        })

    //save user 
        app.post('/register', checkNotAuthenticated, async (req,res) => {
            checkUser = await User.find({ username : req.body.username})
            checkEmail = await User.find({ email : req.body.email})

            if (checkEmail.length!=0){
                res.render('register', {
                    errorMessage:'Email is already being used for another account.',
                    username:req.body.username,
                    email:req.body.email
                })
            } else if (checkUser.length!=0) {
                res.render('register', {
                    errorMessage:'Username is already taken.',
                    username:req.body.username,
                    email:req.body.email
                })
            }  else if (req.body.password!=req.body.confirmpassword) {
                res.render('register', {
                    errorMessage:'Passwords do not match.',
                    username:req.body.username,
                    email:req.body.email
                })
            } else {
                try {
                    const hashedPassword = await bcrypt.hash (req.body.password, 10);
    console.log(User)
                    const newUser = new User ({
                        username : req.body.username,
                        email : req.body.email,
                        password : hashedPassword,
                        exp : 0
                    })
                    console.log("user log")
                    console.log(newUser)
                    await newUser.save ()
                    res.redirect('/login')
                } catch (err) {
                    console.log( err + ' - in post /register in users route')
                    res.redirect('/register')
                }
            }
        })

        function checkAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
            return next()
            }
        
            res.redirect('/login')
        }          

        function checkNotAuthenticated(req, res, next) {
            if (req.isAuthenticated()) {
            return res.redirect('/')
            }
            next()
        }

    //logout
    app.delete('/logout', (req, res) => {
        req.logOut()
        res.redirect('/')
    })

app.listen (process.env.PORT || 3000)
console.log("server started (port 3000)")