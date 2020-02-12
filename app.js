var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    flash           = require("connect-flash"),
    localStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    seedDB          = require("./seeds"),
    campgroundRoutes= require("./routes/campgrounds"),
    authRoutes      = require("./routes/index"),
    commentRoutes   = require("./routes/comments"),
    methodOverride  = require("method-override");
    
// seedDB();
app.use(flash());
// mongoose.connect("mongodb://localhost/yelp_camp",{ useNewUrlParser: true });

mongoose.connect("mongodb+srv://hardik:hardik13198@cluster0-b5anu.mongodb.net/yelpcamp?retryWrites=true&w=majority",{
    useNewUrlParser: true
});

app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public"));

app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret:"nothing is impossible!!",
    resave:false,
    saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(authRoutes);
app.use("/campgrounds/:id",commentRoutes);
app.use("/campgrounds",campgroundRoutes);


app.listen("4444","127.0.0.1",function(){
    console.log("Yelpcamp server has started!!!");
})