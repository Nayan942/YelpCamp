
var express = require("express");
var router = express.Router({mergeParams:true});
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware");

// COMMENTS ROUTE


// form to create comment
router.get("/comment/new",middleware.isLoggedIn,function(req, res) {
    
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new",{campground:campground});
        }
    });
    
});

router.post("/comments",middleware.isLoggedIn,function(req,res){
    Campground.findById(req.params.id,function(err,campground){
        if(err){
            console.log(err);
        }
        else{
            
            var comment = {
                text:req.body.comment.text,
                author:{
                    id:req.user._id,
                    username:req.user.username
                }
            };            
            Comment.create(comment,function(err,newComment){
                if(err){
                    console.log(err);
                }
                else{
                    campground.comments.push(newComment);
                    campground.save();
                    req.flash("success","Successfully Added comment!");
                    res.redirect("/campgrounds/"+req.params.id);
                }
            });
        }
    });
});

// rendering the comment page to edit the comment
router.get("/comments/:comment_id/edit",middleware.checkCommentOwnership,function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            res.redirect("/campgrounds");
        }
        else{
                Comment.findById(req.params.comment_id,function(err, comment) {
                    if(err){
                        res.redirect("/campgrounds");
                    } else{
                        res.render("comments/edit",{campground:campground,comment:comment});
                    }
                });
        }
    });

});


router.put("/comments/:comment_id",middleware.checkCommentOwnership,function(req,res){
   Comment.findByIdAndUpdate(req.params.comment_id,req.body.comment,function(err,updatedComment){
       if(err){
           res.redirect("back");
       }
       else{
           req.flash("success","Successfully Updated comment!");
           res.redirect("/campgrounds/" + req.params.id);
       }
   }) ;
});


router.delete("/comments/:comment_id",function(req,res){
    Comment.findByIdAndRemove(req.params.comment_id,function(err){
        if(err){
            res.redirect("back");
        } else {
            req.flash("success","Successfully deleted comment!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;