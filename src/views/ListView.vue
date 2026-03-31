<template>
  <div class="list-view">
    <div class="container">
      <!-- Header -->
      <div class="list-header">
        <h1 class="page-title">{{ pageTitle }}</h1>
        <p class="page-description">{{ pageDescription }}</p>

        <!-- Sort Options -->
        <div class="list-controls">
          <div class="sort-options">
            <label for="sort-select">Sắp xếp:</label>
            <select id="sort-select" v-model="currentSort" @change="handleSortChange">
              <option value="latest">Mới cập nhật</option>
              <option value="popular">Phổ biến nhất</option>
              <option value="name">Theo tên A-Z</option>
              <option value="views">Lượt xem</option>
            </select>
          </div>
        </div>
      </div>

      <!-- Comics Grid -->
      <div class="comics-section">
        <!-- Skeleton Loading -->
        <div v-if="loading" class="grid-comics">
          <SkeletonCard v-for="i in 12" :key="i" />
        </div>

        <!-- Actual Content -->
        <div v-else-if="comics.length > 0" class="grid-comics">
          <ComicCard v-for="comic in comics" :key="comic.slug" :comic="comic" />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-state">
          <h3>Không tìm thấy truyện nào</h3>
          <p>Không có truyện nào trong danh mục này.</p>
        </div>

        <!-- Pagination -->
        <Pagination v-if="totalPages > 1" :current-page="currentPage" :total-pages="totalPages"
          @page-change="handlePageChange" />
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
import { getListByStatus } from '@/api/otruyen'

const route = useRoute()
const router = useRouter()

const comics = ref([])
const loading = ref(true)
const currentPage = ref(1)
const totalPages = ref(1)
const currentSort = ref('latest')

// Page titles based on type
const pageTitles = {
  'truyen-moi': 'Truyện Mới Cập Nhật',
  'hoan-thanh': 'Truyện Hoàn Thành',
  'sap-ra-mat': 'Truyện Sắp Ra Mắt',
  'dang-tien-hanh': 'Truyện Đang Tiến Hành'
}

const pageDescriptions = {
  'truyen-moi': 'Những truyện vừa được cập nhật chương mới nhất',
  'hoan-thanh': 'Những truyện đã có kết thúc hoàn chỉnh',
  'sap-ra-mat': 'Những truyện sắp được phát hành',
  'dang-tien-hanh': 'Những truyện đang được phát hành đều đặn'
}

const pageTitle = computed(() => {
  return pageTitles[route.params.type] || 'Danh Sách Truyện'
})

const pageDescription = computed(() => {
  return pageDescriptions[route.params.type] || 'Danh sách truyện tranh'
})

// Load comics data
const loadComics = async () => {
  loading.value = true
  try {
    const response = await getListByStatus(route.params.type, currentPage.value)
    comics.value = response.items || []
    totalPages.value = response.pagination?.totalPages || 1

    // Apply sorting
    applySorting()
  } catch (error) {
    console.error('Error loading comics:', error)
    comics.value = []
  } finally {
    loading.value = false
  }
}

// Apply sorting to comics
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
    name: 'list',
    params: { type: route.params.type },
    query: { page }
  })
}

// Handle sort change
const handleSortChange = () => {
  applySorting()
}

// Watch for route changes
watch(() => route.params.type, () => {
  currentPage.value = 1
  loadComics()
}, { immediate: true })

watch(() => route.query.page, (newPage) => {
  currentPage.value = parseInt(newPage) || 1
  loadComics()
})

onMounted(() => {
  // Set initial page from query
  currentPage.value = parseInt(route.query.page) || 1
})
</script>

<style scoped>
.list-view {
  padding: 2rem 0;
}

.list-header {
  margin-bottom: 2rem;
  text-align: center;
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
  margin-bottom: 2rem;
}

.list-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
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
  background-color: var(--bg-primary);
}

.sort-options select:focus {
  outline: none;
  border-color: var(--accent-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.comics-section {
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

/* Mobile Responsive */
@media (max-width: 768px) {
  .list-view {
    padding: 1rem 0;
  }

  .page-title {
    font-size: 1.5rem;
  }

  .page-description {
    font-size: 1rem;
  }

  .list-controls {
    justify-content: flex-start;
  }

  .sort-options {
    width: 100%;
    justify-content: space-between;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: 1.25rem;
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
}
</style>
