import { useEffect, useState } from "react";
import { createContext } from "react";
import { dummyCourses } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import humanizeDuration from "humanize-duration"
//create context
export const AppContext = createContext()

 const AppContextProvider =(props)=>{
    const currency = import.meta.env.VITE_CURRENCY
    const navigate =useNavigate()
    const [enrolledCourses, setEnrolledCourses] = useState([])
    const [allCourses, setAllCourses] = useState([])
    const [isEducator, setIsEducator] = useState(true)
    // fetch all courses
    const fetchAllCourses = async()=>{
        setAllCourses(dummyCourses)

    }

    //function to calculate average rating of course
    const calculateRating = (course)=>{
        if(course.courseRatings.length===0){
            return 0;
        }
        let totalRating = 0
        course.courseRatings.forEach(rating =>{
            totalRating+=rating.rating
        })
        return totalRating / course.courseRatings.length

    }
    const calculateNumberofLectures=(course)=>{
    let totalLectures=0
    course.courseContent.forEach(chapter=>{
        if(Array.isArray(chapter.chapterContent)){
            totalLectures+=chapter.chapterContent.length
        }
    })
    return totalLectures
}

    // fetch user Enrolled Courses
    const fetchUserEnrolledCourses = async()=>{
        setEnrolledCourses(dummyCourses)
    }

    // function to calculate  course chapter time
    const calculateChapterTime = (chapter)=>{
        let time = 0
        chapter.chapterContent.map((lecture)=> time += lecture.lectureDuration)
        return humanizeDuration(time *60 *1000,{units:['h','m']})
    }
    // funtion to calculate Course duration
    const calculateCourseDuration = (course)=>{
        let time = 0 
        course.courseContent.map((chapter)=>chapter.chapterContent.map((lecture)=>time +=lecture.lectureDuration))
         return humanizeDuration(time *60 *1000,{units:['h','m']})
    }
    useEffect(()=>{
        fetchAllCourses()
        fetchUserEnrolledCourses()
    },[])
    const value = {
        currency,
        allCourses,
        navigate,
        calculateChapterTime,
        calculateCourseDuration,
        calculateNumberofLectures,
        calculateRating,
        isEducator,setIsEducator,
        enrolledCourses,
        fetchUserEnrolledCourses
    }
// function to calculate number of lectures in the course


    return (
    <AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>
)
}

export default AppContextProvider