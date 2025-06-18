import {assets, dummyEducatorData} from "../../assets/assets"
import {UserButton, useUser} from "@clerk/clerk-react"
import {Link} from 'react-router-dom'

const NavBar = () => {
  const educatorData = dummyEducatorData
  const {user} = useUser()

  return (
    <div className="flex items-center justify-between px-4 md:px-8 border border-gray-500 py-1">
      <Link to='/'>
        <img src={assets.logo} alt="logo" className="w-18 lg:w-22" />
      </Link>
      <div className="flex items-center gap-3">
        <p>Hi!! {user ? user.fullName : "Developers"}</p>
        {user ? <UserButton /> : <img src={assets.profile_img} alt="" className="max-w-8" />}
      </div>
    </div>
  )
}

export default NavBar