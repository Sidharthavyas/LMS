import { assets } from '../../assets/assets'
import { Link, useLocation } from 'react-router-dom'
import { useClerk, UserButton, useUser } from '@clerk/clerk-react'
import { useContext } from 'react'
import { AppContext } from '../../context/AppContext'

const Navbar = () => {
  const location = useLocation()
  const {navigate,isEducator}=useContext(AppContext)

  const isCourseListPage = location.pathname.includes('/course-list')
  const { openSignIn } = useClerk()
  const { user } = useUser()


  return (
    <div 
      className={`flex items-center justify-between px-2 sm:px-8 md:px-10 lg:px-4 border-b border-gray-500 py-0.25 ${
        isCourseListPage ? 'bg-white' : 'bg-cyan-200/70'
      }`}
    >
      <img 
      onClick={()=>navigate('/')}
        src={assets.logo} 
        alt="Logo" 
        className="w-18 lg:w-22 cursor-pointer" 
      />

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4  text-gray-500">
        <div className="flex items-center gap-5">
          {user && (
            <>
              <button onClick={()=>{navigate('/educator')}}> {isEducator?'Educator Dashboard':'Become Educator'}</button>
              |
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
        </div>
        
        {user ? (
          <UserButton />
        ) : (
          <button 
            onClick={() => openSignIn()} 
            className="bg-blue-600 text-white px-4 py-1 rounded-full"
          >
            Create Account
          </button>
        )}
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden flex items-center gap-2 sm:gap-5 text-gray-500">
        <div className='flex items-center gap-1 sm:gap-2 max-sm:text-xs'>
          {user && (
            <>
               <button onClick={()=>{navigate('/educator')}}> {isEducator?'Educator Dashboard':'Become Educator'}</button>
              |
              <Link to="/my-enrollments">My Enrollments</Link>
            </>
          )}
   
        </div>
        
        {user ? (
          <UserButton />
        ) : (
          <button onClick={()=> openSignIn()}>
            <img src={assets.user_icon} alt="User Icon" />
          </button>
        )}
      </div>
    </div>
  )
}

export default Navbar