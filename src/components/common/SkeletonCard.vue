<template>
  <div class="skeleton-card">
    <div class="skeleton-cover">
      <div class="skeleton-image"></div>
    </div>
    <div class="skeleton-info">
      <div class="skeleton-title"></div>
      <div class="skeleton-chapter"></div>
      <div class="skeleton-meta">
        <div class="skeleton-views"></div>
        <div class="skeleton-date"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
// No props needed for skeleton
</script>

<style scoped>
.skeleton-card {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-color);
  height: 100%;
}

.skeleton-cover {
  position: relative;
  aspect-ratio: 3/4;
  overflow: hidden;
  background-color: var(--bg-primary);
}

.skeleton-image {
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

.skeleton-info {
  padding: 1rem;
}

.skeleton-title {
  height: 2.8em;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
}

.skeleton-chapter {
  height: 1.2em;
  width: 60%;
  background: linear-gradient(90deg, 
    var(--bg-secondary) 0%, 
    var(--bg-primary) 50%, 
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
  margin-bottom: 0.75rem;
}

.skeleton-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skeleton-views,
.skeleton-date {
  height: 1em;
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

.skeleton-date {
  width: 30%;
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
@media (max-width: 640px) {
  .skeleton-info {
    padding: 0.75rem;
  }
  
  .skeleton-title {
    height: 2.4em;
  }
  
  .skeleton-chapter {
    height: 1.1em;
  }
}

@media (max-width: 480px) {
  .skeleton-info {
    padding: 0.5rem;
  }
  
  .skeleton-title {
    height: 2.2em;
  }
}
</style>
