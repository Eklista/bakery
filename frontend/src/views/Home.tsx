import React from 'react'
import { Hero } from '../sections/home/Hero'
import { About } from '../sections/home/About'

export const Home: React.FC = () => {
  return (
    <div>
      <Hero />
      <About />
    </div>
  )
}