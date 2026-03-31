<template>
  <div class="category-detail-view">
    <div class="container">
      <!-- Category Header -->
      <div class="category-header">
        <div class="category-info">
          <div class="category-icon">
            <span>{{ getCategoryIcon(category.name) }}</span>
          </div>
          <div class="category-details">
            <h1 class="category-title">{{ category.name }}</h1>
            <p class="category-description">{{ getCategoryDescription(category.name) }}</p>
            <div class="category-stats">
              <span class="stat-item">
                <strong>{{ totalComics }}</strong> truyện
              </span>
              <span class="stat-item">
                <strong>{{ category.count || 0 }}</strong> lượt xem
              </span>
              <span class="category-trend" :class="getTrendClass(category.trend)">
                {{ getTrendText(category.trend) }}
              </span>
            </div>
          </div>
        </div>

        <!-- Breadcrumb -->
        <div class="breadcrumb">
          <router-link to="/">Trang chủ</router-link>
          <span class="separator">/</span>
          <router-link to="/categories">Thể loại</router-link>
          <span class="separator">/</span>
          <span class="current">{{ category.name }}</span>
        </div>
      </div>

      <!-- Filters and Controls -->
      <div class="list-controls">
        <div class="control-group">
          <div class="sort-options">
            <label for="sort-select">Sắp xếp:</label>
            <select id="sort-select" v-model="currentSort" @change="handleSortChange">
              <option value="latest">Mới cập nhật</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="name">Theo tên A-Z</option>
              <option value="views">Lượt xem</option>
              <option value="rating">Đánh giá cao</option>
            </select>
          </div>

          <div class="view-options">
            <button class="view-btn" :class="{ active: viewMode === 'grid' }" @click="viewMode = 'grid'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button class="view-btn" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Comics Grid/List -->
      <div class="comics-section">
        <!-- Skeleton Loading -->
        <div v-if="loading" :class="viewMode === 'grid' ? 'grid-comics' : 'list-comics'">
          <template v-if="viewMode === 'grid'">
            <SkeletonCard v-for="i in 12" :key="i" />
          </template>
          <template v-else>
            <div v-for="i in 8" :key="i" class="skeleton-list-item">
              <div class="skeleton-thumbnail"></div>
              <div class="skeleton-content">
                <div class="skeleton-line title"></div>
                <div class="skeleton-line description"></div>
                <div class="skeleton-meta">
                  <div class="skeleton-line meta"></div>
                  <div class="skeleton-line meta"></div>
                </div>
              </div>
            </div>
          </template>
        </div>

        <div v-else-if="comics.length === 0" class="empty-state">
          <div class="empty-icon">📚</div>
          <h3>Không tìm thấy truyện</h3>
          <p>Không có truyện nào trong thể loại này.</p>
        </div>

        <div v-else>
          <!-- Grid View -->
          <div v-if="viewMode === 'grid'" class="grid-comics">
            <ComicCard v-for="comic in comics" :key="comic.slug" :comic="comic" />
          </div>

          <!-- List View -->
          <div v-else class="list-comics">
            <div v-for="comic in comics" :key="comic.slug" class="list-item">
              <router-link :to="`/comic/${comic.slug}`" class="list-item-content">
                <div class="list-item-thumbnail">
                  <img :src="comic.thumbnail" :alt="comic.name" />
                  <div class="list-item-status" :class="getStatusClass(comic.status)">
                    {{ getStatusText(comic.status) }}
                  </div>
                </div>
                <div class="list-item-info">
                  <h3 class="list-item-title">{{ comic.name }}</h3>
                  <p class="list-item-description">{{ comic.description || 'Không có mô tả' }}</p>
                  <div class="list-item-meta">
                    <span class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                        <circle cx="12" cy="12" r="3"></circle>
                      </svg>
                      {{ formatViews(comic.views) }}
                    </span>
                    <span class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <polyline points="4 17 10 11 4 5"></polyline>
                        <line x1="12" y1="19" x2="20" y2="19"></line>
                      </svg>
                      Chapter {{ comic.latestChapter }}
                    </span>
                    <span class="meta-item">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                        stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      {{ formatDate(comic.updatedAt) }}
                    </span>
                  </div>
                </div>
              </router-link>
            </div>
          </div>

          <!-- Pagination -->
          <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
            @page-change="handlePageChange" />
        </div>
      </div>

      <!-- Related Categories -->
      <div class="related-categories">
        <h2 class="section-title">Thể Loại Liên Quan</h2>
        <div class="related-tags">
          <router-link v-for="relatedCategory in relatedCategories" :key="relatedCategory.slug"
            :to="`/category/${relatedCategory.slug}`" class="related-tag">
            {{ relatedCategory.name }}
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComicCard from '@/components/common/ComicCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import { getComicsByCategory, getCategories } from '@/api/otruyen'

