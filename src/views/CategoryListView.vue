<template>
  <div class="category-list-view">
    <div class="container">
      <!-- Header -->
      <div class="category-header">
        <h1 class="page-title">Tất Cả Thể Loại</h1>
        <p class="page-description">Khám phá truyện tranh theo từng thể loại bạn yêu thích</p>
      </div>

      <!-- Search Categories -->
      <div class="category-search">
        <div class="search-input-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input v-model="searchQuery" type="text" placeholder="Tìm kiếm thể loại..." class="search-input" />
        </div>
      </div>

      <!-- Categories Grid -->
      <div class="categories-section">
        <!-- Skeleton Loading -->
        <div v-if="loading" class="categories-grid">
          <SkeletonCard v-for="i in 12" :key="i" />
        </div>
        <!-- Actual Content -->
        <div v-else class="categories-grid">
          <router-link v-for="category in filteredCategories" :key="category.slug" :to="`/category/${category.slug}`"
            class="category-card">
            <div class="category-icon">
              <span>{{ getCategoryIcon(category.name) }}</span>
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.count || 0 }} truyện</p>
            <span class="tag-count">{{ category.count || 0 }}</span>
          </router-link>
        </div>
      </div>
    </div>

    <!-- Popular Categories -->
    <div class="popular-categories">
      <h2 class="section-title">Thể Loại Phổ Biến</h2>
      <div class="popular-tags">
        <router-link v-for="category in popularCategories" :key="category.slug" :to="`/category/${category.slug}`"
          class="popular-tag">
          {{ category.name }}
          <span class="tag-count">{{ category.count || 0 }}</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import { getCategories } from '@/api/otruyen'

const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')

// Load categories
const loadCategories = async () => {
  loading.value = true
  try {
    const response = await getCategories()
    categories.value = response.items || []
  } catch (error) {
    console.error('Error loading categories:', error)
    categories.value = []
  } finally {
    loading.value = false
  }
}

// Filter categories based on search
const filteredCategories = computed(() => {
  if (!searchQuery.value.trim()) {
    return categories.value
  }

  const query = searchQuery.value.toLowerCase()
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(query) ||
    (category.description && category.description.toLowerCase().includes(query))
  )
})

// Popular categories (top 10 by count)
const popularCategories = computed(() => {
  return [...categories.value]
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, 10)
})

// Get category icon based on name
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

// Get category description
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

// Get trend class
const getTrendClass = (trend) => {
  return {
    'trend-hot': trend === 'hot',
    'trend-rising': trend === 'rising',
    'trend-stable': trend === 'stable'
  }
}

// Get trend text
const getTrendText = (trend) => {
  const texts = {
    'hot': '🔥 Hot',
    'rising': '📈 Rising',
    'stable': '➡️ Stable'
  }
  return texts[trend] || ''
}

onMounted(() => {
  loadCategories()
})
</script>

<style scoped>
.category-list-view {
  padding: 2rem 0;
}

.category-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 0.5rem;
}

.page-description {
  font-size: 1.1rem;
  color: var(--text-muted);
  margin-bottom: 0;
}

.category-search {
  margin-bottom: 3rem;
}

.search-input-container {
  position: relative;
  max-width: 500px;
  margin: 0 auto;
}

.search-input-container svg {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
}

.search-input {
  width: 100%;
  padding: 1rem 1rem 1rem 3rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  color: var(--text-main);
  font-size: 1rem;
  transition: all var(--transition-fast);
}

.search-input:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: var(--shadow-glow);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.categories-section {
  margin-bottom: 4rem;
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

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.category-card {
  display: flex;
  align-items: center;
  padding: 1.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  transition: all var(--transition-fast);
  text-decoration: none;
  color: inherit;
}

.category-card:hover {
  border-color: var(--accent-color);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.category-icon {
  width: 60px;
  height: 60px;
  background-color: var(--accent-color);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  font-size: 1.5rem;
  flex-shrink: 0;
}

.category-info {
  flex: 1;
  min-width: 0;
}

.category-info h3 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
}

.category-description {
  font-size: 0.9rem;
  color: var(--text-muted);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
}

.category-stats {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.category-count {
  font-size: 0.85rem;
  color: var(--text-muted);
}

.category-trend {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
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

.popular-categories {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.popular-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.popular-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
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

.popular-tag:hover {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.tag-count {
  background-color: rgba(255, 255, 255, 0.2);
  padding: 0.125rem 0.375rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .category-list-view {
    padding: 1rem 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .categories-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .category-card {
    padding: 1rem;
  }

  .category-icon {
    width: 50px;
    height: 50px;
    font-size: 1.25rem;
  }

  .category-info h3 {
    font-size: 1rem;
  }

  .category-description {
    font-size: 0.85rem;
  }

  .popular-categories {
    padding: 1.5rem;
  }

  .popular-tags {
    gap: 0.5rem;
  }

  .popular-tag {
    padding: 0.4rem 0.75rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
  }

  .category-card {
    padding: 0.75rem;
  }

  .category-icon {
    width: 45px;
    height: 45px;
    font-size: 1.1rem;
    margin-right: 0.75rem;
  }

  .category-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
}
</style>
