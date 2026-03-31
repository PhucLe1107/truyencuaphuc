<template>
  <router-link :to="`/comic/${comic.slug}`" class="comic-card">
    <div class="comic-cover">
      <img :src="comic.thumbnail" :alt="comic.name" loading="lazy" @error="handleImageError" />
      <div class="comic-overlay">
        <div class="comic-status" :class="statusClass">
          {{ comic.status === 'ongoing' ? 'Đang tiến hành' : 'Hoàn thành' }}
        </div>
      </div>
    </div>

    <div class="comic-info">
      <h3 class="comic-title">{{ comic.name }}</h3>
      <p class="comic-chapter">Chapter {{ comic.latestChapter }}</p>
      <div class="comic-meta">
        <span class="comic-views">{{ formatViews(comic.views) }}</span>
        <span class="comic-updated">{{ formatDate(comic.updatedAt) }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  comic: {
    type: Object,
    required: true,
    validator: (value) => {
      return value.slug && value.name && value.thumbnail
    }
  }
})

const statusClass = computed(() => {
  return {
    'status-ongoing': props.comic.status === 'ongoing',
    'status-completed': props.comic.status === 'completed'
  }
})

const handleImageError = (event) => {
  // Fallback image if thumbnail fails to load
  event.target.src = 'https://via.placeholder.com/200x280/1e293b/64748b?text=No+Image'
}

const formatViews = (views) => {
  if (!views) return '0 lượt xem'
  if (views >= 1000000) return `${(views / 1000000).toFixed(1)}M lượt xem`
  if (views >= 1000) return `${(views / 1000).toFixed(1)}K lượt xem`
  return `${views} lượt xem`
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
</script>

<style scoped>
.comic-card {
  display: block;
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: all var(--transition-normal);
  border: 1px solid var(--border-color);
  height: 100%;
}

.comic-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--accent-color);
}

.comic-cover {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.comic-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform var(--transition-normal);
}

.comic-card:hover .comic-cover img {
  transform: scale(1.05);
}

.comic-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
  opacity: 1;
  transition: opacity var(--transition-fast);
  display: flex;
  align-items: flex-start;
  justify-content: flex-end;
  padding: 0.5rem;
}

.comic-card:hover .comic-overlay {
  opacity: 1;
}

.comic-status {
  padding: 0.15rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.3px;
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
  padding: 1rem;
}

.comic-title {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-main);
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 2.8em;
}

.comic-chapter {
  font-size: 0.85rem;
  color: var(--accent-color);
  font-weight: 500;
  margin: 0 0 0.75rem 0;
}

.comic-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.75rem;
  color: var(--text-muted);
}

.comic-views {
  font-weight: 500;
}

.comic-updated {
  opacity: 0.8;
}

/* Mobile Responsive */
@media (max-width: 640px) {
  .comic-info {
    padding: 0.75rem;
  }

  .comic-title {
    font-size: 0.9rem;
  }

  .comic-chapter {
    font-size: 0.8rem;
  }

  .comic-meta {
    font-size: 0.7rem;
  }
}

@media (max-width: 480px) {
  .comic-info {
    padding: 0.5rem;
  }

  .comic-title {
    font-size: 0.85rem;
    min-height: 2.4em;
  }
}
</style>
