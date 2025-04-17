<template>
  <div class="permissions-manager">
    <div class="controls">
      <input 
        type="text" 
        placeholder="Поиск пользователя" 
        v-model="searchQuery"
      >
    </div>

    <table>
      <thead>
        <tr>
          <th>Пользователь</th>
          <th>Роль</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.name }} ({{ user.email }})</td>
          <td>
            <select v-model="user.role">
              <option value="user">Пользователь</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Администратор</option>
            </select>
          </td>
          <td>
            <button @click="saveChanges(user)">Сохранить</button>
            <button @click="resetRole(user)">Сбросить</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="notification" v-if="showNotification">
      Изменения успешно сохранены!
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      users: [], // Данные с API
      searchQuery: '',
      showNotification: false
    }
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => 
        user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
      )
    }
  },
  methods: {
    saveChanges(user) {
      // API запрос на обновление роли
      this.showNotification = true
      setTimeout(() => this.showNotification = false, 2000)
    },
    resetRole(user) {
      user.role = 'user'
    }
  }
}
</script>

<style scoped>
.permissions-manager {
  max-width: 800px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

th, td {
  padding: 1rem;
  border: 1px solid #ddd;
  text-align: left;
}

select {
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ddd;
}

.notification {
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: 1rem;
  background: #4CAF50;
  color: white;
  border-radius: 4px;
}
</style>