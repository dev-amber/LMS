import React from 'react'
import { assets, dummyTestimonial } from '../../assets/assets'

const TestimonialSection = () => {
  return (
    <div className='pb-14 px-8 md:px-0'>
       <h2 className='font-medium text-gray-800  text-3xl'>Testimonials</h2>
       <p className='md:text-base text-gray-500 mt-3'>Hear from learners as they share their journeys of transformation, success and how our 
        <br/> platform has made a difference in their lives.</p>
        <div className='grid grid-cols-4 gap-8 mt-14'>
          {dummyTestimonial.map((testimonials,index)=>(
            <div key={index}
             className='text-sm text-left border border-gray-500/30 ob-6 rounded-lg bg-white 
             shadow-[0px_4px_15px_0px]  shadow-black/5 overflow-hidden'>
              <div className='flex items-center gap-4 px-5 py-4 bg-gray-500/10'>
                <img  className="h-12 w-12 rounded-full" src={testimonials.image} alt={testimonials.name}/>
                <div>
                  <h1 className='textlg font-medium text-gray-800'>{testimonials.name}</h1>
                  <p className='text-gray800/80'>{testimonials.role}</p>
                  </div>
                    </div>
                    <div className='p-5 pb-7'>
                    <div className='flex gap-0.5'>
                      {[...Array(5)].map((_,i)=> (<img key={i} src={i < Math.floor (testimonials.rating) ? assets.star : assets.star_blank} alt='star'
                           className='w-3.5 h-3.5'/>))}

                      </div>
                      <p className='text-gray-500 mt-5'>{testimonials.feedback}</p>
                </div>
                <a href='#' className='text-blue-500 underline px-5'>Read more</a>
              </div>
          ))}
        </div>
          
    </div>
  )
}

export default TestimonialSection