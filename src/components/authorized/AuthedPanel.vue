<template>
  <div class="authed-panel">
    <header class="main-header">
      <div class="header-content">
        <router-link to="/" class="logo-link">
          <img 
            src="@/assets/logo.png" 
            alt="Логотип" 
            class="logo"
          >
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

    <main class="content">
      <router-view :events="filteredEvents" />
    </main>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import UserMenu from '@/components/UserMenu.vue'
import { eventsData } from '@/components/events/eventsData'

export default {
  components: {
    UserMenu
  },
  data() {
    return {
      searchQuery: '',
      searchResults: [],
      allEvents: eventsData,
      currentFilter: 'all'
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside)
  },
  beforeDestroy() {
    document.removeEventListener('click', this.handleClickOutside)
  },
  computed: {
    ...mapState(['user']),
    filteredEvents() {
      const now = new Date()
      let events = this.searchQuery.length === 0 ? this.allEvents : this.searchResults
      
      switch(this.currentFilter) {
        case 'my':
          events = events.filter(event => event.isMine)
          break
        case 'past':
          events = events.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate < now && !isNaN(eventDate)
          })
          break
      }
      
      return events
    }
  },
  methods: {
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
    handleClickOutside(event) {
      if (!this.$refs.searchContainer.contains(event.target)) {
        this.closeDropdown()
      }
    }
  }
}
</script>

<style scoped>
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
  width: 100%;
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

.filters {
  margin: 1rem 0;
  display: flex;
  gap: 1rem;
}

.filters button {
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 20px;
  background: none;
  cursor: pointer;
  transition: all 0.3s;
}

.filters button.active {
  background: #007bff;
  color: white;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }
  
  .search-container {
    width: 100%;
    margin: 0;
  }
}
</style>