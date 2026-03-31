<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <h1>Truyện Của Phúc</h1>
        </router-link>

        <!-- Navigation Menu -->
        <nav class="nav-menu">
          <router-link to="/" class="nav-link">Trang chủ</router-link>

          <!-- Categories Dropdown -->
          <div class="nav-dropdown" @mouseenter="showCategories = true" @mouseleave="showCategories = false">
            <router-link to="/categories" class="nav-link" @click.prevent>Thể loại</router-link>
            <div class="dropdown-menu" :class="{ 'show': showCategories && categories.length > 0 }">
              <div class="dropdown-grid">
                <router-link v-for="category in categories" :key="category.slug" :to="`/category/${category.slug}`"
                  class="category-item" @click="showCategories = false">
                  <span class="category-name">{{ category.name }}</span>
                </router-link>
              </div>
            </div>
          </div>

          <router-link to="/status/truyen-moi" class="nav-link">Truyện mới</router-link>
          <router-link to="/status/hoan-thanh" class="nav-link">Hoàn thành</router-link>
        </nav>

        <!-- Search Bar -->
        <div class="search-container">
          <form @submit.prevent="handleSearch" class="search-form">
            <input v-model="searchQuery" type="text" placeholder="Tìm kiếm truyện..." class="search-input" />
            <button type="submit" class="search-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getCategories } from '@/api/otruyen'

const router = useRouter()
const searchQuery = ref('')
const categories = ref([])
const showCategories = ref(false)

// Load categories on mount
onMounted(async () => {
  try {
    const response = await getCategories()
    categories.value = response.items || []
  } catch (error) {
    console.error('Error loading categories:', error)
  }
})

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      name: 'search',
      query: { keyword: searchQuery.value.trim() }
    })
    searchQuery.value = ''
  }
}
</script>

<style scoped>
.app-header {
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(10px);
  background-color: rgba(30, 41, 59, 0.95);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 0;
  gap: 2rem;
}

.logo h1 {
  color: var(--accent-color);
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  white-space: nowrap;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 2rem;
}

.nav-dropdown {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all var(--transition-fast);
  z-index: 1000;
  min-width: 600px;
  max-height: 400px;
  overflow-y: auto;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.5rem;
  padding: 1rem;
}

.category-item {
  display: flex;
  align-items: center;
  padding: 0.75rem;
  border-radius: var(--radius-md);
  color: var(--text-main);
  text-decoration: none;
  font-size: 0.9rem;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.category-item:hover {
  background-color: var(--accent-light);
  color: var(--accent-color);
}

.category-name {
  font-weight: 500;
}

.nav-link {
  color: var(--text-main);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--accent-color);
  background-color: var(--accent-light);
}

.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 3px;
  background-color: var(--accent-color);
  border-radius: var(--radius-sm);
}

.search-container {
  flex: 1;
  max-width: 400px;
}

.search-form {
  display: flex;
  align-items: center;
  background-color: var(--bg-primary);
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
  padding: 0.75rem 1rem;
  background: transparent;
  border: none;
  color: var(--text-main);
  font-size: 0.9rem;
  outline: none;
}

.search-input::placeholder {
  color: var(--text-muted);
}

.search-btn {
  padding: 0.75rem;
  background: var(--accent-color);
  border: none;
  color: white;
  cursor: pointer;
  transition: all var(--transition-fast);
  display: flex;
  align-items: center;
  justify-content: center;
}

.search-btn:hover {
  background: var(--accent-hover);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .header-content {
    flex-wrap: wrap;
    gap: 1rem;
  }

  .nav-menu {
    order: 3;
    width: 100%;
    justify-content: center;
    gap: 1rem;
    padding-top: 0.5rem;
    border-top: 1px solid var(--border-color);
  }

  .dropdown-menu {
    min-width: auto;
    width: 100%;
    left: 50%;
    transform: translateX(-50%) translateY(-10px);
  }

  .dropdown-menu.show {
    transform: translateX(-50%) translateY(0);
  }

  .dropdown-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .search-container {
    order: 2;
    max-width: none;
  }

  .logo h1 {
    font-size: 1.25rem;
  }
}

@media (max-width: 480px) {
  .nav-menu {
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }

  .dropdown-grid {
    grid-template-columns: 1fr;
  }

  .category-item {
    font-size: 0.85rem;
    padding: 0.5rem;
  }
}
</style>
