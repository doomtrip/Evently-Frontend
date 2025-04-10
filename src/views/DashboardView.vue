<template>
  <div class="dashboard">
    <div v-if="isAuthenticated">
      <h1>Личный кабинет</h1>
      <p>Добро пожаловать, {{ user.name }}!</p>
      <router-link to="/profile">Профиль</router-link>
    </div>

    <div v-else class="guest-content">
      <h1>Главная страница</h1>
      <p>Для доступа к личному кабинету:</p>
      <router-link to="/login" class="auth-link">Войти</router-link>
      <router-link to="/register" class="auth-link">Регистрация</router-link>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import AuthService from '@/api/Auth';

const isAuthenticated = computed(() => AuthService.isAuthenticated());
</script>

<style>
.guest-content {
  text-align: center;
  padding: 2rem;
}

.auth-link {
  display: block;
  margin: 1rem auto;
  width: 200px;
  padding: 0.5rem;
  background: #3b82f6;
  color: white;
  border-radius: 4px;
}
</style>