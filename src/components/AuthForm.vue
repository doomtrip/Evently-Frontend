<template>
  <div class="auth-container">
    <div class="form-section">
      <div class="header">
        <img src="@/assets/logo.png" alt="Evently Logo" class="logo" />
        <h1 class="title">Evently</h1>
      </div>

      <h2 class="form-title">
        {{ isRecovering ? 'Восстановление пароля' 
          : isRegistering ? 'Регистрация' 
          : 'Авторизация' }}
      </h2>

      <div v-if="errorMessage" class="global-error">
        {{ errorMessage }}
      </div>

      <form @submit.prevent="handleSubmit" class="auth-form" v-if="!isRecovering">
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

          <button 
            v-if="!isRegistering && !isRecovering"
            class="forgot-password" 
            @click="isRecovering = true"
          >
            Забыли пароль?
          </button>

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

      <form @submit.prevent="handlePasswordRecovery" class="auth-form" v-else>
        <div class="form-group">
          <template v-if="!codeSent && !codeVerified">
            <InputText
              v-model="recoverEmail"
              placeholder="Введите вашу почту"
              type="email"
              class="custom-input"
              :class="{ 'input-error': emailRecoverTouched && invalidRecoverEmail }"
              @blur="emailRecoverTouched = true"
            />
            <small class="email-example">Пример: user@example.com</small>
            <Button 
              type="submit" 
              class="submit-btn"
              :disabled="invalidRecoverEmail || isLoading"
            >
              Отправить код
            </Button>
          </template>

          <template v-if="codeSent && !codeVerified">
            <InputText
              v-model="recoveryCode"
              placeholder="Введите код из письма"
              class="custom-input"
              :class="{ 'input-error': codeTouched && invalidCode }"
              @blur="codeTouched = true"
            />
            <Button 
              type="submit" 
              class="submit-btn"
              :disabled="isLoading"
              @click="verifyCode"
            >
              Подтвердить код
            </Button>
          </template>

          <template v-if="codeVerified">
            <InputText
              v-model="newPassword"
              placeholder="Новый пароль"
              type="password"
              class="custom-input"
              :class="{ 'input-error': newPassTouched && invalidNewPassword }"
              @blur="newPassTouched = true"
            />
            <small 
              v-if="newPassTouched && invalidNewPassword" 
              class="error-message"
            >
              Пароль должен содержать минимум 8 символов и хотя бы одну цифру или букву
            </small>

            <InputText
              v-model="confirmNewPassword"
              placeholder="Повторите пароль"
              type="password"
              class="custom-input"
              :class="{ 'input-error': confirmNewTouched && passwordMismatchNew }"
              @blur="confirmNewTouched = true"
            />
            <small 
              v-if="confirmNewTouched && passwordMismatchNew" 
              class="error-message"
            >
              Пароли не совпадают
            </small>

            <Button 
              type="submit" 
              class="submit-btn"
              :disabled="invalidNewPassword || passwordMismatchNew || isLoading"
              @click="updatePassword"
            >
              Сохранить пароль
            </Button>
          </template>

          <div class="auth-actions">
            <button 
              class="switch-mode" 
              @click="isRecovering = false"
              :disabled="isLoading"
            >
              Вернуться к авторизации
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

const isRegistering = ref(false);
const isRecovering = ref(false);
const currentEmail = ref('');
const currentPassword = ref('');
const registerEmail = ref('');
const registerConfirmPassword = ref('');

const recoverEmail = ref('');
const recoveryCode = ref('');
const newPassword = ref('');
const confirmNewPassword = ref('');
const codeSent = ref(false);
const codeVerified = ref(false);

const testCredentials = {
  admin: { login: 'admin', password: 'admin' },
  user: { login: 'user', password: 'user' }
};

const emailTouched = ref(false);
const passwordTouched = ref(false);
const confirmTouched = ref(false);
const emailRecoverTouched = ref(false);
const codeTouched = ref(false);
const newPassTouched = ref(false);
const confirmNewTouched = ref(false);

const isLoading = ref(false);
const errorMessage = ref('');

const invalidPassword = computed(() => {
  const password = currentPassword.value;
  return isRegistering.value && (
    password.length < 8 ||
    !/[A-Za-z0-9]/.test(password)
  );
});

const invalidEmail = computed(() => 
  isRegistering.value && 
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(registerEmail.value)
);

const passwordMismatch = computed(() => 
  isRegistering.value && 
  currentPassword.value !== registerConfirmPassword.value
);

const invalidRecoverEmail = computed(() => 
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recoverEmail.value)
);

const invalidCode = computed(() => 
  recoveryCode.value !== '0000'
);

const invalidNewPassword = computed(() => 
  newPassword.value.length < 8 || 
  !/[A-Za-z0-9]/.test(newPassword.value)
);

const passwordMismatchNew = computed(() => 
  newPassword.value !== confirmNewPassword.value
);

const handleSubmit = async () => {
  if (isRegistering.value && (invalidPassword.value || passwordMismatch.value || invalidEmail.value)) return;
  
  try {
    isLoading.value = true;
    errorMessage.value = '';

    if (isRegistering.value) {
      const newUser = {
        login: currentEmail.value,
        email: registerEmail.value,
        password: currentPassword.value,
        role: 'user',
        avatar: userImg
      };
      
      localStorage.setItem('users', JSON.stringify([
        ...JSON.parse(localStorage.getItem('users') || '[]'),
        newUser
      ]));
      
      store.commit('setUser', newUser);
      router.push('/');
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => 
        (u.login === currentEmail.value || u.email === currentEmail.value) &&
        u.password === currentPassword.value
      );

      if (!user) {
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

const handlePasswordRecovery = async () => {
  try {
    if (!codeSent.value) {
      if (recoverEmail.value === 'user@example.com') {
        codeSent.value = true;
        errorMessage.value = 'Код 0000 отправлен на вашу почту';
        return;
      }

      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const emailExists = users.some(u => u.email === recoverEmail.value);
      
      if (!emailExists) throw new Error('Пользователь с такой почтой не найден');
      
      codeSent.value = true;
      errorMessage.value = 'Код 0000 отправлен на вашу почту';
    }
  } catch (error) {
    errorMessage.value = error.message;
  }
};

const verifyCode = () => {
  if (recoveryCode.value === '0000') {
    codeVerified.value = true;
    errorMessage.value = '';
  } else {
    errorMessage.value = 'Неверный код подтверждения';
  }
};

const updatePassword = () => {
  try {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex(u => 
      u.email === recoverEmail.value || u.email === 'user@example.com'
    );
    
    if (userIndex === -1) throw new Error('Ошибка обновления пароля');
    
    users[userIndex].password = newPassword.value;
    localStorage.setItem('users', JSON.stringify(users));
    errorMessage.value = 'Пароль успешно изменен!';
    setTimeout(() => {
      isRecovering.value = false;
      router.push('/');
    }, 2000);
  } catch (error) {
    errorMessage.value = error.message;
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

.forgot-password {
  color: #3b82f6;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  margin: -0.5rem 0 1rem;
  font-size: 0.9rem;
  width: 100%;
  text-align: right;
  transition: opacity 0.3s;
}

.forgot-password:hover {
  opacity: 0.8;
}

.email-example {
  display: block;
  color: #64748b;
  font-size: 0.8rem;
  margin: -0.5rem 0 1rem;
  text-align: left;
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