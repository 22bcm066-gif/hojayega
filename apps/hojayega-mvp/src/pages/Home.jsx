import React from 'react'
import PageTransition from '../components/layout/PageTransition.jsx'
import Hero from '../components/home/Hero.jsx'
import HowItWorks from '../components/home/HowItWorks.jsx'
import Features from '../components/home/Features.jsx'
import CategoriesGrid from '../components/home/CategoriesGrid.jsx'
import FeaturedTasks from '../components/home/FeaturedTasks.jsx'
import CtaBanner from '../components/home/CtaBanner.jsx'
import { useDocumentTitle } from '../hooks/useDocumentTitle.js'

export default function Home() {
  useDocumentTitle('Home')

  return (
    <PageTransition>
      <Hero />
      <HowItWorks />
      <Features />
      <CategoriesGrid />
      <FeaturedTasks />
      <CtaBanner />
    </PageTransition>
  )
}
