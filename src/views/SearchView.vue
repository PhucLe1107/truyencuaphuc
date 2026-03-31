<template>
  <div class="search-view">
    <div class="container">
      <!-- Search Header -->
      <div class="search-header">
        <h1 class="page-title">Kết quả tìm kiếm</h1>
        <div class="search-query">
          <span class="query-text">"{{ currentQuery }}"</span>
          <span class="result-count">{{ totalResults }} kết quả</span>
        </div>

        <!-- Search Form -->
        <div class="search-form-container">
          <form @submit.prevent="handleSearch" class="search-form">
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm truyện, tác giả..." class="search-input"
              ref="searchInput" />
            <button type="submit" class="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
              Tìm kiếm
            </button>
          </form>
        </div>
      </div>

      <!-- Filters and Controls -->
      <div class="search-controls" v-if="!loading && totalResults > 0">
        <div class="control-group">
          <div class="sort-options">
            <label for="sort-select">Sắp xếp:</label>
            <select id="sort-select" v-model="currentSort" @change="handleSortChange">
              <option value="relevance">Liên quan nhất</option>
              <option value="latest">Mới cập nhật</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="name">Theo tên A-Z</option>
              <option value="views">Lượt xem</option>
            </select>
          </div>

          <div class="filter-options">
            <button class="filter-btn" :class="{ active: showFilters }" @click="showFilters = !showFilters">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
              </svg>
              Bộ lọc
            </button>
          </div>
        </div>

        <!-- Advanced Filters -->
        <div class="advanced-filters" v-if="showFilters">
          <div class="filter-row">
            <div class="filter-group">
              <label>Trạng thái:</label>
              <select v-model="filters.status">
                <option value="">Tất cả</option>
                <option value="ongoing">Đang tiến hành</option>
                <option value="completed">Hoàn thành</option>
              </select>
            </div>

            <div class="filter-group">
              <label>Thể loại:</label>
              <select v-model="filters.category">
                <option value="">Tất cả</option>
                <option v-for="category in categories" :key="category.slug" :value="category.slug">
                  {{ category.name }}
                </option>
              </select>
            </div>

            <div class="filter-group">
              <label>Năm phát hành:</label>
              <select v-model="filters.year">
                <option value="">Tất cả</option>
                <option v-for="year in availableYears" :key="year" :value="year">
                  {{ year }}
                </option>
              </select>
            </div>
          </div>

          <div class="filter-actions">
            <button class="btn btn-outline" @click="clearFilters">Xóa bộ lọc</button>
            <button class="btn btn-primary" @click="applyFilters">Áp dụng</button>
          </div>
        </div>
      </div>

      <!-- Search Results -->
      <div class="search-results">
        <!-- Skeleton Loading -->
        <div v-if="loading" class="grid-comics">
          <SkeletonCard v-for="i in 12" :key="i" />
        </div>

        <!-- Actual Content -->
        <div v-else-if="searchResults.length > 0" class="grid-comics">
          <ComicCard v-for="comic in searchResults" :key="comic.slug" :comic="comic" />
        </div>

        <!-- No Results -->
        <div v-else-if="currentQuery" class="empty-state">
          <h3>Không tìm thấy kết quả nào</h3>
          <p>Không tìm thấy truyện nào phù hợp với "{{ currentQuery }}"</p>
        </div>

        <!-- Initial State -->
        <div v-else class="empty-state">
          <h3>Nhập từ khóa để tìm kiếm</h3>
          <p>Tìm kiếm truyện theo tên, tác giả hoặc thể loại</p>
        </div>
      </div>

      <!-- Recent Searches -->
      <div class="recent-searches" v-if="recentSearches.length > 0 && totalResults === 0">
        <h3>Tìm kiếm gần đây</h3>
        <div class="recent-tags">
          <button v-for="search in recentSearches" :key="search" class="recent-tag"
            @click="searchQuery = search; handleSearch()">
            {{ search }}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
        @page-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ComicCard from '@/components/common/ComicCard.vue'
import SkeletonCard from '@/components/common/SkeletonCard.vue'
import Pagination from '@/components/common/Pagination.vue'
import { searchComics, getCategories } from '@/api/otruyen'

const route = useRoute()
const router = useRouter()

