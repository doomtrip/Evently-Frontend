<template>
  <div class="profile-settings" :class="{ 'is-admin': isAdmin }">
    <!-- Шапка только для обычных пользователей -->
    <header class="main-header" v-if="!isAdmin">
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

    <!-- Основной контент -->
    <div class="settings-layout">
      <div class="settings-section">
        <h2>Настройки учетной записи</h2>
        <form @submit.prevent="updateProfile">
          <div class="form-group">
            <label>Логин</label>
            <input v-model="userData.login" type="text">
          </div>
          
          <div class="form-group">
            <label>Имя</label>
            <input v-model="userData.firstName" type="text">
          </div>

          <div class="form-group">
            <label>Фамилия</label>
            <input v-model="userData.lastName" type="text">
          </div>

          <div class="form-group">
            <label>Текущий пароль</label>
            <input 
              v-model="userData.currentPassword" 
              type="password"
              required
            >
          </div>

          <div class="form-group">
            <label>Новый пароль</label>
            <input 
              v-model="userData.newPassword" 
              type="password"
              :required="!!userData.confirmNewPassword"
            >
          </div>

          <div class="form-group">
            <label>Подтвердите новый пароль</label>
            <input 
              v-model="userData.confirmNewPassword" 
              type="password"
              :required="!!userData.newPassword"
            >
          </div>

          <div class="form-group">
            <label>Текущая почта</label>
            <p class="current-email">{{ userData.email }}</p>
          </div>

          <div class="form-group">
            <label>Новая почта</label>
            <input 
              v-model="userData.newEmail" 
              type="email"
              placeholder="Введите новый email"
            >
          </div>

          <button type="submit" class="submit-btn">Сохранить изменения</button>
        </form>
      </div>

      <div class="profile-section">
        <div class="avatar-container">
          <img 
            :src="userData.avatar || defaultAvatar" 
            @click="changeAvatar"
            class="avatar"
          >
          <input 
            type="file" 
            ref="avatarInput" 
            @change="handleAvatarUpload"
            hidden
          >
        </div>
        <h3>{{ userData.firstName }} {{ userData.lastName }}</h3>
        <p>Статус: {{ userRole }}</p>
      </div>
    </div>

    <div class="my-events-section">
      <EventList 
        :events="userEvents"
        :show-filters="false"
        :per-page="8"
        title="Мои события" 
      />
    </div>
  </div>
</template>

<script>
import defaultAvatar from '@/assets/user.png'
import EventList from '@/components/events/EventList.vue'
import { eventsData } from '@/components/events/eventsData'
import UserMenu from '@/components/UserMenu.vue'

export default {
  components: { EventList, UserMenu },
  data() {
    return {
      defaultAvatar,
      searchQuery: '',
      searchResults: [],
      userData: { 
        ...this.$store.state.user,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
        newEmail: this.$store.state.user?.email || '',
        avatar: null
      },
      allEvents: eventsData
    }
  },
  computed: {
    userRole() {
      return this.$store.state.user?.role === 'admin' ? 'Администратор' : 'Пользователь'
    },
    isAdmin() {
      return this.$store.state.user?.role === 'admin'
    },
    userEvents() {
      return this.allEvents.filter(event => event.isMine)
    }
  },
  methods: {
    handleSearch() {
      const query = this.searchQuery.toLowerCase()
      this.searchResults = this.allEvents
        .filter(event => 
          event.title.toLowerCase().includes(query) ||
          event.description.toLowerCase().includes(query)
        )
        .slice(0, 5)
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
    navigateToEvent(id) {
      this.$router.push(`/event/${id}`)
      this.closeDropdown()
    },
    closeDropdown() {
      this.searchResults = []
    },
    handleClickOutside(event) {
      if (!this.$refs.searchContainer?.contains(event.target)) {
        this.closeDropdown()
      }
    },
    changeAvatar() {
      this.$refs.avatarInput.click()
    },
    handleAvatarUpload(e) {
      const file = e.target.files[0]
      if (file) {
        this.userData.avatar = URL.createObjectURL(file)
      }
    },
    async updateProfile() {
      if (this.userData.newPassword !== this.userData.confirmNewPassword) {
        alert('Ошибка: Новые пароли не совпадают!')
        return
      }

      if (!this.userData.currentPassword) {
        alert('Ошибка: Введите текущий пароль!')
        return
      }

      const updatedData = {
        ...this.userData,
        email: this.userData.newEmail || this.userData.email,
        password: this.userData.newPassword || this.$store.state.user.password
      }
      
      this.$store.commit('updateUser', updatedData)
      alert('Данные успешно обновлены!')
      
      this.userData.currentPassword = ''
      this.userData.newPassword = ''
      this.userData.confirmNewPassword = ''
    }
  }
}
</script>

<style scoped>
.profile-settings {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-settings.is-admin {
  padding-top: 0;
}

.profile-settings.is-admin .settings-layout {
  margin-top: 0;
  border-top: none;
  padding-top: 2rem;
}

.main-header {
  background: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
  display: none;
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

.search-container {
  position: relative;
  flex-grow: 1;
  margin: 0 2rem;
}

.search-container input {
  width: 100%;
  padding: 0.75rem 1.5rem;
  border: 1px solid #e0e0e0;
  border-radius: 25px;
  font-size: 1rem;
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

.settings-layout {
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
}

.settings-section {
  flex: 1;
  max-width: 500px;
}

.profile-section {
  flex: 1;
  max-width: 600px;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
}

.current-email {
  margin: 0;
  padding: 0.8rem;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 0.95rem;
  color: #495057;
}

.form-group input[type="email"] {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  margin-top: 0.5rem;
}

.avatar-container {
  margin-bottom: 2rem;
}

.avatar {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  border: 3px solid #007bff;
}

.submit-btn {
  background: #007bff;
  color: white;
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}

.my-events-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.my-events-section h2 {
  margin-bottom: 1.5rem;
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
  
  .settings-layout {
    flex-direction: column;
  }
}
</style>