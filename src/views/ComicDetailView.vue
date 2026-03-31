<template>
  <div class="comic-detail-view">
    <div class="container">
      <!-- Breadcrumb -->
      <div class="breadcrumb">
        <router-link to="/">Trang chủ</router-link>
        <span class="separator">/</span>
        <router-link v-for="category in comic.categories" :key="category.slug" :to="`/category/${category.slug}`">
          {{ category.name }}
        </router-link>
        <span class="separator">/</span>
        <span class="current">{{ comic.name }}</span>
      </div>

      <!-- Comic Header -->
      <div class="comic-header" v-if="!loading">
        <div class="comic-main-info">
          <div class="comic-thumbnail">
            <img :src="comic.thumbnail" :alt="comic.name" />
            <div class="comic-status" :class="getStatusClass(comic.status)">
              {{ getStatusText(comic.status) }}
            </div>
          </div>

          <div class="comic-info">
            <h1 class="comic-title">{{ comic.name }}</h1>
            <div class="comic-meta">
              <span class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                  <circle cx="12" cy="12" r="3"></circle>
                </svg>
                {{ formatViews(comic.views) }} lượt xem
              </span>
              <span class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon
                    points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2">
                  </polygon>
                </svg>
                {{ comic.rating || 4.5 }}/5.0
              </span>
              <span class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="4 17 10 11 4 5"></polyline>
                  <line x1="12" y1="19" x2="20" y2="19"></line>
                </svg>
                Chapter {{ comic.latestChapter }}
              </span>
              <span class="meta-item">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                Cập nhật: {{ formatDate(comic.updatedAt) }}
              </span>
            </div>

            <div class="comic-categories">
              <router-link v-for="category in comic.categories" :key="category.slug" :to="`/category/${category.slug}`"
                class="category-tag">
                {{ category.name }}
              </router-link>
            </div>

            <div class="comic-actions">
              <button class="btn btn-primary" @click="startReading">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
                Đọc ngay
              </button>
              <button class="btn btn-outline" @click="toggleFavorite">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path
                    d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z">
                  </path>
                </svg>
                {{ isFavorite ? 'Đã thích' : 'Thích' }}
              </button>
              <button class="btn btn-outline" @click="shareComic">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="18" cy="5" r="3"></circle>
                  <circle cx="6" cy="12" r="3"></circle>
                  <circle cx="18" cy="19" r="3"></circle>
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                </svg>
                Chia sẻ
              </button>
            </div>
          </div>
        </div>

        <div class="comic-description">
          <h2 class="section-title">Nội dung</h2>
          <div class="description-content">
            <p v-if="showFullDescription || !comic.description || comic.description.length <= 300">
              {{ comic.description || 'Không có mô tả cho truyện này.' }}
            </p>
            <p v-else>
              {{ comic.description.substring(0, 300) }}...
            </p>
            <button v-if="comic.description && comic.description.length > 300" class="read-more-btn"
              @click="showFullDescription = !showFullDescription">
              {{ showFullDescription ? 'Thu gọn' : 'Đọc thêm' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading">
        <SkeletonDetail />
      </div>

      <!-- Chapters Section -->
      <div class="chapters-section" v-if="!loading">
        <div class="chapters-header">
          <h2 class="section-title">Danh sách chương</h2>
          <button v-if="(chapters?.length || 0) > chaptersPerPage" class="btn btn-outline show-all-btn"
            @click="toggleShowAllChapters">
            {{ showAllChapters ? 'Thu gọn' : 'Xem tất cả' }}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline v-if="!showAllChapters" points="6 9 12 15 18 9"></polyline>
              <polyline v-else points="6 15 12 9 18 15"></polyline>
            </svg>
          </button>
        </div>

        <div class="chapters-list">
          <div v-if="displayChapters.length === 0" class="empty-chapters">
            <p>Không tìm thấy chương nào.</p>
          </div>

          <div v-for="chapter in displayChapters" :key="chapter.id" class="chapter-item">
            <router-link :to="`/comic/${comic.slug}/chapter/${chapter.id}`" class="chapter-link">
              <div class="chapter-info">
                <h3 class="chapter-title">{{ chapter.title }}</h3>
                <span class="chapter-date">{{ formatDate(chapter.updatedAt) }}</span>
              </div>
              <div class="chapter-meta">
                <span class="chapter-views">{{ formatViews(chapter.views) }}</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <!-- Related Comics -->
      <div class="related-comics" v-if="!loading && relatedComics.length > 0">
        <h2 class="section-title">Truyện liên quan</h2>
        <div class="grid-comics">
          <ComicCard v-for="relatedComic in relatedComics" :key="relatedComic.slug" :comic="relatedComic" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComicCard from '@/components/common/ComicCard.vue'
import SkeletonDetail from '@/components/common/SkeletonDetail.vue'
import { getComicDetail, getHome } from '@/api/otruyen'

const route = useRoute()
const router = useRouter()

const comic = ref({})
const chapters = ref([])
const relatedComics = ref([])
const loading = ref(true)
const showFullDescription = ref(false)
const isFavorite = ref(false)
const showAllChapters = ref(false)
const chaptersPerPage = 10 // Hiển thị 10 chương mặc định

// Load comic data
const loadComicData = async () => {
  loading.value = true
  try {
    const response = await getComicDetail(route.params.slug)
    comic.value = response.item || {}
    chapters.value = response.item?.chapters || []

    // Load related comics
    const homeData = await getHome()
    relatedComics.value = homeData.items
      ?.filter(item => item.slug !== route.params.slug)
      ?.slice(0, 6) || []

    // Generate mock chapters if none provided
    if (chapters.value.length === 0) {
      generateMockChapters()
    }
  } catch (error) {
    console.error('Error loading comic data:', error)
    // Set default values
    comic.value = {
      name: route.params.slug,
      thumbnail: 'https://via.placeholder.com/300x400/1e293b/64748b?text=Comic+Cover',
      description: 'Đây là một truyện tranh hấp dẫn với nhiều tình tiết kịch tính.',
      status: 'ongoing',
      views: Math.floor(Math.random() * 100000),
      rating: 4.5,
      latestChapter: 50,
      updatedAt: new Date().toISOString(),
      categories: [
        { name: 'Action', slug: 'action' },
        { name: 'Adventure', slug: 'adventure' }
      ]
    }
    generateMockChapters()
  } finally {
    loading.value = false
  }
}

// Generate mock chapters
const generateMockChapters = () => {
  const mockChapters = []
  for (let i = 50; i >= 1; i--) {
    mockChapters.push({
      id: i,
      title: `Chapter ${i}: ${getChapterTitle(i)}`,
      views: Math.floor(Math.random() * 10000),
      updatedAt: new Date(Date.now() - (50 - i) * 24 * 60 * 60 * 1000).toISOString()
    })
  }
  chapters.value = mockChapters
}

// Get chapter title based on number
const getChapterTitle = (num) => {
  const titles = [
    'Sự khởi đầu',
    'Cuộc gặp gỡ định mệnh',
    'Bí mật được hé lộ',
    'Trận chiến đầu tiên',
    'Sự hy sinh anh dũng',
    'Kẻ thù quay trở lại',
    'Sức mạnh mới',
    'Phép thuật cổ xưa',
    'Người bảo vệ',
    'Lời tiên tri',
    'Cánh cổng thời gian',
    'Thế giới song song',
    'Cuộc đối đầu cuối cùng',
    'Sự thật đau đớn',
    'Hy vọng mới'
  ]
  return titles[num % titles.length] || `Tiếp nối câu chuyện`
}

// Computed property for displaying chapters
const displayChapters = computed(() => {
  if (!chapters.value || !Array.isArray(chapters.value)) {
    return []
  }
  if (showAllChapters.value) {
    return chapters.value
  }
  return chapters.value.slice(0, chaptersPerPage)
})

// Toggle show all chapters
const toggleShowAllChapters = () => {
  showAllChapters.value = !showAllChapters.value
}

// Helper functions
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

// Action handlers
const startReading = () => {
  const firstChapter = chapters.value[0]
  if (firstChapter) {
    router.push(`/comic/${comic.value.slug}/chapter/${firstChapter.id}`)
  }
}

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value
  // Here you would typically save to localStorage or API
}

const shareComic = () => {
  if (navigator.share) {
    navigator.share({
      title: comic.value.name,
      text: comic.value.description,
      url: window.location.href
    })
  } else {
    // Fallback: copy to clipboard
    navigator.clipboard.writeText(window.location.href)
    alert('Đã sao chép liên kết truyện!')
  }
}

// Watch for search changes
const handleSearchChange = () => {
  currentChapterPage.value = 1
}

onMounted(() => {
  loadComicData()
})
</script>

<style scoped>
.comic-detail-view {
  padding: 2rem 0;
}

/* Breadcrumb */
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-bottom: 2rem;
  flex-wrap: wrap;
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

/* Comic Header */
.comic-header {
  margin-bottom: 3rem;
}

.comic-main-info {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
}

.comic-thumbnail {
  position: relative;
  width: 250px;
  height: 350px;
  flex-shrink: 0;
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
}

.comic-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.comic-status {
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-ongoing {
  background-color: var(--accent-color);
  color: white;
}

.status-completed {
  background-color: #10b981;
  color: white;
}

.comic-info {
  flex: 1;
  min-width: 0;
}

.comic-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.comic-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.meta-item svg {
  flex-shrink: 0;
}

.comic-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.category-tag {
  padding: 0.5rem 1rem;
  background-color: var(--accent-light);
  color: var(--accent-color);
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.category-tag:hover {
  background-color: var(--accent-color);
  color: white;
}

.comic-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.comic-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.comic-description {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.description-content {
  line-height: 1.8;
  color: var(--text-main);
}

.description-content p {
  margin-bottom: 1rem;
}

.read-more-btn {
  background: none;
  border: none;
  color: var(--accent-color);
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  font-size: inherit;
}

.read-more-btn:hover {
  text-decoration: underline;
}

/* Loading State */
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

/* Chapters Section */
.chapters-section {
  margin-bottom: 1rem;
}

.chapters-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.show-all-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.show-all-btn svg {
  transition: transform var(--transition-fast);
}

.show-all-btn:hover svg {
  transform: scale(1.1);
}

.chapters-list {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  overflow: hidden;
}

.empty-chapters {
  padding: 3rem;
  text-align: center;
  color: var(--text-muted);
}

.chapter-item {
  border-bottom: 1px solid var(--border-color);
  transition: background-color var(--transition-fast);
}

.chapter-item:last-child {
  border-bottom: none;
}

.chapter-item:hover {
  background-color: var(--bg-hover);
}

.chapter-link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  text-decoration: none;
  color: inherit;
}

.chapter-info {
  flex: 1;
}

.chapter-title {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-main);
  margin: 0 0 0.25rem 0;
}

.chapter-date {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.chapter-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* Related Comics */
.related-comics {
  margin-bottom: 2rem;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .comic-detail-view {
    padding: 1rem 0;
  }

  .comic-main-info {
    flex-direction: column;
    gap: 1.5rem;
  }

  .comic-thumbnail {
    width: 200px;
    height: 280px;
    margin: 0 auto;
  }

  .comic-title {
    font-size: 1.75rem;
  }

  .comic-meta {
    gap: 1rem;
  }

  .comic-actions {
    justify-content: center;
  }

  .comic-description {
    padding: 1.5rem;
  }

  .chapters-header {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }

  .chapter-link {
    padding: 0.75rem 1rem;
  }

  .chapter-title {
    font-size: 0.95rem;
  }
}

@media (max-width: 480px) {
  .comic-title {
    font-size: 1.5rem;
  }

  .comic-thumbnail {
    width: 180px;
    height: 250px;
  }

  .comic-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .comic-actions {
    flex-direction: column;
  }

  .comic-actions .btn {
    justify-content: center;
  }
}
</style>
