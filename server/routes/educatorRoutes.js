import express from "express"
import { addCourse,  educatorDashboardData,  getEducatorCourses, getEnrolledStudentsData, 
updateRoleToEducator } from "../controllers/educatorController.js"
import upload from "../configs/multer.js";
import { protectEducator } from "../middlewares/authMiddleware.js";



const educatorRouter=express.Router()

//Add Educator role
educatorRouter.get('/update-role',updateRoleToEducator);
educatorRouter.post("/add-course",upload.single('image'), addCourse)
educatorRouter.get("/courses",getEducatorCourses);
educatorRouter.get("/dashboard",educatorDashboardData);
educatorRouter.get("/enrolled-students",getEnrolledStudentsData);





export default educatorRouter;