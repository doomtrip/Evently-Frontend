<template>
  <div class="admin-panel">
    <header>
      <router-link to="/admin" class="logo-link">
        <img 
          src="@/assets/logo_light.png" 
          alt="Evently Logo" 
          class="logo"
        >
      </router-link>
      <nav>
        <div class="search-container">
          <input 
            type="text" 
            placeholder="Поиск событий..." 
            v-model="searchQuery"
          >
        </div>
        <router-link to="/admin/create-event">Создать событие</router-link>
        <router-link to="/admin/events">Список событий</router-link>
        <router-link to="/admin/permissions">Управление правами</router-link>
        <router-link to="/admin/users">Список пользователей</router-link>
        <router-link to="/auth" class="login-btn">Войти</router-link>
      </nav>
    </header>

    <!-- Блок ближайших событий -->
    <div v-if="isAdminRoot" class="upcoming-events">
      <div class="events-container">
        <div class="events-header">
          <h2>Ближайшие события</h2>
          <div class="filters">
            <button
              v-for="filter in filters"
              :key="filter.value"
              :class="{ active: currentFilter === filter.value }"
              @click="setFilter(filter.value)"
            >
              {{ filter.label }}
            </button>
          </div>
        </div>

        <div class="events-grid">
          <div 
            v-for="event in paginatedEvents" 
            :key="event.id" 
            class="event-card"
          >
            <div class="preview-image">
              <img :src="event.image || basedImage" alt="Превью">
              <div class="event-overlay">
                <div class="preview-header">
                  <span class="preview-type">{{ event.type }}</span>
                  <h3 class="preview-title">{{ event.title }}</h3>
                </div>
                <div class="preview-details">
                  <div class="detail-item">
                    <span class="detail-label">Дата и время</span>
                    <span class="detail-value">{{ formatDate(event.date) }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Место</span>
                    <span class="detail-value">{{ event.location }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Кнопка "Показать еще" -->
        <div class="load-more" v-if="showLoadMore">
          <button @click="loadMore">
            <img 
              src="@/assets/List_frame.png" 
              alt="Показать еще"
            >
          </button>
        </div>
      </div>
    </div>

    <main>
      <router-view></router-view>
    </main>

    <footer>
      <p>© 2025 Emocore. Все права защищены.</p>
    </footer>
  </div>
</template>

<script>
import basedImage from '@/assets/based_image.jpg';

export default {
  name: 'AdminPanel',
  data() {
    return {
      basedImage: basedImage,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 4,
      currentFilter: 'all',
      filters: [
        { value: 'all', label: 'Все' },
        { value: 'my', label: 'Мои события' },
        { value: 'visited', label: 'Посещенные' }
      ],
      upcomingEvents: [
          {
          id: 1,
          title: 'IT-Митап 2024',
          type: 'Митап',
          date: '2024-03-15T19:00',
          location: 'Москва, Крокус Сити',
          image: null,
          isMine: true,
          isVisited: false
        },
        {
          id: 2,
          title: 'Конференция по Vue.js',
          type: 'Конференция',
          date: '2024-03-20T10:00',
          location: 'Санкт-Петербург, Экспофорум',
          image: null,
          isMine: false,
          isVisited: true
        },
        {
          id: 3,
          title: 'Frontend Meetup',
          type: 'Митап',
          date: '2024-04-01T18:30',
          location: 'Новосибирск, Экспоцентр',
          image: null,
          isMine: true,
          isVisited: true
        },
        {
          id: 4,
          title: 'Mobile Dev Conference',
          type: 'Конференция',
          date: '2024-04-05T09:00',
          location: 'Казань, IT-Парк',
          image: null,
          isMine: false,
          isVisited: false
        },
        {
          id: 5,
          title: 'DevOps Workshop',
          type: 'Воркшоп',
          date: '2024-04-10T14:00',
          location: 'Екатеринбург, Сколково',
          image: null,
          isMine: true,
          isVisited: false
        }
      ]
    }
  },
  computed: {
    isAdminRoot() {
      return this.$route.path === '/admin';
    },
    filteredEvents() {
      return this.upcomingEvents.filter(event => {
        if (this.currentFilter === 'my') return event.isMine;
        if (this.currentFilter === 'visited') return event.isVisited;
        return true;
      });
    },
    paginatedEvents() {
      return this.filteredEvents.slice(0, this.currentPage * this.itemsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredEvents.length / this.itemsPerPage);
    },
    showLoadMore() {
      return this.currentPage < this.totalPages;
    }
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return 'Дата не указана';
      const date = new Date(dateString);
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      return date.toLocaleDateString('ru-RU', options)
        .replace(' г.', '')
        .replace(',', '');
    },
    setFilter(filter) {
      this.currentFilter = filter;
      this.currentPage = 1;
    },
    loadMore() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    }
  }
}
</script>

<style scoped>
.admin-panel {
  font-family: Arial, sans-serif;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: #f8f9fa;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.logo-link {
  display: block;
  background: none; /* Убрали фон */
}

.logo {
  height: 40px;
  background: none; /* Убрали фон */
}

nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

nav a {
  text-decoration: none;
  color: #333;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background 0.3s;
}

nav a:hover {
  background: #e9ecef;
}

.login-btn {
  background: #007bff;
  color: white !important;
}

.search-container input {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 400px;
}

.upcoming-events {
  padding: 2rem;
  background: #fff;
}

.events-container {
  max-width: 1200px;
  margin: 0 auto;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filters button {
  padding: 0.5rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: none;
  cursor: pointer;
  transition: all 0.3s;
  color: #000;
}

.filters button.active {
  background: #007bff;
  border-color: #007bff;
  color: #fff;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 2rem;
}

.event-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.preview-image {
  position: relative;
  height: 300px;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.event-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
}

.preview-header {
  margin-bottom: 1rem;
}

.preview-type {
  display: block;
  font-size: 1.1rem;
  color: #ffffffcc;
}

.preview-title {
  margin: 0;
  font-size: 1.5rem;
  line-height: 1.3;
}

.preview-details {
  margin-top: 1.5rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-label {
  color: #ffffffcc;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 500;
}

.load-more {
  margin-top: 2rem;
  text-align: center;
}

.load-more button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 1rem;
  transition: transform 0.3s;
}

.load-more button:hover {
  transform: scale(1.1);
}

main {
  flex: 1;
  padding: 2rem;
}

footer {
  text-align: center;
  padding: 1rem;
  background: #f8f9fa;
}

@media (max-width: 768px) {
  header {
    flex-direction: column;
    gap: 1rem;
  }

  .search-container input {
    width: 100%;
  }

  nav {
    flex-wrap: wrap;
    justify-content: center;
  }

  .events-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filters {
    flex-wrap: wrap;
  }

  .events-grid {
    grid-template-columns: 1fr;
  }
}
</style>