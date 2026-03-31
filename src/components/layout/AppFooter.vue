<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Truyện Của Phúc</h3>
          <p>Website đọc truyện tranh online với kho truyện đa dạng và cập nhật liên tục.</p>
        </div>
        
        <div class="footer-section">
          <h4>Liên kết</h4>
          <ul>
            <li><router-link to="/">Trang chủ</router-link></li>
            <li><router-link to="/categories">Thể loại</router-link></li>
            <li><router-link to="/status/truyen-moi">Truyện mới</router-link></li>
            <li><router-link to="/status/hoan-thanh">Hoàn thành</router-link></li>
          </ul>
        </div>
        
        <div class="footer-section">
          <h4>Thông tin</h4>
          <p>Đọc truyện miễn phí</p>
          <p>Cập nhật hàng ngày</p>
          <p>Giao diện hiện đại</p>
        </div>
      </div>
      
      <div class="footer-bottom">
        <p>&copy; 2026 Truyện Của Phúc. Sản phẩm chỉ nhằm mục đích học tập và giải trí</p>
      </div>
    </div>
  </footer>
</template>

<script setup>
</script>

<style scoped>
.app-footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 3rem 0 2rem;
}

.footer-section h3 {
  color: var(--accent-color);
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.footer-section h4 {
  color: var(--text-main);
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.footer-section p {
  color: var(--text-muted);
  line-height: 1.6;
  margin-bottom: 0.5rem;
}

.footer-section ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-section ul li {
  color: var(--text-muted);
}

.footer-section ul li a {
  color: var(--text-muted);
  transition: color var(--transition-fast);
}

.footer-section ul li a:hover {
  color: var(--accent-color);
}

.footer-bottom {
  padding: 1.5rem 0;
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.footer-bottom p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 2rem 0 1.5rem;
  }
  
  .footer-section h3 {
    font-size: 1.1rem;
  }
  
  .footer-section h4 {
    font-size: 0.95rem;
  }
}
</style>
