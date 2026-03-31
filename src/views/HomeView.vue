<template>
  <div class="home-view">
    <!-- Latest Updates - Moved to top -->
    <section class="latest-section">
      <div class="container">
        <h2 class="section-title">Cập Nhật Mới</h2>
        <div class="carousel-container">
          <!-- Skeleton Loading for Latest -->
          <div v-if="loading" class="latest-comics-carousel">
            <SkeletonCard v-for="i in 8" :key="i" class="comic-card" />
          </div>
          <!-- Actual Content -->
          <div v-else class="latest-comics-carousel" ref="carouselRef">
            <ComicCard v-for="comic in latestComics" :key="comic.slug" :comic="comic" />
          </div>
        </div>
        <div class="section-action">
          <router-link to="/status/truyen-moi" class="btn btn-outline">
            Xem thêm
          </router-link>
        </div>
      </div>
    </section>

    <!-- Featured Section -->
    <section class="featured-section">
      <div class="container">
        <h2 class="section-title">Truyện Nổi Bật</h2>
        <!-- Skeleton Loading for Featured -->
        <div v-if="loading" class="featured-comics">
          <SkeletonCard v-for="i in 12" :key="i" />
        </div>
        <!-- Actual Content -->
        <div v-else class="featured-comics">
          <ComicCard v-for="comic in featuredComics" :key="comic.slug" :comic="comic" />
        </div>
      </div>
    </section>

    <!-- Popular Comics -->
    <section class="popular-section">
      <div class="container">
        <h2 class="section-title">Truyện Phổ Biến</h2>
        <!-- Skeleton Loading for Popular -->
        <div v-if="loading" class="grid-comics">
          <SkeletonCard v-for="i in 6" :key="i" />
        </div>
        <!-- Actual Content -->
        <div v-else class="grid-comics">
          <ComicCard v-for="comic in popularComics" :key="comic.slug" :comic="comic" />
        </div>
        <div class="section-action">
          <router-link to="/status/hoan-thanh" class="btn btn-outline">
            Xem thêm
          </router-link>
        </div>
      </div>
    </section>

    <!-- Categories Preview -->
    <section class="categories-section">
      <div class="container">
        <h2 class="section-title">Thể Loại Phổ Biến</h2>
        <!-- Skeleton Loading for Categories -->
        <div v-if="loading" class="categories-grid">
          <div v-for="i in 8" :key="i" class="category-card skeleton">
            <div class="category-icon skeleton-icon"></div>
            <div class="skeleton-line"></div>
            <div class="skeleton-line short"></div>
          </div>
        </div>
        <!-- Actual Content -->
        <div v-else class="categories-grid">
          <router-link v-for="category in popularCategories" :key="category.slug" :to="`/category/${category.slug}`"
            class="category-card">
            <div class="category-icon">
              <span>{{ category.name.charAt(0) }}</span>
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.count }} truyện</p>
          </router-link>
        </div>
        <div class="section-action">
          <router-link to="/categories" class="btn btn-outline">
            Xem tất cả thể loại
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import ComicCard from '@/components/common/ComicCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import { getHome, getCategories } from '@/api/otruyen'

const featuredComics = ref([])
const latestComics = ref([])
const popularComics = ref([])
const popularCategories = ref([])
const carouselRef = ref(null)
const loading = ref(true)

// Auto-scroll variables
let autoScrollInterval = null
let isDragging = false
let startX = 0
let scrollLeft = 0
let isPaused = false

// Auto-scroll function
const startAutoScroll = () => {
  if (autoScrollInterval) return

  autoScrollInterval = setInterval(() => {
    if (!carouselRef.value || isPaused || isDragging) return

    const carousel = carouselRef.value
    const scrollAmount = 220 // Width of one comic card plus gap

    // Check if we've reached the end
    if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth - 10) {
      // Reset to beginning
      carousel.scrollTo({
        left: 0,
        behavior: 'smooth'
      })
    } else {
      // Scroll to next card
      carousel.scrollTo({
        left: carousel.scrollLeft + scrollAmount,
        behavior: 'smooth'
      })
    }
  }, 2500)
}

const stopAutoScroll = () => {
  if (autoScrollInterval) {
    clearInterval(autoScrollInterval)
    autoScrollInterval = null
  }
}

// Mouse drag functionality
const handleMouseDown = (e) => {
  isDragging = true
  isPaused = true
  startX = e.pageX - carouselRef.value.offsetLeft
  scrollLeft = carouselRef.value.scrollLeft
  carouselRef.value.style.cursor = 'grabbing'
  carouselRef.value.style.scrollBehavior = 'auto'
  stopAutoScroll()
}

const handleMouseMove = (e) => {
  if (!isDragging) return
  e.preventDefault()
  const x = e.pageX - carouselRef.value.offsetLeft
  const walk = (x - startX) * 2
  carouselRef.value.scrollLeft = scrollLeft - walk
}

const handleMouseUp = () => {
  isDragging = false
  carouselRef.value.style.cursor = 'grab'
  carouselRef.value.style.scrollBehavior = 'smooth'
  setTimeout(() => {
    isPaused = false
    startAutoScroll()
  }, 2000) // Resume auto-scroll after 2 seconds
}

