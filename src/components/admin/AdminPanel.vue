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
        <div class="search-container" ref="searchContainer">
          <input 
            type="text" 
            placeholder="Поиск событий..." 
            v-model="searchQuery"
            @input="handleSearch"
            @focus="handleSearch"
          >
          <div 
            v-if="searchResults.length > 0" 
            class="search-dropdown"
            @mouseleave="closeDropdown"
          >
            <div
              v-for="event in searchResults"
              :key="event.id"
              class="search-item"
              @click="navigateToEvent(event.id)"
              @mousedown.prevent
            >
              <div class="search-item-content">
                <span class="event-title">{{ event.title }}</span>
                <span class="event-date">
                  {{ formatEventDate(event.date) }}
                </span>
              </div>
            </div>
          </div>
        </div>
        <router-link to="/admin/create-event">Создать событие</router-link>
        <router-link to="/admin/events">Список событий</router-link>
        <router-link to="/admin/permissions">Управление правами</router-link>
        <router-link to="/admin/users">Список пользователей</router-link>
        <UserMenu />
      </nav>
    </header>

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

        <div class="load-more" v-if="showLoadMore">
          <button @click="loadMore">
            <img src="@/assets/List_frame.png" alt="Показать еще">
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
import UserMenu from '@/components/UserMenu.vue';
import { eventsData } from '@/components/events/eventsData';

export default {
  name: 'AdminPanel',
  components: { UserMenu },
  data() {
    return {
      basedImage: basedImage,
      searchQuery: '',
      currentPage: 1,
      itemsPerPage: 4,
      currentFilter: 'all',
      filters: [
        { value: 'all', label: 'Все' },
        { value: 'my', label: 'Мои события' }
      ],
      upcomingEvents: eventsData,
      searchResults: [],
      allEvents: eventsData
    };
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  computed: {
    isAdminRoot() {
      return this.$route.path === '/admin';
    },
    filteredEvents() {
      return this.upcomingEvents.filter(event => {
        if (this.currentFilter === 'my') return event.isMine;
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
    formatEventDate(dateString) {
      return this.formatDate(dateString);
    },
    setFilter(filter) {
      this.currentFilter = filter;
      this.currentPage = 1;
    },
    loadMore() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    handleSearch() {
      const query = this.searchQuery.toLowerCase();
      this.searchResults = this.allEvents
        .filter(event => 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        )
        .slice(0, 5);
    },
    navigateToEvent(id) {
      this.$router.push(`/event/${id}`);
      this.closeDropdown();
    },
    closeDropdown() {
      this.searchResults = [];
    },
    handleClickOutside(event) {
      if (!this.$refs.searchContainer?.contains(event.target)) {
        this.closeDropdown();
      }
    }
  }
};
</script>

<style scoped>
.search-container {
  position: relative;
  flex-grow: 1;
  margin-right: 2rem;
}

.search-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 8px;
}

.search-item {
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.search-item:hover {
  background: #f8f9fa;
}

.search-item-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-title {
  font-weight: 500;
}

.event-date {
  color: #6c757d;
  font-size: 0.9rem;
  margin-left: 1rem;
}

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
}

.logo {
  height: 40px;
}

nav {
  display: flex;
  gap: 1.5rem;
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

.search-container input {
  width: 400px;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
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