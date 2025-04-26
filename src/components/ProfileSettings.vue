<template>
  <div class="profile-settings">
    <!-- Общая шапка как в GuestPanel -->
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
    <div class="settings-layout">
      <!-- Левая часть - Настройки -->
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
            <label>Новый пароль</label>
            <input v-model="userData.newPassword" type="password">
          </div>

          <button type="submit" class="submit-btn">Сохранить изменения</button>
        </form>
      </div>

      <!-- Правая часть - Профиль -->
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

    <!-- Блок "Мои события" под основным контентом -->
    <div class="my-events-section">
      <h2>Мои события</h2>
      <EventList :events="userEvents" />
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
      userData: {
        ...this.$store.state.user,
        newPassword: '',
        avatar: null
      },
      userEvents: eventsData.filter(e => e.isMine)
    }
  },
  computed: {
    userRole() {
      return this.$store.state.user?.role === 'admin' ? 'Администратор' : 'Пользователь'
    }
  },
  methods: {
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
      this.$store.commit('updateUser', this.userData)
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

/* Стили шапки как в GuestPanel */
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

/* Основной контент */
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

/* Секция "Мои события" */
.my-events-section {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.my-events-section h2 {
  margin-bottom: 1.5rem;
}
</style>