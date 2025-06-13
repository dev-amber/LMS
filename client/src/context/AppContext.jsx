import { createContext, useEffect, useState } from "react";
import React from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration";
import {useAuth, useUser} from "@clerk/clerk-react"


export const AppContext=createContext()

export const AppContextProvider=(props) =>{


  const currency=import.meta.env.VITE_CURRENCY

  //to click on logo then its navigate to home page
  const navigate=useNavigate();

  //token create for authentication
   const {getToken}=useAuth()
   const {user}=useUser()

   //to display card for this
   const[allCourses,setAllCourses]=useState([])

   //if anyone have already educator then show the bar of educator bnot link
   const [isEducator,setIsEducator]=useState(true);

   const[enrolledCourses,setEnrolledCourses]=useState([])

   //Fetch all courses
   const fetchAllCourses=async()=>{
    setAllCourses(dummyCourses)

     }

     //function to calculate average rating of course
     const calculateRating=(course)=>{
         if(course.courseRatings.length === 0){
          return 0;
         }
         // then calclate average when rating is not equal zero
         let totalRating =0
         course.courseRatings.forEach(rating => {
          totalRating +=rating.rating;
         })
         return totalRating / course.courseRatings.length

     }

    // Function to calculate the duration of a single chapter
const calculateChapterTime = (chapter) => {
  let time = 0;
  chapter.chapterContent.forEach((lecture) => {
    time += lecture.lectureDuration;
  });

  return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
};

// Function to calculate total course duration
const calculateCourseDuration = (course) => {
  let time = 0;
  course.courseContent.forEach((chapter) => {
    chapter.chapterContent.forEach((lecture) => {
      time += lecture.lectureDuration;
    });
  });

  return humanizeDuration(time * 60 * 1000, { units: ['h', 'm'] });
};

// Function to calculate total number of lectures in a course
const calcluateNoOfLectures = (course) => {
  let totalLectures = 0;

  course.courseContent.forEach((chapter) => {
    if (Array.isArray(chapter.chapterContent)) {
      totalLectures += chapter.chapterContent.length;
    }
  });

  return totalLectures;
};

//Fetch user enrolled courses
const fetchUserEnrolledCourses=async()=>{
     setEnrolledCourses(dummyCourses)
}

// Fetch all courses on component mount
useEffect(() => {
  fetchAllCourses();
  fetchUserEnrolledCourses();
}, []);

const logToken=async()=>{
  console.log(await getToken());
}

//gettoken
useEffect(()=>{
  if(user){
  logToken()
  }
},[user])


// Context value object
const value = {
  currency,
  allCourses,
  navigate,
  calculateRating,
  isEducator,
  setIsEducator,
  calcluateNoOfLectures,
  calculateCourseDuration,
  calculateChapterTime,
  enrolledCourses,
  fetchUserEnrolledCourses,
};

  return (
    <AppContext.Provider value={value}>
      {props.children }
    </AppContext.Provider>
  )
}