const route = useRoute()
const router = useRouter()

const category = ref({})
const comics = ref([])
const categories = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const currentSort = ref('latest')
const viewMode = ref('grid')

// Load category data
const loadCategoryData = async () => {
  loading.value = true
  try {
    // Load category comics
    const comicsResponse = await getComicsByCategory(route.params.slug, currentPage.value)
    comics.value = comicsResponse.items || []
    totalPages.value = comicsResponse.pagination?.totalPages || 1

    // Load all categories to get category info
    if (categories.value.length === 0) {
      const categoriesResponse = await getCategories()
      categories.value = categoriesResponse.items || []
    }

    // Find current category info
    const currentCategory = categories.value.find(cat => cat.slug === route.params.slug)
    category.value = currentCategory || { name: route.params.slug }

    // Apply sorting
    applySorting()
  } catch (error) {
    console.error('Error loading category data:', error)
    comics.value = []
    category.value = { name: route.params.slug }
  } finally {
    loading.value = false
  }
}

// Total comics count
const totalComics = computed(() => {
  return comics.value.length
})

// Related categories (random selection)
const relatedCategories = computed(() => {
  if (!categories.value.length) return []

  const currentSlug = route.params.slug
  const otherCategories = categories.value.filter(cat => cat.slug !== currentSlug)

  // Return 6 random categories
  const shuffled = [...otherCategories].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, 6)
})

// Apply sorting
const applySorting = () => {
  const sortedComics = [...comics.value]

  switch (currentSort.value) {
    case 'popular':
      sortedComics.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case 'name':
      sortedComics.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'views':
      sortedComics.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case 'rating':
      sortedComics.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      break
    case 'latest':
    default:
      // Keep original order (latest first)
      break
  }

  comics.value = sortedComics
}

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page
  router.push({
    name: 'category-detail',
    params: { slug: route.params.slug },
    query: { page }
  })
}

// Handle sort change
const handleSortChange = () => {
  applySorting()
}

// Helper functions
const getCategoryIcon = (name) => {
  const icons = {
    'Action': '⚔️',
    'Romance': '💕',
    'Comedy': '😄',
    'Drama': '🎭',
    'Fantasy': '🌟',
    'Horror': '👻',
    'Mystery': '🔍',
    'Sci-Fi': '🚀',
    'Slice of Life': '🌸',
    'Sports': '⚽',
    'Supernatural': '👺',
    'Thriller': '😱',
    'Adventure': '🗺️',
    'Historical': '📜',
    'Martial Arts': '🥋',
    'School': '🏫',
    'Shounen': '👦',
    'Shoujo': '👧',
    'Seinen': '👨',
    'Josei': '👩'
  }

  for (const [key, icon] of Object.entries(icons)) {
    if (name.toLowerCase().includes(key.toLowerCase())) {
      return icon
    }
  }

  return '📚'
}

