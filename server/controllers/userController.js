import Stripe from "stripe"
import User from "../models/User.js"
import Purchase from "../models/Purchase.js"
import Course from "../models/Course.js"


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
