import React from 'react'
import { assets } from '../../assets/assets'

const Footer = () => {
  return (
    <footer className='bg-gray-900 md:px-36text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        <div className='flex flex-col md:items-start items-center w-full'>
          {/* first logo */}
          <img src={assets.logo_dark} alt='logo' />
          <p className='text-white/80 mt-6 text-center md:text-left text-sm '>Loreum Ipsum is simply dummy text of the printing and typesetting industry. Loreum Ipsum has been the industry's  standard dummy text.</p>
        </div>

        {/* Companies main item */}
       <div className="flex flex-col md:items-start items-center w-full">
         <h2 className="font-semibold mb-5 text-white">Company</h2>
       <ul className="flex flex-col md:items-start items-center md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2 md:justify-start">
        <li><a href="#">Home</a></li>
      <li><a href="#">About us</a></li>
         <li><a href="#">Contact us</a></li>
        <li><a href="#">Privacy Policy</a></li>
      </ul>
          </div>
        {/* email description */}
        <div className='hidden md:flex flex-col items-start w-full'>
         <h2 className='font-semibold text-white mb-5 '>Subscribe to our newsletter</h2>
         <p className='text-white/80 text-sm '>The latest news,articles, and resources, sent to your inbox weekly.</p>
         <div className='flex items-center gap-2 pt-4'>
          <input type='email' placeholder='Enter your Email' 
          className=' border border-gray-500/30 bg-gray-800 text-gray-500 placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm '
          />
          <button className='text-white bg-blue-600 w-24 h-9 rounded px-2 text-sm'>Subscribe</button>
         </div>
        </div>
      </div>
      <p className='text-white/60 text-center text-xs md:text-sm py-4'>Copyright 2025 @ Amber. All Right Reserved.</p>
    </footer>
  )
}

export default Footer