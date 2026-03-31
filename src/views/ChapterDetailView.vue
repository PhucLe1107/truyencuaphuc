<template>
  <div class="chapter-detail-view">
    <div class="container">
      <!-- Chapter Header -->
      <div class="chapter-header" v-if="!loading">
        <div class="chapter-info">
          <router-link :to="`/comic/${comic.slug}`" class="comic-link">
            ← {{ comic.name }}
          </router-link>
          <h1 class="chapter-title">{{ chapter.title }}</h1>
          <div class="chapter-meta">
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
              {{ formatViews(chapter.views) }} lượt xem
            </span>
            <span class="meta-item">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"></circle>
                <polyline points="12 6 12 12 16 14"></polyline>
              </svg>
              Cập nhật: {{ formatDate(chapter.updatedAt) }}
            </span>
          </div>
        </div>

        <div class="chapter-actions">
          <button class="btn btn-outline" @click="toggleFullscreen">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3">
              </path>
            </svg>
            {{ isFullscreen ? 'Thoát fullscreen' : 'Fullscreen' }}
          </button>
          <div class="chapter-navigation">
            <button class="btn btn-outline" :disabled="!previousChapter" @click="goToPreviousChapter">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              Chap trước
            </button>
            <select v-model="selectedChapter" @change="goToChapter" class="chapter-select">
              <option v-for="chap in chapters" :key="chap.id" :value="chap.id">
                {{ chap.title }}
              </option>
            </select>
            <button class="btn btn-outline" :disabled="!nextChapter" @click="goToNextChapter">
              Chap sau
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Đang tải chương...</p>
      </div>

      <!-- Chapter Content -->
      <div class="chapter-content" v-if="!loading" :class="{ fullscreen: isFullscreen }">
        <div class="reading-settings">
          <div class="setting-group">
            <label>Chất lượng ảnh:</label>
            <select v-model="imageQuality" @change="updateImageQuality">
              <option value="high">Cao</option>
              <option value="medium">Trung bình</option>
              <option value="low">Thấp</option>
            </select>
          </div>
          <div class="setting-group">
            <label>Chế độ đọc:</label>
            <select v-model="readingMode">
              <option value="vertical">Dọc</option>
              <option value="horizontal">Ngang</option>
            </select>
          </div>
        </div>

        <div class="images-container" :class="readingMode">
          <img v-for="(image, index) in chapterImages" :key="index" :src="image"
            :alt="`Chapter ${chapter.title} - Page ${index + 1}`" class="chapter-image" @load="onImageLoad"
            @error="onImageError" loading="lazy" />
        </div>

        <!-- Navigation at bottom -->
        <div class="chapter-navigation-bottom">
          <button class="btn btn-outline" :disabled="!previousChapter" @click="goToPreviousChapter">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="15 18 9 12 15 6"></polyline>
            </svg>
            Chap trước
          </button>
          <router-link :to="`/comic/${comic.slug}`" class="btn btn-primary">
            Danh sách chương
          </router-link>
          <button class="btn btn-outline" :disabled="!nextChapter" @click="goToNextChapter">
            Chap sau
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
          </button>
        </div>
      </div>

      <!-- Comments Section -->
      <div class="comments-section" v-if="!loading">
        <h2 class="section-title">Bình luận</h2>
        <div class="comment-form">
          <textarea v-model="newComment" placeholder="Viết bình luận của bạn..." class="comment-textarea"></textarea>
          <button class="btn btn-primary" @click="submitComment">
            Gửi bình luận
          </button>
        </div>
        <div class="comments-list">
          <div v-if="comments.length === 0" class="no-comments">
            <p>Chưa có bình luận nào. Hãy là người đầu tiên bình luận!</p>
          </div>
          <div v-else>
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
              <div class="comment-avatar">
                <img :src="comment.avatar" :alt="comment.username" />
              </div>
              <div class="comment-content">
                <div class="comment-header">
                  <span class="comment-username">{{ comment.username }}</span>
                  <span class="comment-time">{{ formatDate(comment.createdAt) }}</span>
                </div>
                <p class="comment-text">{{ comment.text }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getComicDetail, getChapterImages } from '@/api/otruyen'

const route = useRoute()
const router = useRouter()

const comic = ref({})
const chapter = ref({})
const chapters = ref([])
const loading = ref(true)
const isFullscreen = ref(false)
const imageQuality = ref('high')
const readingMode = ref('vertical')
const selectedChapter = ref(null)
const newComment = ref('')
const comments = ref([])

