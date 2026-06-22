import { Hero } from '@/components/home/hero'
import { FeaturedDishes } from '@/components/home/featured-dishes'
import { StorySection } from '@/components/home/story-section'
import { VisitCta } from '@/components/home/visit-cta'

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeaturedDishes />
      <StorySection />
      <VisitCta />
    </>
  )
}
