import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className="flex md:flex-row flex-col-reverse items-center justify-between w-full px-8 py-6 border-t border-gray-200 bg-white">
      <div className="flex md:flex-row flex-col items-center md:items-start gap-4">
        <img src={assets.logo} alt="Logo" className='hidden md:block w-20' />
        
        <div className='hidden md:block h-16 w-px bg-gray-300 mx-4'></div>
        
        <div className="flex flex-col items-center md:items-start">
          <p className='text-xs md:text-sm text-gray-500 mb-4'>
            Copyright © 2025 NexLearn. All rights reserved.
          </p>
          
          <div className='flex items-center gap-3'>
            <a href="#" className="hover:opacity-75 transition-opacity">
              <img src={assets.facebook_icon} alt="Facebook" className="w-5 h-5" />
            </a>
            <a href="#" className="hover:opacity-75 transition-opacity">
              <img src={assets.twitter_icon} alt="Twitter" className="w-5 h-5" />
            </a>
            <a href="#" className="hover:opacity-75 transition-opacity">
              <img src={assets.instagram_icon} alt="Instagram" className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer