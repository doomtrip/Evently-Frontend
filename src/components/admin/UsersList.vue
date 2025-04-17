<template>
  <div class="users-list">
    <div class="controls">
      <input type="text" placeholder="Поиск пользователя" v-model="searchQuery">
      <button @click="exportToExcel">Выгрузить в Excel</button>
    </div>

    <table>
      <thead>
        <tr>
          <th>Имя Фамилия</th>
          <th>Почта</th>
          <th>Логин</th>
          <th>Статус</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in filteredUsers" :key="user.id">
          <td>{{ user.fullName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.login }}</td>
          <td>
            <select v-model="user.role">
              <option value="user">Пользователь</option>
              <option value="moderator">Модератор</option>
              <option value="admin">Администратор</option>
            </select>
          </td>
          <td>
            <button @click="deleteUser(user.id)">Удалить</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>