// Mock chapter images
const chapterImages = ref([])

// Previous and next chapters
const previousChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(ch => ch.id === chapter.value.id)
  return currentIndex > 0 ? chapters.value[currentIndex - 1] : null
})

const nextChapter = computed(() => {
  const currentIndex = chapters.value.findIndex(ch => ch.id === chapter.value.id)
  return currentIndex < chapters.value.length - 1 ? chapters.value[currentIndex + 1] : null
})

// Load chapter data
const loadChapterData = async () => {
  loading.value = true
  try {
    const response = await getComicDetail(route.params.slug)
    comic.value = response.item || {}
    chapters.value = response.item?.chapters || []

    // Find current chapter
    const chapterId = route.params.chapterId
    const foundChapter = chapters.value.find(ch => ch.id === chapterId)

    if (foundChapter) {
      chapter.value = foundChapter
      selectedChapter.value = chapterId

      // Load chapter images
      if (foundChapter.apiData) {
        await loadChapterImages(foundChapter.apiData)
      } else {
        generateChapterImages()
      }

      loadComments()
    } else {
      // Chapter not found, redirect to comic detail
      router.push(`/comic/${route.params.slug}`)
    }
  } catch (error) {
    console.error('Error loading chapter data:', error)
    // Set default values
    comic.value = {
      name: route.params.slug,
      slug: route.params.slug
    }
    chapter.value = {
      id: route.params.chapterId,
      title: `Chapter ${route.params.chapterId}`,
      views: Math.floor(Math.random() * 10000),
      updatedAt: new Date().toISOString()
    }
    generateChapterImages()
  } finally {
    loading.value = false
  }
}

// Load chapter images from API
const loadChapterImages = async (apiUrl) => {
  try {
    console.log('Loading chapter images from:', apiUrl)
    const images = await getChapterImages(apiUrl)
    console.log('Received images:', images)
    if (images && images.length > 0) {
      chapterImages.value = images.map(img => img.src)
      console.log('Set chapter images:', chapterImages.value)
    } else {
      console.log('No images received, using mock images')
      generateChapterImages()
    }
  } catch (error) {
    console.error('Error loading chapter images:', error)
    generateChapterImages()
  }
}

// Generate mock chapter images
const generateChapterImages = () => {
  const imageCount = Math.floor(Math.random() * 20) + 15 // 15-35 images
  const images = []

  for (let i = 1; i <= imageCount; i++) {
    const width = imageQuality.value === 'high' ? 800 : imageQuality.value === 'medium' ? 600 : 400
    const height = Math.floor(width * 1.5)
    images.push(`https://picsum.photos/${width}/${height}?random=${i + 100}`)
  }

  chapterImages.value = images
}

// Load comments (mock data)
const loadComments = () => {
  const mockComments = [
    {
      id: 1,
      username: 'Reader123',
      avatar: 'https://picsum.photos/40/40?random=3',
      text: 'Chương này hay quá! Cảm ơn tác giả.',
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 2,
      username: 'MangaFan',
      avatar: 'https://picsum.photos/40/40?random=4',
      text: 'Cốt truyện ngày càng kịch tính, mong chờ chap tiếp theo.',
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    }
  ]
  comments.value = mockComments
}

// Navigation functions
const goToPreviousChapter = () => {
  if (previousChapter.value) {
    router.push(`/comic/${comic.value.slug}/chapter/${previousChapter.value.id}`)
  }
}

const goToNextChapter = () => {
  if (nextChapter.value) {
    router.push(`/comic/${comic.value.slug}/chapter/${nextChapter.value.id}`)
  }
}

const goToChapter = () => {
  router.push(`/comic/${comic.value.slug}/chapter/${selectedChapter.value}`)
}

// Toggle fullscreen
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value

  if (isFullscreen.value) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}

// Update image quality
const updateImageQuality = () => {
  generateChapterImages()
}

// Image handlers
const onImageLoad = (event) => {
  // Image loaded successfully
}

const onImageError = (event) => {
  // Fallback image - use picsum as it's more reliable
  event.target.src = 'https://picsum.photos/600/900?random=1'
}

// Submit comment
const submitComment = () => {
  if (newComment.value.trim()) {
    const comment = {
      id: comments.value.length + 1,
      username: 'Guest',
      avatar: 'https://picsum.photos/40/40?random=2',
      text: newComment.value.trim(),
      createdAt: new Date().toISOString()
    }
    comments.value.unshift(comment)
    newComment.value = ''
  }
}

