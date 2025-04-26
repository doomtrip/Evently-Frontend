<template>
  <div class="guest-panel">
    <!-- Общая шапка -->
    <header class="main-header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.png" alt="Логотип" class="logo">
        </router-link>

        <div class="search-container">
          <input
            type="text"
            placeholder="Поиск событий..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
          >
        </div>

        <div class="auth-controls">
          <UserMenu v-if="$store.state.user" />
          <router-link
            v-else
            to="/auth"
            class="login-button"
          >
            Войти
          </router-link>
        </div>
      </div>
    </header>

    <!-- Основной контент -->
    <main class="content">
      <EventList :events="filteredEvents" /> <!-- Исправлено имя компонента -->
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EventList from '@/components/events/EventList.vue' // Исправлен путь
import UserMenu from '@/components/UserMenu.vue'

export default {
  components: {
    EventList, // Исправлено здесь
    UserMenu
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  computed: {
    ...mapState(['events']),
    filteredEvents() {
      return this.events.filter(event => 
        event.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    performSearch() {
      // Логика поиска
    }
  }
}
</script>

<style scoped>
.main-header {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  height: 40px;
}

.search-container input {
  width: 400px;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
}

.auth-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.login-button {
  background: #007bff;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  transition: background 0.3s;
}

.login-button:hover {
  background: #0056b3;
}

.content {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 2rem;
}
</style>