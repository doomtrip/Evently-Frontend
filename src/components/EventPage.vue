<template>
  <div class="event-page">
    <!-- Унифицированная шапка -->
    <header class="main-header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <img src="@/assets/logo.png" alt="Логотип" class="logo">
        </router-link>

        <div class="search-container">
          <input 
            type="text" 
            placeholder="Поиск событий..." 
            v-model="globalSearchQuery"
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
        >
          {{ isRegistered ? 'Отменить запись' : 'Записаться' }}
        </button>
      </div>

      <div class="map-section">
        <h2>Местоположение</h2>
        <p class="address-text">{{ event.address }}</p>
        <div class="map-container">
          <img :src="staticMapUrl" alt="Карта" class="static-map">
        </div>
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
      isRegistered: false,
      globalSearchQuery: ''
    }
  },
  computed: {
    event() {
      return eventsData.find(e => e.id === parseInt(this.id)) || {}
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
        workshop: 'Воркшоп'
      }
      return types[this.event.type?.toLowerCase()] || this.event.type
    },
    staticMapUrl() {
      return `https://maps.googleapis.com/maps/api/staticmap?center=${encodeURIComponent(this.event.address)}&zoom=15&size=800x400&markers=color:red%7C${encodeURIComponent(this.event.address)}`
    }
  },
  methods: {
    handleRegistration() {
      this.isRegistered = !this.isRegistered
      // Логика записи/отмены
    }
  }
}
</script>

<style scoped>
/* Стили шапки из GuestPanel */
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

/* Стили специфичные для страницы события */
.event-header {
  height: 60vh;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding: 2rem;
  color: white;
  margin-top: -1px; /* Убирает зазор между шапками */
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

/* Стили для адреса */
.address-text {
  font-size: 1.2rem;
  color: #666;
  margin: 1rem 0 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

/* Адаптивность */
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