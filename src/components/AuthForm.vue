<template>
  <div class="auth-container">
    <div class="form-section">
      <div class="header">
        <img src="@/assets/logo.png" alt="Evently Logo" class="logo" />
        <h1 class="title">Evently</h1>
      </div>

      <h2 class="form-title">{{ isRegistering ? 'Регистрация' : 'Авторизация' }}</h2>

      <div v-if="errorMessage" class="global-error">
        {{ errorMessage }}
      </div>



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
            class="submit-btn"
            :disabled="isRegistering && (invalidPassword || passwordMismatch || invalidEmail) || isLoading"
          >
            <span v-if="!isLoading">
              {{ isRegistering ? 'Зарегистрироваться' : 'Войти' }}
            </span>
            <i v-else class="pi pi-spinner pi-spin"></i>
          </Button>

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
              :disabled="isLoading"
            >
              {{ isRegistering ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Создать' }}
            </button>
            <button 
              class="return-link"
              @click="$router.push('/')"
            >
              Вернуться на главную
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>


<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import userImg from '@/assets/user.png';

const router = useRouter();
const store = useStore();

// Состояния формы
const isRegistering = ref(false);
const currentEmail = ref('');
const currentPassword = ref('');
const registerEmail = ref('');
const registerConfirmPassword = ref('');

// Тестовые данные
const testCredentials = {
  admin: { login: 'admin', password: 'admin' },
  user: { login: 'user', password: 'user' }
};

// Трекеры взаимодействия
const emailTouched = ref(false);
const passwordTouched = ref(false);
const confirmTouched = ref(false);

// Состояния загрузки и ошибок
const isLoading = ref(false);
const errorMessage = ref('');

// Валидации
const invalidPassword = computed(() => {
  const password = currentPassword.value;
  return isRegistering.value && (
    password.length < 8 ||
    !/[A-Za-z0-9]/.test(password)
  );
});

const invalidEmail = computed(() => {
  return isRegistering.value && 
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.value);
});

const passwordMismatch = computed(() => 
  isRegistering.value && 
  currentPassword.value !== registerConfirmPassword.value
);

// Заполнение тестовых данных
const fillTestCredentials = (type) => {
  currentEmail.value = testCredentials[type].login;
  currentPassword.value = testCredentials[type].password;
};

// Обработчик формы
const handleSubmit = async () => {
  if (isRegistering.value && (invalidPassword.value || passwordMismatch.value || invalidEmail.value)) return;
  
  try {
    isLoading.value = true;
    errorMessage.value = '';

    if (isRegistering.value) {
      // Логика регистрации
      const newUser = {
        login: currentEmail.value,
        email: registerEmail.value,
        password: currentPassword.value,
        role: 'user',
        avatar: userImg
      };
      
      // Сохраняем в localStorage
      localStorage.setItem('users', JSON.stringify([
        ...JSON.parse(localStorage.getItem('users') || '[]'),
        newUser
      ]));
      
      // Автоматическая авторизация
      store.commit('setUser', newUser);
      router.push('/');
    } else {
      // Логика авторизации
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => 
        (u.login === currentEmail.value || u.email === currentEmail.value) &&
        u.password === currentPassword.value
      );

      if (!user) {
        // Проверка тестовых аккаунтов
        if (currentEmail.value === testCredentials.admin.login && 
            currentPassword.value === testCredentials.admin.password) {
          store.commit('setUser', {
            ...testCredentials.admin,
            role: 'admin',
            avatar: userImg
          });
          return router.push('/admin');
        }
        
        if (currentEmail.value === testCredentials.user.login && 
            currentPassword.value === testCredentials.user.password) {
          store.commit('setUser', {
            ...testCredentials.user,
            role: 'user',
            avatar: userImg
          });
          return router.push('/');
        }
        
        throw new Error('Неверные учетные данные');
      }

      store.commit('setUser', user);
      router.push(user.role === 'admin' ? '/admin' : '/');
    }
  } catch (error) {
    errorMessage.value = error.message;
  } finally {
    isLoading.value = false;
  }
};

const handleVKAuth = async () => {
  errorMessage.value = 'Авторизация через ВК временно недоступна';
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
  display: flex;
  justify-content: center;
  align-items: center;
}

.global-error {
  color: #ef4444;
  text-align: center;
  margin-bottom: 1rem;
  padding: 0.5rem;
  border: 1px solid #ef4444;
  border-radius: 4px;
  background: #fee2e2;
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
  margin: 1.5rem 0;
  display: block;
  width: 100%;
}

.vk-auth-btn {
  width: 100%;
  background: #0077ff !important;
  margin-bottom: 1rem;
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

.return-link {
  color: #64748b;
  text-decoration: none;
  font-size: 0.9rem;
  display: block;
  margin-top: 1rem;
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

.pi-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.test-users {
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.test-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.3s;
}

.admin-btn {
  background: #007bff;
  color: white;
}

.user-btn {
  background: #28a745;
  color: white;
}

.test-btn:hover {
  opacity: 0.9;
}

.return-link {
  display: inline-block;
  margin-top: 1rem;
  padding: 8px 16px;
  color: black;
  text-decoration: none;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  transition: all 0.3s;
  cursor: pointer;
}

.return-link:hover {
  background: #3b82f6;
  color: white;
}
</style>