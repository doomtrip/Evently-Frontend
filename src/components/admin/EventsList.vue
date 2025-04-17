<template>
  <div class="events-list">
    <div class="filters">
      <button 
        v-for="filter in filters" 
        :key="filter"
        :class="{ active: currentFilter === filter }"
        @click="currentFilter = filter"
      >
        {{ filter }}
      </button>
    </div>

    <div class="events-table">
      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата и время</th>
            <th>Место</th>
            <th>Тип</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="event in filteredEvents" :key="event.id">
            <td>{{ event.title }}</td>
            <td>{{ formatDateTime(event.date) }}</td>
            <td>{{ event.location }}</td>
            <td>{{ event.type }}</td>
            <td>
              <button @click="editEvent(event)">Редактировать</button>
              <button @click="deleteEvent(event.id)">Удалить</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="pagination" v-if="totalPages > 1">
      <button 
        v-for="page in totalPages" 
        :key="page"
        @click="currentPage = page"
        :class="{ active: currentPage === page }"
      >
        {{ page }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentFilter: 'Все',
      filters: ['Все', 'Мои события', 'Посещенные'],
      events: [], // Данные с API
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    filteredEvents() {
      // Фильтрация и пагинация
      return this.events
        .filter(event => this.applyFilter(event))
        .slice((this.currentPage - 1) * this.itemsPerPage, this.currentPage * this.itemsPerPage)
    },
    totalPages() {
      return Math.ceil(this.events.length / this.itemsPerPage)
    }
  },
  methods: {
    formatDateTime(date) {
      return new Date(date).toLocaleString()
    },
    applyFilter(event) {
      // Логика фильтрации
    },
    editEvent(event) {
      // Переход к редактированию
    },
    deleteEvent(id) {
      // Удаление события
    }
  }
}
</script>

<style scoped>
.filters button {
  margin-right: 1rem;
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
}

.filters button.active {
  background: #007bff;
  color: white;
}

.events-table table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th, 
.events-table td {
  padding: 1rem;
  border: 1px solid #ddd;
  text-align: left;
}
</style>