import { Route, Routes, useMatch } from 'react-router-dom'
import Home from './pages/studentPage/Home'
import CoursesList from './pages/studentPage/CoursesList'
import CourseDetails from './pages/studentPage/CourseDetails'
import MyEnrollments from './pages/studentPage/MyEnrollments'
import Player from './pages/studentPage/Player'
import Loading from './components/students/Loading'
import Educator from './pages/educatorPage/Educator'
import DashBoard from './pages/educatorPage/DashBoard'
import AddCourse from './pages/educatorPage/AddCourse'
import MyCourses from './pages/educatorPage/MyCourses'
import StudentsEnrolled from './pages/educatorPage/StudentsEnrolled'
import Navbar from './components/students/Navbar'
import "quill/dist/quill.snow.css";
 import { ToastContainer } from 'react-toastify';
 
const App = () => {

  const isEducatorRoute = useMatch("/educator/*")
  return (
    <div className='text-default min-h-screen '>
      <ToastContainer/>
      {!isEducatorRoute && <Navbar/>}
      
      <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/course-list' element={<CoursesList/>}/>
      <Route path='/course-list/:input' element={<CoursesList/>}/>
      <Route path='/course/:id' element={<CourseDetails/>}/>
      <Route path='/my-enrollments' element={<MyEnrollments/>}/>
      <Route path='/player/:courseId' element={<Player/>}/>
      <Route path='/loading/:path' element={<Loading/>}/>
      <Route path='/educator' element={<Educator/>}>
      <Route path='/educator' element={<DashBoard/>}/>
      <Route path='add-course' element={<AddCourse/>}/>
      <Route path='my-courses' element={<MyCourses/>}/>
      <Route path='students-enrolled' element={<StudentsEnrolled/>}/>

      </Route>

      
      </Routes>
    </div>
  )
}

export default App