const getCategoryDescription = (name) => {
  const descriptions = {
    'Action': 'Những câu chuyện hành động, chiến đấu kịch tính',
    'Romance': 'Tình yêu, lãng mạn và những mối quan hệ cảm động',
    'Comedy': 'Hài hước, vui nhộn và những tình huống dở khóc dở cười',
    'Drama': 'Kịch tính, cảm xúc sâu lắng và những bi kịch',
    'Fantasy': 'Thế giới thần tiên, phép thuật và những cuộc phiêu lưu kỳ ảo',
    'Horror': 'Rùng rợn, kinh dị và những câu chuyện ma quái',
    'Mystery': 'Bí ẩn, điều tra và những vụ án khó giải',
    'Sci-Fi': 'Khoa học viễn tưởng, công nghệ tương lai',
    'Slice of Life': 'Cuộc sống đời thường, những câu chuyện gần gũi',
    'Sports': 'Thể thao, thi đấu và tinh thần đồng đội',
    'Supernatural': 'Siêu nhiên, những sức mạnh bí ẩn',
    'Thriller': 'Gây cấn, hồi hộp và những pha nguy hiểm',
    'Adventure': 'Phiêu lưu, khám phá những vùng đất mới',
    'Historical': 'Lịch sử, những câu chuyện quá khứ',
    'Martial Arts': 'Võ thuật, những trận đấu đỉnh cao',
    'School': 'Trường học, cuộc sống học đường',
    'Shounen': 'Dành cho thiếu niên, những câu chuyện tuổi mới lớn',
    'Shoujo': 'Dành cho thiếu nữ, tình yêu và tình bạn',
    'Seinen': 'Dành cho người trưởng thành, nội dung sâu sắc',
    'Josei': 'Dành cho phụ nữ trưởng thành, tâm lý phức tạp'
  }

  return descriptions[name] || 'Khám phá thế giới của thể loại này'
}

const getTrendClass = (trend) => {
  return {
    'trend-hot': trend === 'hot',
    'trend-rising': trend === 'rising',
    'trend-stable': trend === 'stable'
  }
}

const getTrendText = (trend) => {
  const texts = {
    'hot': '🔥 Hot',
    'rising': '📈 Rising',
    'stable': '➡️ Stable'
  }
  return texts[trend] || ''
}

const getStatusClass = (status) => {
  return {
    'status-ongoing': status === 'ongoing',
    'status-completed': status === 'completed'
  }
}

const getStatusText = (status) => {
  return status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành'
}

