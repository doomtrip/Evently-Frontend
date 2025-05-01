<template>
  <div class="users-list">
    <div class="controls">
      <input 
        type="text" 
        placeholder="Поиск пользователя" 
        v-model="searchQuery"
      >
      <button @click="exportToExcel" class="export-btn">
        Выгрузить в Excel
      </button>
    </div>

    <table class="users-table">
      <thead>
        <tr>
          <th>Логин</th>
          <th>Email</th>
          <th>Роль</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr 
          v-for="user in filteredUsers" 
          :key="user.id"
          :class="{ 'blocked-user': user.blocked }"
        >
          <td>{{ user.login }}</td>
          <td>{{ user.email }}</td>
          <td>
            <span class="role-label">
              {{ formatRole(user.role) }}
            </span>
          </td>
          <td>
            <span class="status-badge">
              {{ user.blocked ? 'Заблокирован' : 'Активен' }}
            </span>
          </td>
          <td>
            <button 
              @click="toggleUserBlock(user)" 
              class="block-btn"
              :class="{ 'unblock-btn': user.blocked }"
            >
              {{ user.blocked ? 'Разблокировать' : 'Заблокировать' }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import * as XLSX from 'xlsx'

export default {
  data() {
    return {
      searchQuery: '',
      users: [
        {
          id: 1,
          login: 'admin',
          email: 'admin@example.com',
          role: 'admin',
          blocked: false
        },
        {
          id: 2,
          login: 'user',
          email: 'user@example.com',
          role: 'user',
          blocked: false
        }
      ]
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => 
        user.login.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    formatRole(role) {
      const roles = {
        admin: 'Администратор',
        moderator: 'Модератор',
        user: 'Пользователь'
      }
      return roles[role] || role
    },
    toggleUserBlock(user) {
      user.blocked = !user.blocked
      console.log(
        `Пользователь ${user.login} ${user.blocked ? 'заблокирован' : 'разблокирован'}`
      )
    },
    exportToExcel() {
      const data = this.users.map(user => ({
        Логин: user.login,
        Email: user.email,
        Роль: this.formatRole(user.role),
        Статус: user.blocked ? 'Заблокирован' : 'Активен'
      }))

      const worksheet = XLSX.utils.json_to_sheet(data)
      const workbook = XLSX.utils.book_new()
      XLSX.utils.book_append_sheet(workbook, worksheet, "Пользователи")
      
      XLSX.writeFile(workbook, 'users.xlsx', {
        bookType: 'xlsx',
        type: 'array'
      })
    }
  }
}
</script>

<style scoped>
.controls {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.export-btn {
  background: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.export-btn:hover {
  background: #218838;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th,
.users-table td {
  padding: 1rem;
  border: 1px solid #dee2e6;
  text-align: left;
}

.role-label {
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  background: #e9ecef;
}

.block-btn {
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.unblock-btn {
  background: #17a2b8;
}

.blocked-user {
  background: #ffe5e5;
  opacity: 0.7;
}

.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  background: #e9ecef;
}
</style>