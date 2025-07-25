import { useContext, useEffect, useState,UseNavigate } from "react"
import{AppContext} from '../../context/AppContext'
import SearchBar from '../../components/students/SearchBar'
import { useParams } from "react-router-dom"
import CourseCard from '../../components/students/CourseCard'
import Footer from "../../components/students/Footer"
import { assets } from "../../assets/assets"

const CoursesList = () => {
  const{input}=useParams()
  
  const{navigate,allCourses}=useContext(AppContext)
  const [filteredCourse,setFilteredCourse]=useState([])

  useEffect(()=>{
    if(allCourses && allCourses.length>0){
      const tempCourses = allCourses.slice()
      input?
      setFilteredCourse(
        tempCourses.filter(
          item => item.courseTitle.toLowerCase().includes(input.toLowerCase())
        )
      )
      :setFilteredCourse(tempCourses)
    }
    
  },[allCourses,input])
  return (
    <>
    <div className="relative md:px-36 px-8 pt-20 text-left">
      <div className="flex md:flex-row flex-col gap-6 items-start justify-between w-full">
     <div className="text-4xl font-semibold text-gray-800">
         <h1>Course List</h1>
        <p className="text-gray-500">  <span className="text-blue-600 cursor-pointer "onClick={()=>navigate('/')} >Home</span> / <span>Course list</span></p>
     </div>
      <SearchBar data={input}/>
      </div>
    {
      input && <div className="inline-flex gap-4 px-4 py-2 border mt-8 -mb-8 text-gray-600">
        <p>{input}</p>
        <img src={assets.cross_icon}alt=""  className="cursor-pointer " onClick={()=>navigate('/course-list')}/>
      </div>
    }

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 my-16 gap-3 px-2 md:0 ">
{filteredCourse.map((course,index)=><CourseCard key={index} course={course}/>)}
      </div>
    </div>
    <Footer/>
    </>
  )
}

export default CoursesList