const searchResults = ref([])
const categories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const currentQuery = ref('')
const currentPage = ref(1)
const totalPages = ref(1)
const currentSort = ref('relevance')
const viewMode = ref('grid')
const showFilters = ref(false)

// Filters
const filters = ref({
  status: '',
  category: '',
  year: ''
})

// Recent searches
const recentSearches = ref([])

// Total results
const totalResults = computed(() => searchResults.value.length)

// Available years for filter
const availableYears = computed(() => {
  const currentYear = new Date().getFullYear()
  const years = []
  for (let year = currentYear; year >= currentYear - 20; year--) {
    years.push(year)
  }
  return years
})

// Load search results
const loadSearchResults = async () => {
  loading.value = true
  try {
    if (!currentQuery.value.trim()) {
      searchResults.value = []
      loading.value = false
      return
    }

    const response = await searchComics(currentQuery.value, currentPage.value)
    searchResults.value = response.items || []
    totalPages.value = response.pagination?.totalPages || 1

    // Apply sorting
    applySorting()

    // Add to recent searches
    addToRecentSearches(currentQuery.value)
  } catch (error) {
    console.error('Error searching comics:', error)
    searchResults.value = []
  } finally {
    loading.value = false
  }
}

// Load categories for filters
const loadCategories = async () => {
  try {
    const response = await getCategories()
    categories.value = response.items || []
  } catch (error) {
    console.error('Error loading categories:', error)
    categories.value = []
  }
}

// Apply sorting
const applySorting = () => {
  const sortedResults = [...searchResults.value]

  switch (currentSort.value) {
    case 'latest':
      sortedResults.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
      break
    case 'popular':
      sortedResults.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case 'name':
      sortedResults.sort((a, b) => a.name.localeCompare(b.name))
      break
    case 'views':
      sortedResults.sort((a, b) => (b.views || 0) - (a.views || 0))
      break
    case 'relevance':
    default:
      // Keep original order (most relevant first)
      break
  }

  searchResults.value = sortedResults
}

// Handle search
const handleSearch = () => {
  if (searchQuery.value.trim()) {
    currentQuery.value = searchQuery.value.trim()
    currentPage.value = 1
    router.push({
      name: 'search',
      query: { keyword: currentQuery.value, page: currentPage.value }
    })
  }
}

// Handle page change
const handlePageChange = (page) => {
  currentPage.value = page
  router.push({
    name: 'search',
    query: { keyword: currentQuery.value, page }
  })
}

// Handle sort change
const handleSortChange = () => {
  applySorting()
}

// Apply filters
const applyFilters = () => {
  // Here you would typically make an API call with filters
  // For now, just apply client-side filtering
  let filtered = [...searchResults.value]

  if (filters.value.status) {
    filtered = filtered.filter(comic => comic.status === filters.value.status)
  }

  if (filters.value.category) {
    filtered = filtered.filter(comic =>
      comic.categories?.some(cat => cat.slug === filters.value.category)
    )
  }

  if (filters.value.year) {
    filtered = filtered.filter(comic => {
      const comicYear = new Date(comic.createdAt || comic.updatedAt).getFullYear()
      return comicYear === parseInt(filters.value.year)
    })
  }

  searchResults.value = filtered
  showFilters.value = false
}

// Clear filters
const clearFilters = () => {
  filters.value = {
    status: '',
    category: '',
    year: ''
  }
  loadSearchResults()
}

