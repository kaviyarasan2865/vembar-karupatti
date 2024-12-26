import Aboutus from '@/components/user/Aboutus'
import Footer from '@/components/user/Footer'
import Hero from '@/components/user/Hero'
import Navbar from '@/components/user/Navbar'
import Organic from '@/components/user/Organic'
import ProductsDetails from '@/components/user/ProductsDetails'
import Testimonial from '@/components/user/Testimonial'
import React from 'react'

const landing = () => {
  return (
    <>
    <Navbar/>
    <Hero/>
    <ProductsDetails/>
    <Aboutus/>
    <Organic/>
    <Testimonial/>
    <Footer/>
    </>
  )
}

export default landing