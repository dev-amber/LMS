import {clerkClient} from "@clerk/express"
import Course from "../models/Course.js"
import {v2 as cloudinary} from "cloudinary"
import Purchase from "../models/Purchase.js";
import User from "../models/User.js";




//update role to educator

export const updateRoleToEducator = async (req, res) => {
  try {
   const userId=req.auth.userId;  // ✅ Clerk recommends using req.auth() as a function now


    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: 'educator',
      },
    });
    res.json({ success: true, message: 'You can publish a course now' });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// add-course

export const addCourse = async (req, res) => {
  try {
    const { userId: educatorId } = req.auth(); 
    const imageFile = req.file;

    if (!imageFile) {
      return res.json({ success: false, message: "Thumbnail Not Attached" });
    }

    const parsedCourseData = JSON.parse(req.body.courseData);
    parsedCourseData.educator = educatorId;

    const uploadRes = await cloudinary.uploader.upload(imageFile.path); // ✅ uses configured instance
    parsedCourseData.courseThumbnail = uploadRes.secure_url;

    const newCourse = await Course.create(parsedCourseData);
    res.json({ success: true, message: "Course Added", course: newCourse });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


//get educator courses
export const getEducatorCourses=async(req,res)=>{
         try {
          const educator=req.auth.userId

          const courses= await Course.find({educator})
          res.json({success:true, courses})
         } catch (error) {
           res.json({success: false, message:error.message})
         }
}


// get Educator dashboard data (Toatal Earning, Enrolled Students, No. of Courses)
export const educatorDashboardData = async (req, res) => {
  try {
    const educator = req.auth.userId;

    // Get all courses created by this educator
    const courses = await Course.find({ educator });
    const totalCourses = courses.length;

    // Get all purchases for these courses where status is 'completed'
    const courseIds = courses.map(course => course._id);
    const purchases = await Purchase.find({
      courseId: { $in: courseIds },
      status: 'completed',
    });

    // Calculate total earnings
    const totalEarnings = purchases.reduce((sum, purchase) => sum + purchase.amount, 0);

    // Gather enrolled students per course
    const enrolledStudentsData = [];

    for (const course of courses) {
      const students = await User.find(
        { _id: { $in: course.enrolledStudents } },
        'name imageUrl'
      );

      students.forEach(student => {
        enrolledStudentsData.push({
          courseTitle: course.courseTitle,
          student,
        });
      });
    }

    // Send the final response after processing all data
    res.json({
      success: true,
      dashboardData: {
        totalCourses,
        totalEarnings,
        enrolledStudentsData,
      },
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};




// Get enrolled students data with purchase data
export const getEnrolledStudentsData=async(req,res)=>{
  try {
    const educator=req.auth.userId;

   const courses= await Course.find({educator}) 

     //calculate total earning need ID of each course
  const courseIds=courses.map(course => course._id);

  const purchases=await Purchase.find({
     courseId:{$in:courseIds},
    status: 'completed'
  }.populate('userId', 'name imageUrl'),populate('courseId','courseTitle'))

  const enrolledStudents=purchases.map(purchase => ({
    student :purchase.userId,
    courseTitle: purchase.courseId.courseTitle,
    purchaseDate:purchase.createdAt
  }));

  res,json({success:true, enrolledStudents})
   
  } catch (error) {
     res.json({success: false, message:error.message})
  }
}



