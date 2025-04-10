<template>
  <div class="auth-container">
    <div class="form-section">
      <div class="header">
        <img src="@/assets/logo.png" alt="Evently Logo" class="logo" />
        <h1 class="title">Evently</h1>
      </div>

      <h2 class="form-title">{{ isRegistering ? 'Регистрация' : 'Авторизация' }}</h2>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <InputText
            v-if="isRegistering"
            v-model="registerEmail"
            placeholder="Почта"
            type="email"
            class="custom-input"
            :class="{ 'input-error': emailTouched && invalidEmail }"
            @blur="emailTouched = true"
          />
          <InputText
            v-model="currentEmail"
            :placeholder="isRegistering ? 'Логин' : 'Логин/Почта'"
            type="text"
            class="custom-input"
          />
          <InputText
            v-model="currentPassword"
            placeholder="Пароль"
            type="password"
            class="custom-input"
            :class="{ 'input-error': passwordTouched && invalidPassword }"
            @blur="passwordTouched = true"
          />

          <div v-if="isRegistering" class="form-group">
            <InputText
              v-model="registerConfirmPassword"
              placeholder="Подтвердите пароль"
              type="password"
              class="custom-input"
              :class="{ 'input-error': confirmTouched && passwordMismatch }"
              @blur="confirmTouched = true"
            />
            <small v-if="passwordTouched && invalidPassword" class="error-message">
              Пароль должен содержать минимум 8 символов и хотя бы одну цифру или букву
            </small>
            <small v-if="confirmTouched && passwordMismatch" class="error-message">
              Пароли не совпадают
            </small>
            <small v-if="emailTouched && invalidEmail" class="error-message">
              Введите корректный email
            </small>
          </div>

          <Button 
            type="submit" 
            :label="isRegistering ? 'Зарегистрироваться' : 'Войти'" 
            class="submit-btn"
            :disabled="isRegistering && (invalidPassword || passwordMismatch || invalidEmail)"
          />

          <div class="auth-actions">
	<Button 
        class="vk-auth-btn"
        @click="handleVKAuth"
      >
        <div class="vk-btn-content">
          <img 
            src="@/assets/VkLogo.png" 
            alt="VK Logo" 
            class="vk-logo" 
          />
          <span>Авторизация через ВК</span>
        </div>
     	 </Button>
            <button 
              class="switch-mode" 
              @click="isRegistering = !isRegistering"
            >
              {{ isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Создать' }}
            </button>
            <a href="/" class="return-link">Вернуться на главную</a>
          </div>
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
const currentEmail = ref('');
const currentPassword = ref('');
const registerEmail = ref('');
const registerConfirmPassword = ref('');

// Трекеры взаимодействия
const emailTouched = ref(false);
const passwordTouched = ref(false);
const confirmTouched = ref(false);

// Валидация пароля
const invalidPassword = computed(() => {
  const password = currentPassword.value;
  return isRegistering.value && (
    password.length < 8 ||
    !/[A-Za-z0-9]/.test(password)
  );
});

// Валидация email
const invalidEmail = computed(() => {
  return isRegistering.value && 
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.value);
});

const passwordMismatch = computed(() => 
  isRegistering.value && 
  currentPassword.value !== registerConfirmPassword.value
);

const handleSubmit = () => {
  if (isRegistering.value && (invalidPassword.value || passwordMismatch.value || invalidEmail.value)) return;
  
  console.log({
    [isRegistering.value ? 'registerData' : 'loginData']: {
      login: currentEmail.value,
      ...(isRegistering.value && { email: registerEmail.value }),
      password: currentPassword.value
    }
  });
};

const handleVKAuth = () => {
  // Логика авторизации через ВК
};
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: #f8f9fa;
}

.form-section {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 64px;
  height: 64px;
}

.title {
  font-size: 2rem;
  color: #2c3e50;
  margin-top: 1rem;
}

.form-title {
  text-align: center;
  margin-bottom: 2rem;
  color: #2c3e50;
}

.custom-input {
  width: 100%;
  margin-bottom: 1rem;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  margin-top: 1rem;
  background: #3b82f6;
  border: none;
}

.auth-actions {
  margin-top: 2rem;
  text-align: center;
}

.switch-mode {
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  margin-bottom: 1.5rem;
  display: block;
  width: 100%;
}

.vk-auth-btn {
  width: 100%;
  background: #0077ff !important;
  margin-bottom: 1rem;
}

.return-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
}

.input-error {
  border-color: #ef4444 !important;
}

.error-message {
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
  display: block;
}

.vk-auth-btn {
  width: 100%;
  background: #0077ff !important;
  margin-bottom: 1rem;
  padding: 0.75rem;
}

.vk-btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
}

.vk-logo {
  width: 20px;
  height: 20px;
  object-fit: contain;
}
</style>