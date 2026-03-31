<template>
  <div class="pagination">
    <button 
      class="pagination-btn" 
      :disabled="currentPage === 1"
      @click="$emit('page-change', currentPage - 1)"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="15 18 9 12 15 6"></polyline>
      </svg>
      Trang trước
    </button>

    <div class="pagination-pages">
      <button 
        v-for="page in visiblePages" 
        :key="page"
        class="pagination-page"
        :class="{ active: page === currentPage, ellipsis: page === '...' }"
        :disabled="page === '...'"
        @click="page !== '...' && $emit('page-change', page)"
      >
        {{ page }}
      </button>
    </div>

    <button 
      class="pagination-btn" 
      :disabled="currentPage === totalPages"
      @click="$emit('page-change', currentPage + 1)"
    >
      Trang sau
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  currentPage: {
    type: Number,
    required: true,
    default: 1
  },
  totalPages: {
    type: Number,
    required: true,
    default: 1
  },
  visibleRange: {
    type: Number,
    default: 5
  }
})

defineEmits(['page-change'])

const visiblePages = computed(() => {
  const { currentPage, totalPages, visibleRange } = props
  const pages = []
  
  if (totalPages <= visibleRange) {
    // Show all pages if total pages is less than or equal to visible range
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Show pages with ellipsis
    const halfRange = Math.floor(visibleRange / 2)
    let startPage = Math.max(1, currentPage - halfRange)
    let endPage = Math.min(totalPages, startPage + visibleRange - 1)
    
    // Adjust start page if we're near the end
    if (endPage - startPage < visibleRange - 1) {
      startPage = Math.max(1, endPage - visibleRange + 1)
    }
    
    // Add first page
    if (startPage > 1) {
      pages.push(1)
      if (startPage > 2) {
        pages.push('...')
      }
    }
    
    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    
    // Add last page
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push('...')
      }
      pages.push(totalPages)
    }
  }
  
  return pages
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin: 2rem 0;
  flex-wrap: wrap;
}

.pagination-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-btn:hover:not(:disabled) {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-pages {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.pagination-page {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pagination-page:hover:not(:disabled):not(.ellipsis) {
  background-color: var(--accent-light);
  border-color: var(--accent-color);
  color: var(--accent-color);
}

.pagination-page.active {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
}

.pagination-page.ellipsis {
  cursor: default;
  border: none;
  background: transparent;
  color: var(--text-muted);
}

.pagination-page:disabled {
  cursor: not-allowed;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .pagination {
    gap: 0.25rem;
  }
  
  .pagination-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.85rem;
  }
  
  .pagination-page {
    width: 36px;
    height: 36px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .pagination-btn {
    padding: 0.5rem;
    font-size: 0.8rem;
  }
  
  .pagination-btn svg {
    width: 14px;
    height: 14px;
  }
  
  .pagination-page {
    width: 32px;
    height: 32px;
    font-size: 0.8rem;
  }
}
</style>
