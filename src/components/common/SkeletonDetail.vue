<template>
  <div class="skeleton-detail">
    <!-- Comic Header Skeleton -->
    <div class="skeleton-comic-header">
      <div class="skeleton-thumbnail">
        <div class="skeleton-thumbnail-image"></div>
      </div>
      <div class="skeleton-main-info">
        <div class="skeleton-title"></div>
        <div class="skeleton-author"></div>
        <div class="skeleton-meta">
          <div class="skeleton-status"></div>
          <div class="skeleton-views"></div>
          <div class="skeleton-updated"></div>
        </div>
        <div class="skeleton-description">
          <div class="skeleton-line"></div>
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
        <div class="skeleton-actions">
          <div class="skeleton-button primary"></div>
          <div class="skeleton-button secondary"></div>
        </div>
      </div>
    </div>

    <!-- Chapters Section Skeleton -->
    <div class="skeleton-chapters">
      <div class="skeleton-section-title"></div>
      <div class="skeleton-chapter-controls">
        <div class="skeleton-sort"></div>
        <div class="skeleton-search"></div>
      </div>
      <div class="skeleton-chapter-list">
        <div v-for="i in 10" :key="i" class="skeleton-chapter-item">
          <div class="skeleton-chapter-number"></div>
          <div class="skeleton-chapter-title"></div>
          <div class="skeleton-chapter-date"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props needed for skeleton
</script>

<style scoped>
.skeleton-detail {
  width: 100%;
}

/* Comic Header Skeleton */
.skeleton-comic-header {
  display: flex;
  gap: 2rem;
  margin-bottom: 3rem;
}

.skeleton-thumbnail {
  flex-shrink: 0;
  width: 200px;
  height: 280px;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background-color: var(--bg-secondary);
}

.skeleton-thumbnail-image {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-main-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skeleton-title {
  height: 3em;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  width: 80%;
}

.skeleton-author {
  height: 1.5em;
  width: 40%;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.skeleton-status,
.skeleton-views,
.skeleton-updated {
  height: 2em;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: 9999px;
}

.skeleton-status {
  width: 100px;
}

.skeleton-views {
  width: 80px;
}

.skeleton-updated {
  width: 60px;
}

.skeleton-description {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.skeleton-line {
  height: 1.2em;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton-line.short {
  width: 60%;
}

.skeleton-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.skeleton-button {
  height: 3em;
  padding: 0 2rem;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

.skeleton-button.primary {
  width: 120px;
}

.skeleton-button.secondary {
  width: 100px;
}

/* Chapters Section Skeleton */
.skeleton-chapters {
  margin-top: 3rem;
}

.skeleton-section-title {
  height: 2.5em;
  width: 200px;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  margin-bottom: 1.5rem;
}

.skeleton-chapter-controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.skeleton-sort,
.skeleton-search {
  height: 2.5em;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-md);
}

.skeleton-sort {
  width: 140px;
}

.skeleton-search {
  width: 200px;
}

.skeleton-chapter-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-chapter-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
}

.skeleton-chapter-number {
  height: 2em;
  width: 60px;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
}

.skeleton-chapter-title {
  flex: 1;
  height: 1.5em;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

.skeleton-chapter-date {
  height: 1.2em;
  width: 80px;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  flex-shrink: 0;
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
  .skeleton-comic-header {
    flex-direction: column;
    gap: 1.5rem;
  }
  
  .skeleton-thumbnail {
    width: 160px;
    height: 224px;
    margin: 0 auto;
  }
  
  .skeleton-title {
    width: 100%;
  }
  
  .skeleton-chapter-controls {
    flex-direction: column;
  }
  
  .skeleton-search {
    width: 100%;
  }
}
</style>
