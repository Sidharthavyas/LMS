import { getAuth } from "@clerk/express"
import User from "../models/User.js"
import { Purchase } from "../models/Purchase.js";
import Stripe from "stripe";
import Course from "../models/Course.js";
import { CourseProgress } from "../models/CourseProgress.js";
// Get User Data
 export const getUserData = async(req,res)=>{
    try {
        const {userId}=getAuth(req)
        const user = await User.findById(userId)
        if(!user){
            return res.json({success:false,message:'User not Found'})
        }
        res.json({success:true,user})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
 }

 // User Enrolled Courses with Lecture Links

 export const userEnrolledCourses = async(req,res)=>{
    try {
         const {userId}=getAuth(req)
         const userData = await User.findById(userId).populate('enrolledCourses')
         res.json({success:true,enrolledCourses:userData.enrolledCourses})

    } catch (error) {
        res.json({success:false,message:error.message})
    }
 }




 // Purchase Course 

export const purchaseCourse = async (req,res)=>{
   
    try {
         const {courseId} =req.body
         const {origin}=req.headers
         const {userId} =getAuth(req) 
         const userData = await User.findById(userId)
         const courseData = await Course.findById(courseId)
         if(!userData || !courseData){
            return res.json({success:false,message:'Data not Found'})

         }
         const purchaseData = {
            courseId:courseData._id,
            userId,
            amount:(courseData.coursePrice - courseData.discount * courseData.coursePrice/100).toFixed()
         }
         const newPurchase = await Purchase.create(purchaseData)
         // Stripe Gateway Initialize
         const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
         const currency = process.env.CURRENCY.toLowerCase()


         // Creating Line items to for Stripe 
         const line_items = [{
            price_data:{
                currency,
                product_data:{
                    name:courseData.courseTitle

                },
                unit_amount:Math.floor(newPurchase.amount) * 100

            },
            quantity:1
         }]
         const session = await stripeInstance.checkout.sessions.create({
            success_url:`${origin}/loading/my-enrollments`,
            cancel_url:`${origin}/`,
            line_items:line_items,
            mode:'payment',
            metadata:{
                purchaseId:newPurchase._id.toString()
            }
         })
         res.json({success:true,session_url:session.url})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


// Update User Course Progress
export const updateUserCourseProgress= async(req,res)=>{
    try {
        const {userId}=getAuth(req)
        const{courseId,lectureId}=req.body
        const progressData= await CourseProgress.findOne({userId,courseId})
        if(progressData){
            if(progressData.lectureCompleted.includes(lectureId)){
                return res.json({success:true,message:"Lecture Already Completed"})

            }
            progressData.lectureCompleted.push(lectureId)
            await progressData.save()

        }else{
            await CourseProgress.create({
              userId,
              courseId,
              lectureCompleted:[lectureId]  
            })
        }

        res.json({success:true,message:'Progress Updated'})
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}

// get user Course Progress

export const getuserCourseProgress = async(req,res)=>{
    try {
        const {userId}=getAuth(req)
        const{courseId}=req.body
        const progressData= await CourseProgress.findOne({userId,courseId})
        res.json({success:true,progressData})
    } catch (error) {
        res.json({success:false,message:error.message})
    }
}


// Add User Rating  to Course
export const addUserRating = async(req,res)=>{
      const {userId}=getAuth(req)
      const{courseId,rating}=req.body
      if(!courseId || !userId || !rating || rating < 1 || rating > 5){
        return res.json({success:false,message:'Invalid Details'})
      }
      try {
       const course = await Course.findById(courseId)
       if(!course){
        return res.json({success:false,message:"Course not Found"})
       }
       const user = await User.findById(userId)
        if (!user || !user.enrolledCourses.includes(courseId)) {
        return res.json({ success: false, message: 'User has not purchased this course.' })
        }

        const existingRatingIndex = course.courseRatings.findIndex(r =>r.userId === userId)
        if(existingRatingIndex > -1){
          course.courseRatings[existingRatingIndex].rating = rating;

        }else{
            course.courseRatings.push({userId,rating})
        }
        await course.save()
        return res.json({success:true,message:'Rating Added'})
      } catch (error) {
        res.json({success:false,message:error.message})
      }
}