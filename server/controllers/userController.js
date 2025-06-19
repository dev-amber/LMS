import Stripe from "stripe"
import User from "../models/User.js"
import Purchase from "../models/Purchase.js"
import Course from "../models/Course.js"
import { CourseProgress } from "../models/courseProgress.js"


//get user data
export const getUserData=async(req,res)=>{
    try {
        const userId=req.auth.userId
        const user=await User.findById(userId);

        if(!user){
            return res.json({success:false, message:"User not found"});
        }

        res.json({success: true, user})
    } catch (error) {
        return res.json({success: false,message:error.message })
    }
}

//nuser enrolled courses with lecture link

export const userEnrolledCourses=async(req,res)=>{
    try {
          const userId=req.auth.userId
        const userData=await User.findById(userId).populate('enrolledCourses');

         res.json({success: true, enrolledCourses: userData.enrolledCourses})

    } catch (error) {
         return res.json({success: false,message:error.message })
    }
}


// purchase  course


export const purchaseCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { origin } = req.headers;
    const userId = req.auth.userId;

    const userData = await User.findById(userId);
    const courseData = await Course.findById(courseId);

    if (!userData || !courseData) {
      return res.json({ success: false, message: 'Data not found' });
    }

    const amount = (
      courseData.coursePrice -
      (courseData.discount * courseData.coursePrice) / 100
    ).toFixed(2);

    const purchaseData = {
      courseId: courseData._id,
      userId,
      amount,
    };

    const newPurchase = await Purchase.create(purchaseData);

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: courseData.courseTitle,
          },
          unit_amount: Math.floor(Number(amount) * 100), // Correct cents
        },
        quantity: 1,
      },
    ];

    const session = await stripeInstance.checkout.sessions.create({
      success_url: `${origin}/loading/my-enrollements`,
      cancel_url: `${origin}/`,
      line_items: line_items,
      mode: 'payment', // ✅ Correct mode
      metadata: {
        purchaseId: newPurchase._id.toString(),
      },
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};


// update user Course Progress
export const updateUserCourseProgress=async(req,res)=>{
  try {
    const userId=req.auth.userId
    const {courseId, lectureId}= req.body;
    const progressData= await CourseProgress.findOne({userId, courseId})

    if(progressData){
      if(progressData.lectureCompleted.includes(lectureId)){

        return res.json({success: true, message:"Lecture Already Completed"});
    }

    progressData.lectureCompleted.push(lectureId)
    await progressData.save();
  }else{
    await CourseProgress.create({
      userId,
      courseId,
      lectureCompleted:[lectureId]
    })
    res.json({success: true, message: 'Progress updated'})
  }
  } catch (error) {
     return res.json({ success: false, message: error.message });
  }
}


// getuser Course progress
export const getUserCourseProgress=async(req,res)=>{
  try {
     const userId=req.auth.userId
    const {courseId, lectureId}= req.body;
    const progressData= await CourseProgress.findOne({userId, courseId})

    res.json({success: true, progressData})
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
}

// add user rating to course
export const addUserRating=async(req,res)=>{
  
   const userId=req.auth.userId;
     const {courseId,rating}= req.body;

     // check if userid courseis are avialabe in req
     if(!courseId || !userId || !rating || rating  < 1 || rating > 5){
      return res.json({success: false, message: 'Invalid Details'})
     }

  try {
    const course=await Course.findById(courseId)

    // course details
    if(!course){
        return res.json({success: false, message: 'Course not found'})
    }
    const user=await User.findById(userId)

    if(!user || !user.enrolledCourses.includes(courseId)){
           return res.json({success: false, message: 'User have not purchase  this course'})
    }

    // user have already provide rating
    const existingRatingIndex=course.courseRatings.findIndex(r => r.userId === userId)
      if(existingRatingIndex > -1 ){
        // its meanns already exist only update
        course.courseRatings[existingRatingIndex].rating =rating;
      }else{
      //not avialabale so we create new
      course.courseRatings.push({userId, rating});
      }
      await course.save();

      return res.json({success: true ,message: "Rating added"});
  } catch (error) {
     return res.json({ success: false, message: error.message });
  }
}