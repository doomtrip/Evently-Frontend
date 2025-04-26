<template>
  <div class="user-panel">
    <!-- Шапка -->


    <!-- Контент -->
    <main class="user-content">
      <router-view />
    </main>
  </div>
</template>

<script>
import UserMenu from '@/components/UserMenu.vue'

export default {
  components: {
    UserMenu
  }
}
</script>

<style scoped>
.user-nav {
  display: flex;
  gap: 2rem;
  margin-left: 2rem;
}

.user-nav a {
  color: #2c3e50;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

.user-nav a:hover {
  background: #f8f9fa;
}

.user-nav a.router-link-exact-active {
  color: #007bff;
  background: #f8f9fa;
}

.user-content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}
</style>