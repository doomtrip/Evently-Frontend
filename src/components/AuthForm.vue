<template>
  <div class="auth-container">
    <div class="form-section">
      <div class="header">
        <img src="@/assets/logo.png" alt="Evently Logo" class="logo" />
        <h1 class="title">Evently</h1>
      </div>

      <div class="form-toggle">
        <Button 
          text 
          @click="isRegistering = false"
          :class="{ 'active': !isRegistering }"
        >
          Авторизация
        </Button>
        <Button 
          text 
          @click="isRegistering = true"
          :class="{ 'active': isRegistering }"
        >
          Регистрация
        </Button>
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div v-if="!isRegistering" class="form-group">
          <InputText
            v-model="loginEmail"
            placeholder="Введите email"
            type="email"
          />
          <InputText
            v-model="loginPassword"
            placeholder="Введите пароль"
            type="password"
          />
          <Button type="submit" label="Войти" class="p-button-raised" />
        </div>

        <div v-else class="form-group">
          <InputText
            v-model="registerEmail"
            placeholder="example@mail.com"
            type="email"
          />
          <InputText
            v-model="registerPassword"
            placeholder="Придумайте пароль"
            type="password"
            :class="{ 'p-invalid': passwordInvalid }"
          />
          <InputText
            v-model="registerConfirmPassword"
            placeholder="Подтвердите пароль"
            type="password"
            :class="{ 'p-invalid': passwordMismatch }"
          />
          <small v-if="passwordInvalid" class="error-message">
            Пароль должен содержать минимум 8 символов и хотя бы одну цифру или букву.
          </small>
          <small v-if="passwordMismatch" class="error-message">
            Пароли не совпадают
          </small>
          <Button 
            type="submit" 
            label="Зарегистрироваться" 
            class="p-button-raised" 
            :disabled="passwordInvalid || passwordMismatch"
          />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';

const isRegistering = ref(false);

// Данные авторизации
const loginEmail = ref('');
const loginPassword = ref('');

// Данные регистрации
const registerEmail = ref('');
const registerPassword = ref('');
const registerConfirmPassword = ref('');

// Проверка на соответствие пароля требованиям
const passwordInvalid = computed(() => {
  const password = registerPassword.value;
  const hasMinimumLength = password.length >= 8;
  const hasLetterOrDigit = /[A-Za-z0-9]/.test(password);
  return !hasMinimumLength || !hasLetterOrDigit;
});

const passwordMismatch = computed(() => {
  return isRegistering.value && 
    registerPassword.value !== registerConfirmPassword.value &&
    registerConfirmPassword.value.length > 0;
});

const handleSubmit = () => {
  if (isRegistering.value) {
    if (passwordInvalid.value || passwordMismatch.value) return;
    console.log('Регистрация:', {
      email: registerEmail.value,
      password: registerPassword.value
    });
  } else {
    console.log('Авторизация:', {
      email: loginEmail.value,
      password: loginPassword.value
    });
  }
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  padding: 2rem;
}

.form-section {
  width: 100%;
  max-width: 400px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: center; 
  margin-bottom: 1.5rem;
}

.logo {
  width: 50px; 
  height: 50px; 
  margin-right: 10px; 
}

.title {
  font-size: 2.5rem;
  font-weight: bold;
  font-family: Arial, sans-serif; 
}

.form-toggle {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  justify-content: center; 
}

.form-toggle button {
  padding: 0.5rem 1rem;
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
}

.form-toggle button.active {
  border-color: var(--primary-color);
  font-weight: bold;
}

.auth-form .form-group {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.error-message {
  color: #ef4444;
  margin-top: -0.5rem;
}

.p-invalid {
  border-color: #ef4444 !important;
}
</style>