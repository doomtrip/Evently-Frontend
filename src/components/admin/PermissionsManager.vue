<template>
  <div class="permissions-manager">
    <div class="manager-header">
      <h2>Управление правами доступа</h2>
      <div class="search-control">
        <input 
          type="text" 
          placeholder="Поиск по имени или email..." 
          v-model="searchQuery"
        >
      </div>
    </div>

    <!-- Пагинация -->
    <div class="pagination-controls">
      <div class="page-size-selector">
        <span>Показывать по:</span>
        <select v-model="itemsPerPage">
          <option v-for="option in pageSizeOptions" :value="option">{{ option }}</option>
        </select>
      </div>
      
      <div class="page-navigation">
        <button 
          @click="currentPage--" 
          :disabled="currentPage === 1"
        >
          Назад
        </button>
        <span>Страница {{ currentPage }} из {{ totalPages }}</span>
        <button 
          @click="currentPage++" 
          :disabled="currentPage >= totalPages"
        >
          Вперед
        </button>
      </div>
    </div>

    <div class="permissions-table">
      <table>
        <thead>
          <tr>
            <th>Пользователь</th>
            <th>Текущая роль</th>
            <th>Новая роль</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.id"
            class="user-row"
          >
            <td>{{ user.name }} ({{ user.email }})</td>
            <td>
              <span class="current-role">
                {{ formatRole(user.role) }}
              </span>
            </td>
            <td>
              <select 
                v-model="user.newRole" 
                class="role-selector"
              >
                <option value="user">Пользователь</option>
                <option value="admin">Администратор</option>
              </select>
            </td>
            <td>
              <button 
                @click="savePermissions(user)"
                class="save-btn"
              >
                Сохранить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div 
      v-if="showNotification" 
      class="notification"
    >
      Изменения успешно сохранены!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchQuery: '',
      showNotification: false,
      currentPage: 1,
      itemsPerPage: 15,
      pageSizeOptions: [15, 30, 75, 150],
      users: [
        {
          id: 1,
          name: 'Admin User',
          email: 'admin@example.com',
          role: 'admin',
          newRole: 'admin'
        },
        {
          id: 2,
          name: 'Test User',
          email: 'user@example.com',
          role: 'user',
          newRole: 'user'
        }
        // ... другие пользователи ...
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    },
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredUsers.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredUsers.length / this.itemsPerPage)
    }
  },
  watch: {
    itemsPerPage() {
      this.currentPage = 1
    },
    searchQuery() {
      this.currentPage = 1
    }
  },
  methods: {
    formatRole(role) {
      const roles = {
        admin: 'Администратор',
        user: 'Пользователь'
      }
      return roles[role]
    },
    savePermissions(user) {
      user.role = user.newRole
      this.showNotification = true
      setTimeout(() => this.showNotification = false, 2000)
    }
  }
}
</script>

<style scoped>
.manager-header {
  margin-bottom: 2rem;
}

.search-control input {
  width: 300px;
  padding: 0.5rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1rem 0;
  padding: 0.5rem 0;
}

.page-size-selector select {
  margin-left: 0.5rem;
  padding: 0.25rem;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.page-navigation button {
  margin: 0 0.5rem;
  padding: 0.5rem 1rem;
  border: 1px solid #007bff;
  border-radius: 4px;
  background: #007bff;
  color: white;
  cursor: pointer;
}

.page-navigation button:disabled {
  background: #6c757d;
  border-color: #6c757d;
  cursor: not-allowed;
}

.permissions-table {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  overflow: hidden;
}

table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 1rem;
  border-bottom: 1px solid #dee2e6;
  text-align: left;
}

.current-role {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: #e9ecef;
}

.role-selector {
  padding: 0.5rem;
  border: 1px solid #007bff;
  border-radius: 4px;
}

.save-btn {
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem 2rem;
  background: #28a745;
  color: white;
  border-radius: 8px;
  animation: slideIn 0.3s ease;
}

@keyframes slideIn {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}
</style>