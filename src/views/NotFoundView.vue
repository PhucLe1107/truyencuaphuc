<template>
  <div class="not-found-view">
    <div class="container">
      <div class="not-found-content">
        <div class="error-code">404</div>
        <h1 class="error-title">Trang không tìm thấy</h1>
        <p class="error-description">
          Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
        </p>
        
        <div class="error-actions">
          <router-link to="/" class="btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
              <polyline points="9 22 9 12 15 12 15 22"></polyline>
            </svg>
            Về trang chủ
          </router-link>
          <button class="btn btn-outline" @click="goBack">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Quay lại
          </button>
        </div>
        
        <div class="suggestions">
          <h3>Bạn có thể tìm kiếm:</h3>
          <div class="suggestion-links">
            <router-link to="/categories" class="suggestion-link">
              📚 Thể loại truyện
            </router-link>
            <router-link to="/status/truyen-moi" class="suggestion-link">
              🆕 Truyện mới cập nhật
            </router-link>
            <router-link to="/status/hoan-thanh" class="suggestion-link">
              ✅ Truyện hoàn thành
            </router-link>
            <router-link to="/search" class="suggestion-link">
              🔍 Tìm kiếm truyện
            </router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  if (window.history.length > 1) {
    router.go(-1)
  } else {
    router.push('/')
  }
}
</script>

<style scoped>
.not-found-view {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  margin: 0 auto;
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  color: var(--accent-color);
  line-height: 1;
  margin-bottom: 1rem;
  text-shadow: var(--shadow-glow);
}

.error-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-main);
  margin-bottom: 1rem;
}

.error-description {
  font-size: 1.1rem;
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
  flex-wrap: wrap;
}

.error-actions .btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.suggestions {
  background-color: var(--bg-secondary);
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 1px solid var(--border-color);
}

.suggestions h3 {
  color: var(--text-main);
  margin-bottom: 1rem;
  font-size: 1.2rem;
}

.suggestion-links {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.suggestion-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background-color: var(--bg-primary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-md);
  color: var(--text-main);
  text-decoration: none;
  font-weight: 500;
  transition: all var(--transition-fast);
}

.suggestion-link:hover {
  background-color: var(--accent-color);
  border-color: var(--accent-color);
  color: white;
  transform: translateY(-2px);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }
  
  .error-title {
    font-size: 2rem;
  }
  
  .error-description {
    font-size: 1rem;
  }
  
  .error-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .error-actions .btn {
    width: 200px;
    justify-content: center;
  }
  
  .suggestions {
    padding: 1.5rem;
  }
  
  .suggestion-links {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 4rem;
  }
  
  .error-title {
    font-size: 1.5rem;
  }
  
  .suggestion-links {
    gap: 0.75rem;
  }
  
  .suggestion-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
}
</style>
