import axios from 'axios';

// Создаем экземпляр axios с базовыми настройками
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Добавляем интерцептор для автоматической вставки токена
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default {
  /**
   * Регистрация нового пользователя
   * @param {Object} userData - Данные пользователя
   * @returns {Promise}
   */
  async register(userData) {
    try {
      const response = await apiClient.post('/auth/register', {
        login: userData.login,
        email: userData.email,
        password: userData.password
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Авторизация пользователя
   * @param {Object} credentials - Учетные данные
   * @returns {Promise}
   */
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', {
        loginOrEmail: credentials.loginOrEmail,
        password: credentials.password
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  /**
   * Выход из системы
   */
  logout() {
    localStorage.removeItem('authToken');
    delete apiClient.defaults.headers.common['Authorization'];
  },

  /**
   * Проверка аутентификации
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken');
  },

  /**
   * Обновление токена
   * @returns {Promise}
   */
  async refreshToken() {
    try {
      const response = await apiClient.post('/auth/refresh');
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      this.logout();
      throw this.handleError(error);
    }
  },

  /**
   * Обработка ошибок API
   * @param {Error} error - Объект ошибки
   * @returns {String}
   */
  handleError(error) {
    if (error.response) {
      // Сервер ответил с кодом ошибки
      const message = error.response.data?.message || 'Произошла ошибка';
      const status = error.response.status;
      
      switch (status) {
        case 401:
          return 'Неверные учетные данные';
        case 403:
          return 'Доступ запрещен';
        case 409:
          return 'Пользователь уже существует';
        default:
          return message;
      }
    } else if (error.request) {
      // Запрос был сделан, но ответ не получен
      return 'Ошибка соединения с сервером';
    } else {
      // Ошибка при настройке запроса
      return 'Неизвестная ошибка';
    }
  },

  /**
   * Инициализация авторизации через VK
   */
  initVKAuth() {
    window.location.href = `${
      import.meta.env.VITE_API_URL || 'http://localhost:3000'
    }/auth/vk`;
  }
};