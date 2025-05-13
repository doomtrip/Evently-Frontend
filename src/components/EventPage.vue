<template>
  <div class="event-page">
    <!-- Унифицированная шапка с поиском -->
    <header class="main-header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.png" alt="Логотип" class="logo">
        </router-link>

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
              @mousedown.prevent"
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

    <!-- Контент события -->
    <div 
      class="event-header"
      :style="{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${event.image || basedImage})` }"
    >
      <div class="header-content event-header-content">
        <div class="event-info">
          <span class="event-type">{{ eventTypeLabel }}</span>
          <h1>{{ event.title }}</h1>
          <p class="event-datetime">{{ formattedDate }}</p>
        </div>
      </div>
    </div>

    <div class="event-body">
      <div class="description-section">
        <h2>Описание события</h2>
        <p>{{ event.description }}</p>
        <button 
          class="register-button"
          @click="handleRegistration"
          :disabled="isPast"
          :class="{ 'past-event': isPast }"
        >
          {{ isPast ? 'Событие завершено' : (event.isMine ? 'Отменить запись' : 'Записаться') }}
        </button>
      </div>

      <div class="map-section">
        <h2>Местоположение</h2>
        <a 
          class="address-text" 
          :href="yandexMapsLink" 
          target="_blank"
        >
          {{ event.address }}
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import basedImage from '@/assets/based_image.jpg'
import { eventsData } from '@/components/events/eventsData'
import UserMenu from '@/components/UserMenu.vue'

export default {
  props: ['id'],
  components: { UserMenu },
  data() {
    return {
      basedImage,
      searchQuery: '',
      searchResults: [],
      allEvents: JSON.parse(localStorage.getItem('events')) || eventsData
    }
  },
  computed: {
    event() {
      return this.allEvents.find(e => e.id === parseInt(this.id)) || {}
    },
    formattedDate() {
      if (!this.event.date) return ''
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
      }
      return new Date(this.event.date)
        .toLocaleDateString('ru-RU', options)
        .replace(' г.', '')
        .replace(',', '')
    },
    eventTypeLabel() {
      const types = {
        meetup: 'Митап',
        conference: 'Конференция',
      }
      return types[this.event.type?.toLowerCase()] || this.event.type
    },
    isPast() {
      const eventDate = new Date(this.event.date)
      const now = new Date()
      return eventDate < now
    },
    yandexMapsLink() {
      return `https://yandex.ru/maps/?text=${encodeURIComponent(this.event.address)}`
    }
  },
  methods: {
    handleRegistration() {
      if (!this.isPast) {
        const eventIndex = this.allEvents.findIndex(e => e.id === parseInt(this.id))
        if (eventIndex > -1) {
          this.allEvents[eventIndex].isMine = !this.allEvents[eventIndex].isMine
          localStorage.setItem('events', JSON.stringify(this.allEvents))
          this.allEvents = [...this.allEvents]
        }
      }
    },
    handleSearch() {
      const query = this.searchQuery.toLowerCase()
      this.searchResults = this.allEvents
        .filter(event => 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query))
        .slice(0, 5)
    },
    navigateToEvent(id) {
      this.$router.push(`/event/${id}`)
      this.closeDropdown()
    },
    closeDropdown() {
      this.searchResults = []
    },
    formatEventDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return date.toLocaleDateString('ru-RU', options)
        .replace(' г.', '')
        .replace(',', '')
    },
    handleClickOutside(event) {
      if (this.$refs.searchContainer && !this.$refs.searchContainer.contains(event.target)) {
        this.closeDropdown()
      }
    }
  },
  mounted() {
    const savedEvents = JSON.parse(localStorage.getItem('events'))
    if (savedEvents) {
      this.allEvents = savedEvents
    }
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  }
}
</script>

<style scoped>
/* Все стили остаются без изменений */
.search-container {
  position: relative;
  flex-grow: 1;
  margin: 0 2rem;
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

.register-button.past-event {
  background: #6c757d;
  cursor: not-allowed;
}

.address-text {
  color: #007bff;
  text-decoration: underline;
  cursor: pointer;
  transition: color 0.3s;
}

.address-text:hover {
  color: #0056b3;
}

.map-container {
  display: none;
}

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

.event-header {
  height: 60vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  color: white;
  margin-top: -1px;
}

.event-type {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
  margin-bottom: 1rem;
}

.event-meta {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.event-body {
  max-width: 1200px;
  margin: 2rem auto;
  padding: 0 1rem;
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 3rem;
}

.register-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  margin-top: 2rem;
}

.map-section {
  position: sticky;
  top: 1rem;
  height: fit-content;
}

.event-header-content {
  width: 100%;
  padding: 2rem;
}

.event-info {
  max-width: 1200px;
  margin: 0 auto;
}

.event-type {
  font-size: 1.4rem;
  color: rgba(255,255,255,0.9);
  margin: 0 auto;
}

.event-info h1 {
  font-size: 2.8rem;
  margin: 0.5rem 0;
  color: white;
}

.event-datetime {
  font-size: 1.6rem;
  color: rgba(255,255,255,0.9);
  margin: 0;
}

.address-text {
  font-size: 1.2rem;
  color: #666;
  margin: 1rem 0 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .event-info h1 {
    font-size: 2rem;
  }
  
  .event-datetime {
    font-size: 1.2rem;
  }
  
  .address-text {
    font-size: 1rem;
  }
}

.static-map {
  width: 100%;
  height: 400px;
  border-radius: 12px;
  object-fit: cover;
}

@media (max-width: 1024px) {
  .event-body {
    grid-template-columns: 1fr;
  }
  
  .map-section {
    position: static;
  }
}
</style>