// Helper functions
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
  const diffMinutes = Math.ceil(diffTime / (1000 * 60))

  if (diffMinutes < 1) return 'Vừa xong'
  if (diffMinutes < 60) return `${diffMinutes} phút trước`

  const diffHours = Math.floor(diffMinutes / 60)
  if (diffHours < 24) return `${diffHours} giờ trước`

  const diffDays = Math.floor(diffHours / 24)
  if (diffDays < 7) return `${diffDays} ngày trước`

  return date.toLocaleDateString('vi-VN')
}

// Watch for route changes
watch(() => route.params.chapterId, () => {
  loadChapterData()
}, { immediate: true })

onMounted(() => {
  loadChapterData()

  // Handle fullscreen change
  document.addEventListener('fullscreenchange', () => {
    isFullscreen.value = !!document.fullscreenElement
  })
})
</script>

<style scoped>
.chapter-detail-view {
  padding: 2rem 0;
}

/* Chapter Header */
.chapter-header {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
}

.chapter-info {
  margin-bottom: 1.5rem;
}

.comic-link {
  color: var(--accent-color);
  text-decoration: none;
  font-weight: 500;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
  transition: all var(--transition-fast);
}

.comic-link:hover {
  color: var(--accent-hover);
}

.chapter-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1rem;
  line-height: 1.2;
}

.chapter-meta {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--text-muted);
  font-size: 0.95rem;
}

.chapter-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.chapter-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.chapter-select {
  padding: 0.5rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-size: 0.9rem;
  min-width: 200px;
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

/* Chapter Content */
.chapter-content {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin-bottom: 2rem;
  border: 1px solid var(--border-color);
  transition: all var(--transition-normal);
}

.chapter-content.fullscreen {
  margin: 0;
  border-radius: 0;
  border: none;
  padding: 1rem;
  background-color: var(--bg-primary);
}

.reading-settings {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.setting-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.setting-group label {
  font-weight: 500;
  color: var(--text-main);
  white-space: nowrap;
}

.setting-group select {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  padding: 0.25rem 0.5rem;
  font-size: 0.9rem;
}

.images-container.vertical {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.images-container.horizontal {
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  gap: 1rem;
  padding: 1rem 0;
}

.chapter-image {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
}

.images-container.horizontal .chapter-image {
  width: auto;
  height: 80vh;
  flex-shrink: 0;
}

.chapter-navigation-bottom {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

/* Comments Section */
.comments-section {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.comment-form {
  margin-bottom: 2rem;
}

.comment-textarea {
  width: 100%;
  min-height: 100px;
  padding: 1rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-family: inherit;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 1rem;
}

.comment-textarea:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: var(--shadow-glow);
}

.comment-textarea::placeholder {
  color: var(--text-muted);
}

.comments-list {
  max-height: 400px;
  overflow-y: auto;
}

.no-comments {
  text-align: center;
  padding: 2rem;
  color: var(--text-muted);
}

.comment-item {
  display: flex;
  gap: 1rem;
  padding: 1rem 0;
  border-bottom: 1px solid var(--border-color);
}

.comment-item:last-child {
  border-bottom: none;
}

.comment-avatar img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.5rem;
}

.comment-username {
  font-weight: 600;
  color: var(--text-main);
}

.comment-time {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.comment-text {
  color: var(--text-main);
  line-height: 1.5;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .chapter-detail-view {
    padding: 1rem 0;
  }

  .chapter-header {
    padding: 1.5rem;
  }

  .chapter-title {
    font-size: 1.5rem;
  }

  .chapter-meta {
    gap: 1rem;
  }

  .chapter-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .chapter-navigation {
    justify-content: center;
  }

  .chapter-select {
    min-width: 150px;
  }

  .reading-settings {
    gap: 1rem;
  }

  .chapter-content {
    padding: 1rem;
  }

  .chapter-content.fullscreen {
    padding: 0.5rem;
  }

  .images-container.horizontal .chapter-image {
    height: 60vh;
  }

  .chapter-navigation-bottom {
    flex-direction: column;
    gap: 0.75rem;
  }

  .comments-section {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .chapter-title {
    font-size: 1.25rem;
  }

  .chapter-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .chapter-navigation {
    flex-direction: column;
    width: 100%;
  }

  .chapter-select {
    width: 100%;
  }

  .reading-settings {
    flex-direction: column;
    gap: 0.75rem;
  }

  .images-container.horizontal {
    padding: 0.5rem 0;
  }

  .images-container.horizontal .chapter-image {
    height: 50vh;
  }
}
</style>