const formatViews = (views) => {
  if (!views) return '0'
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K`
  return `${views}`
}

const formatDate = (dateString) => {
  if (!dateString) return ''

  const date = new Date(dateString)
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Hôm nay'
  if (diffDays === 1) return 'Hôm qua'
  if (diffDays <= 7) return `${diffDays} ngày trước`
  if (diffDays <= 30) return `${Math.floor(diffDays / 7)} tuần trước`
  if (diffDays <= 365) return `${Math.floor(diffDays / 30)} tháng trước`
  return `${Math.floor(diffDays / 365)} năm trước`
}

// Watch for route changes
watch(() => route.params.slug, () => {
  currentPage.value = 1
  loadCategoryData()
}, { immediate: true })

watch(() => route.query.page, (newPage) => {
  currentPage.value = parseInt(newPage) || 1
  loadCategoryData()
})

onMounted(() => {
  currentPage.value = parseInt(route.query.page) || 1
})
</script>

<style scoped>
.category-detail-view {
  padding: 2rem 0;
}

/* Category Header */
.category-header {
  margin-bottom: 2rem;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
  padding: 2rem;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
}

.category-icon {
  width: 80px;
  height: 80px;
  background-color: var(--accent-color);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  flex-shrink: 0;
}

.category-details {
  flex: 1;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.category-description {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
  line-height: 1.6;
}

.category-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.stat-item {
  color: var(--text-main);
  font-size: 1rem;
}

.stat-item strong {
  color: var(--accent-color);
  font-weight: 700;
}

.category-trend {
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
}

.trend-hot {
  background-color: #ef4444;
  color: white;
}

.trend-rising {
  background-color: #10b981;
  color: white;
}

.trend-stable {
  background-color: var(--bg-hover);
  color: var(--text-muted);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
}

.breadcrumb a {
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.breadcrumb a:hover {
  color: var(--accent-color);
}

.separator {
  color: var(--border-color);
}

.current {
  color: var(--text-main);
  font-weight: 500;
}

/* Controls */
.list-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.control-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-options {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: transparent;
  padding: 0;
  border: none;
}

.sort-options label {
  font-weight: 500;
  color: var(--text-muted);
  white-space: nowrap;
  font-size: 0.9rem;
}

.sort-options select {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  padding: 0.5rem 2rem 0.5rem 0.75rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  appearance: none;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
  background-position: right 0.5rem center;
  background-repeat: no-repeat;
  background-size: 1.5em 1.5em;
  min-width: 140px;
}

.sort-options select:hover {
  border-color: var(--accent-color);
}

.view-options {
  display: flex;
  gap: 0.5rem;
  background-color: var(--bg-secondary);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--border-color);
}

.view-btn {
  padding: 0.5rem;
  background: transparent;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-btn:hover {
  color: var(--text-main);
}

.view-btn.active {
  background-color: var(--accent-color);
  color: white;
}

/* Comics Section */
.comics-section {
  margin-bottom: 3rem;
  min-height: 400px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--text-muted);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--accent-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  font-size: 1.5rem;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-muted);
  font-size: 1rem;
}

/* List View */
.list-comics {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.list-item {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.list-item:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.list-item-content {
  display: flex;
  text-decoration: none;
  color: inherit;
}

.list-item-thumbnail {
  position: relative;
  width: 120px;
  height: 160px;
  flex-shrink: 0;
  overflow: hidden;
}

.list-item-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.list-item-status {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.status-ongoing {
  background-color: var(--accent-color);
  color: white;
}

.status-completed {
  background-color: #10b981;
  color: white;
}

.list-item-info {
  flex: 1;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.list-item-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.list-item-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 1rem 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-item-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  color: var(--text-muted);
}

.meta-item svg {
  flex-shrink: 0;
}

/* Related Categories */
.related-categories {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.related-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.related-tag {
  display: inline-block;
  padding: 0.5rem 1rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.related-tag:hover {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

/* Skeleton List Items */
.skeleton-list-item {
  display: flex;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
}

.skeleton-list-item .skeleton-thumbnail {
  width: 120px;
  height: 160px;
  background: linear-gradient(90deg,
      var(--bg-secondary) 0%,
      var(--bg-primary) 50%,
      var(--bg-secondary) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
  flex-shrink: 0;
}

.skeleton-list-item .skeleton-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-list-item .skeleton-line {
  background: linear-gradient(90deg,
      var(--bg-secondary) 0%,
      var(--bg-primary) 50%,
      var(--bg-secondary) 100%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  height: 1.2em;
}

.skeleton-list-item .skeleton-line.title {
  width: 80%;
  height: 1.5em;
}

.skeleton-list-item .skeleton-line.description {
  width: 100%;
  height: 1em;
}

.skeleton-list-item .skeleton-meta {
  display: flex;
  gap: 1rem;
}

.skeleton-list-item .skeleton-line.meta {
  width: 60px;
  height: 1em;
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
  .category-detail-view {
    padding: 1rem 0;
  }

  .category-info {
    flex-direction: column;
    text-align: center;
    padding: 1.5rem;
    gap: 1rem;
  }

  .category-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }

  .category-title {
    font-size: 1.5rem;
  }

  .category-description {
    font-size: 1rem;
  }

  .category-stats {
    justify-content: center;
    gap: 1rem;
  }

  .list-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .control-group {
    justify-content: space-between;
  }

  .list-item-content {
    flex-direction: column;
  }

  .list-item-thumbnail {
    width: 100%;
    height: 200px;
  }

  .list-item-info {
    padding: 1rem;
  }

  .related-categories {
    padding: 1.5rem;
  }

  .related-tags {
    gap: 0.5rem;
  }

  .related-tag {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .category-title {
    font-size: 1.25rem;
  }

  .category-stats {
    flex-direction: column;
    gap: 0.5rem;
  }

  .sort-options {
    padding: 0.5rem 0.75rem;
    gap: 0.5rem;
  }

  .sort-options label {
    font-size: 0.9rem;
  }

  .sort-options select {
    font-size: 0.85rem;
    padding: 0.4rem;
  }

  .list-item-meta {
    gap: 0.75rem;
  }

  .meta-item {
    font-size: 0.8rem;
  }
}
</style>
