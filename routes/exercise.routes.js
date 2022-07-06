const router = require("express").Router()
const ExerciseModel= require("../models/Exercises.model")
const fileUploader = require ("../config/cloudinary.config")



router.get("/exercise-list",(req,res,next)=>{
    
    ExerciseModel.find()
    .then(exercise=>{
        res.render("exercise/exercises",{exercise,userInSession: req.session.currentUser})
    })
})

router.get("/create-exercise",(req,res,next)=>{
    res.render("exercise/new-exercise",{userInSession: req.session.currentUser})
})

router.post("/create-exercise",fileUploader.single("exercise-image"),(req,res,next)=>{

const {exercise,series,repetitions,breaks}= req.body


ExerciseModel.create({exercise,series,repetitions,breaks,imageUrl:req.file.path})
.then(()=> res.redirect("exercise-list"))
.catch(error=>next (error))

})


router.get("/exercise-edit/:id",(req,res,next)=>{
    const {id} = req.params

    ExerciseModel.findById(id)
    .then(exercise=>{
        res.render("exercise/edit-exercise",{exercise,userInSession: req.session.currentUser})
    })
    .catch(error =>next(error))
})

router.post("/exercise-edit/:id",fileUploader.single("exercise-image"),(req,res,next)=>{
    const {id} = req.params
    const {exercise,series,repetitions,breaks, existingImage}= req.body
    let imageUrl;


    if(req.file){imageUrl=req.file.path}
    else {imageUrl = existingImage}

    ExerciseModel.findByIdAndUpdate(id,{exercise,series,repetitions,breaks, existingImage},{new:true})
    .then(()=>{
        res.redirect("/exercise/exercise-list")
    })
    .catch(error =>next(error))
})

router.get("/exercise-delete/:id",(req,res,next)=>{
    const {id}= req.params

    ExerciseModel.findByIdAndDelete(id)
    .then(()=> res.redirect("/exercise/exercise-list"))
    .catch(error =>next(error))
})




module.exports= router