// Highlight matching text
const highlightMatch = (text) => {
  if (!currentQuery.value.trim()) return text

  const regex = new RegExp(`(${currentQuery.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

// Add to recent searches
const addToRecentSearches = (query) => {
  const searches = [...recentSearches.value]
  const index = searches.indexOf(query)

  if (index > -1) {
    searches.splice(index, 1)
  }

  searches.unshift(query)
  recentSearches.value = searches.slice(0, 10)

  // Save to localStorage
  localStorage.setItem('recentSearches', JSON.stringify(recentSearches.value))
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

// Watch for route changes
watch(() => route.query.keyword, (newKeyword) => {
  if (newKeyword) {
    currentQuery.value = newKeyword
    searchQuery.value = newKeyword
    currentPage.value = parseInt(route.query.page) || 1
    loadSearchResults()
  }
}, { immediate: true })

watch(() => route.query.page, (newPage) => {
  currentPage.value = parseInt(newPage) || 1
  loadSearchResults()
})

onMounted(() => {
  // Load recent searches from localStorage
  const saved = localStorage.getItem('recentSearches')
  if (saved) {
    recentSearches.value = JSON.parse(saved)
  }

  // Set initial search query from URL
  searchQuery.value = route.query.keyword || ''
  currentQuery.value = searchQuery.value

  // Load data
  loadCategories()

  // Focus search input
  setTimeout(() => {
    const searchInput = document.querySelector('.search-input')
    if (searchInput) {
      searchInput.focus()
    }
  }, 100)
})
</script>

<style scoped>
.search-view {
  padding: 2rem 0;
}

/* Search Header */
.search-header {
  text-align: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.search-query {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.query-text {
  color: var(--accent-color);
  font-weight: 600;
  font-size: 1.1rem;
}

.result-count {
  color: var(--text-muted);
  font-size: 1rem;
}

.search-form-container {
  max-width: 600px;
  margin: 0 auto;
}

.search-form {
  display: flex;
  gap: 0.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-fast);
}

.search-form:focus-within {
  border-color: var(--accent-color);
  box-shadow: var(--shadow-glow);
}

.search-input {
  flex: 1;
  padding: 1rem 1.5rem;
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 1rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 1.5rem;
  background-color: var(--accent-color);
  border: none;
  color: white;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.search-btn:hover {
  background-color: var(--accent-hover);
}

/* Search Controls */
.search-controls {
  margin-bottom: 2rem;
}

.control-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
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

.filter-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-btn:hover,
.filter-btn.active {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

/* Advanced Filters */
.advanced-filters {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-top: 1rem;
}

.filter-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 500;
  color: var(--text-main);
  font-size: 0.9rem;
}

.filter-group select {
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-main);
  padding: 0.5rem;
  font-size: 0.9rem;
  cursor: pointer;
}

.filter-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Search Results */
.search-results {
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
  margin-bottom: 2rem;
}

.search-suggestions {
  text-align: left;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  max-width: 400px;
}

.search-suggestions h4 {
  color: var(--text-main);
  margin-bottom: 1rem;
}

.search-suggestions ul {
  list-style: none;
  padding: 0;
}

.search-suggestions li {
  color: var(--text-muted);
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.search-suggestions li::before {
  content: '•';
  position: absolute;
  left: 0;
  color: var(--accent-color);
}

/* View Controls */
.view-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}

.view-btn {
  padding: 0.5rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-sm);
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.view-btn:first-child {
  border-radius: var(--radius-sm) 0 0 var(--radius-sm);
  border-right: none;
}

.view-btn:last-child {
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
}

.view-btn:hover {
  color: var(--text-main);
}

.view-btn.active {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
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

.list-item-title :deep(mark) {
  background-color: var(--accent-light);
  color: var(--accent-color);
  padding: 0.1rem 0.2rem;
  border-radius: var(--radius-sm);
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
  margin-bottom: 1rem;
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

.list-item-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.category-tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background-color: var(--accent-light);
  color: var(--accent-color);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  transition: all var(--transition-fast);
}

.category-tag:hover {
  background-color: var(--accent-color);
  color: white;
}

/* Recent Searches */
.recent-searches {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.recent-searches h3 {
  color: var(--text-main);
  margin-bottom: 1rem;
}

.recent-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.recent-tag {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 9999px;
  color: var(--text-main);
  font-size: 0.9rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.recent-tag:hover {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.recent-tag svg {
  opacity: 0.7;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .search-view {
    padding: 1rem 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .search-form {
    flex-direction: column;
  }

  .search-btn {
    justify-content: center;
  }

  .control-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-row {
    grid-template-columns: 1fr;
  }

  .filter-actions {
    justify-content: stretch;
  }

  .filter-actions .btn {
    flex: 1;
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

  .view-controls {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .search-query {
    flex-direction: column;
    gap: 0.5rem;
  }

  .search-input {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .search-btn {
    padding: 0.75rem 1rem;
    font-size: 0.9rem;
  }

  .advanced-filters {
    padding: 1rem;
  }

  .list-item-meta {
    gap: 0.75rem;
  }

  .meta-item {
    font-size: 0.8rem;
  }
}
</style>
