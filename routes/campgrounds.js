var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

router.get("/",function(req,res){
    Campground.find({},function(err,allCampgrounds){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/index",{campgrounds:allCampgrounds});
        }
    });
});

// form to create the new campground
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

// create the campground route
router.post("/",middleware.isLoggedIn,function(req,res){
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id : req.user._id,
        username:req.user.username
    };
    var newCampground = {name:name,image:image,description:desc,author:author,price:price};
    Campground.create(newCampground,function(err,campground){
        if(err){
            console.log(err);
            req.flash("error",err.message);
        }
        else{
            req.flash("success","Campground Successfully Added!");
            res.redirect("/campgrounds");
        }
    });
});

// show campground route
router.get("/:id",function(req,res){
    Campground.findById(req.params.id).populate("comments").exec(function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("campgrounds/show",{campground:campground});
        }
    });
});

// edit campground form
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    
    Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            res.render("campgrounds/edit",{campground:foundCampground});
        }
    });
    
});


// Update campground logic
router.put("/:id",middleware.checkCampgroundOwnership,function(req, res) {
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
        if(err){
            res.redirect("/campgrounds");
        }
        else{
            req.flash("success","Updated Successfully");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// destroy campground logic

router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    
    Campground.findById(req.params.id,function(err, foundCampground) {
        if(err){
            req.flash("error","Something went wrong!");
            res.redirect("/campgrounds");
        }
        else{
            foundCampground.comments.forEach(function(comment){
                Comment.findByIdAndRemove(comment._id,function(err){
                    if(err){
                        res.redirect("/campgrounds");
                    }
                });
            });
            Campground.remove(foundCampground,function(err){
                if(err){
                    req.flash("error","Something went wrong!");
                    res.redirect("/campgrounds");
                } else{
                    req.flash("success","Successfully deleted Campground!");
                    res.redirect("/campgrounds");
                }
            });
        }
    });
    
});


module.exports = router;