const handleMouseLeave = () => {
  if (isDragging) {
    handleMouseUp()
  }
}

const handleMouseEnter = () => {
  isPaused = true
  stopAutoScroll()
}

const handleMouseLeaveCarousel = () => {
  isPaused = false
  if (!isDragging) {
    startAutoScroll()
  }
}

// Load data
const loadData = async () => {
  loading.value = true
  try {
    const [homeData, categoriesData] = await Promise.all([
      getHome(),
      getCategories()
    ])

    // Featured comics (first 12 items)
    featuredComics.value = homeData.items?.slice(0, 12) || []

    // Latest comics (next 12 items) - Get more items for carousel
    latestComics.value = homeData.items?.slice(12, 30) || []

    // Popular comics (most viewed) - Limit to 6 items
    popularComics.value = homeData.items
      ?.slice()
      .sort((a, b) => (b.views || 0) - (a.views || 0))
      .slice(0, 6) || []

    // Popular categories (first 8 categories)
    popularCategories.value = categoriesData.items?.slice(0, 8) || []

    // Start auto-scroll after DOM is updated
    await nextTick()
    startAutoScroll()
  } catch (error) {
    console.error('Error loading home data:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()

  // Add mouse event listeners
  if (carouselRef.value) {
    carouselRef.value.addEventListener('mousedown', handleMouseDown)
    carouselRef.value.addEventListener('mousemove', handleMouseMove)
    carouselRef.value.addEventListener('mouseup', handleMouseUp)
    carouselRef.value.addEventListener('mouseleave', handleMouseLeave)
    carouselRef.value.addEventListener('mouseenter', handleMouseEnter)
    carouselRef.value.addEventListener('mouseleave', handleMouseLeaveCarousel)
  }
})

onUnmounted(() => {
  stopAutoScroll()

  // Remove event listeners
  if (carouselRef.value) {
    carouselRef.value.removeEventListener('mousedown', handleMouseDown)
    carouselRef.value.removeEventListener('mousemove', handleMouseMove)
    carouselRef.value.removeEventListener('mouseup', handleMouseUp)
    carouselRef.value.removeEventListener('mouseleave', handleMouseLeave)
    carouselRef.value.removeEventListener('mouseenter', handleMouseEnter)
    carouselRef.value.removeEventListener('mouseleave', handleMouseLeaveCarousel)
  }
})
</script>

<style scoped>
.home-view {
  padding-bottom: 2rem;
}

/* Latest Updates Carousel */
.latest-section {
  margin-bottom: 3rem;
}

.carousel-container {
  position: relative;
  margin-bottom: 2rem;
}

.latest-comics-carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 0.5rem 0;
  scrollbar-width: thin;
  scrollbar-color: var(--border-color) transparent;
  cursor: grab;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
}

.latest-comics-carousel:active {
  cursor: grabbing;
}

.latest-comics-carousel::-webkit-scrollbar {
  height: 8px;
}

.latest-comics-carousel::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 4px;
}

.latest-comics-carousel::-webkit-scrollbar-thumb {
  background-color: var(--border-color);
  border-radius: 4px;
  transition: background-color var(--transition-fast);
}

.latest-comics-carousel::-webkit-scrollbar-thumb:hover {
  background-color: var(--text-muted);
}

.latest-comics-carousel .comic-card {
  flex: 0 0 200px;
  min-width: 200px;
  pointer-events: auto;
}

/* Featured Section */
.featured-section {
  margin-bottom: 3rem;
}

.featured-comics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Grid Comics - Shared with Featured and Popular */
.grid-comics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

/* Section Styles */
.popular-section,
.categories-section {
  margin-bottom: 3rem;
}

.section-action {
  text-align: center;
  margin-top: 2rem;
}

/* Categories Grid */
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.category-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: all var(--transition-fast);
}

.category-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.category-icon {
  width: 48px;
  height: 48px;
  background-color: var(--accent-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  font-weight: 700;
  font-size: 1.25rem;
  color: white;
}

.category-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.category-card p {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0;
}

/* Category Skeleton Loading */
.category-card.skeleton {
  pointer-events: none;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
}

.category-card.skeleton .skeleton-icon {
  background: linear-gradient(90deg,
      var(--bg-secondary) 0%,
      var(--bg-primary) 50%,
      var(--bg-secondary) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.category-card.skeleton .skeleton-line {
  background: linear-gradient(90deg,
      var(--bg-secondary) 0%,
      var(--bg-primary) 50%,
      var(--bg-secondary) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  height: 1.2em;
  margin: 0.5rem 0;
}

.category-card.skeleton .skeleton-line.short {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }

  100% {
    background-position: 200% 0;
  }
}

/* Mobile Responsive */
@media (max-width: 768px) {

  .featured-comics,
  .grid-comics {
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 1rem;
  }

  .latest-comics-carousel .comic-card {
    flex: 0 0 160px;
    min-width: 160px;
  }
}

@media (max-width: 480px) {

  .featured-comics,
  .grid-comics {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 0.75rem;
  }

  .latest-comics-carousel .comic-card {
    flex: 0 0 140px;
    min-width: 140px;
  }
}
</style>
