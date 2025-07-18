import React from 'react'
import { Hero } from '../sections/home/Hero'
import { About } from '../sections/home/About'
import { Products } from '../sections/home/Products'

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <About />
      <Products />
    </div>
  )
}
