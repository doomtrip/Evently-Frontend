<template>
  <div class="events-list">
    <div class="header-section">
      <h2>Управление событиями</h2>
      <div class="filters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="{ 'active-filter': currentFilter === filter.value }"
          @click="setFilter(filter.value)"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="events-table-container">
      <table class="events-table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Дата проведения</th>
            <th>Место</th>
            <th>Тип</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="event in filteredEvents" 
            :key="event.id"
            class="event-row"
          >
            <td>{{ event.title }}</td>
            <td>{{ formatEventDate(event.date) }}</td>
            <td>{{ event.address }}</td>
            <td>
              <span class="event-type-badge">
                {{ eventTypeLabel(event.type) }}
              </span>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  @click="editEvent(event)"
                  class="edit-btn"
                >
                  <i class="pi pi-pencil"></i>
                </button>
                <button 
                  @click="deleteEvent(event.id)"
                  class="delete-btn"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { eventsData } from '@/components/events/eventsData'

export default {
  data() {
    return {
      events: eventsData,
      currentFilter: 'all',
      filters: [
        { value: 'all', label: 'Все события' },
        { value: 'my', label: 'Мои события' }
      ]
    }
  },
  computed: {
    filteredEvents() {
      return this.currentFilter === 'my' 
        ? this.events.filter(e => e.isMine)
        : this.events
    }
  },
  methods: {
    formatEventDate(dateString) {
      const options = { 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
      return new Date(dateString).toLocaleDateString('ru-RU', options)
    },
    eventTypeLabel(type) {
      const labels = {
        meetup: 'Митап',
        conference: 'Конференция',
        workshop: 'Воркшоп'
      }
      return labels[type.toLowerCase()] || type
    },
    setFilter(filter) {
      this.currentFilter = filter
    },
    editEvent(event) {
      this.$router.push({
        name: 'CreateEvent',
        params: { id: event.id },
        state: { eventData: event }
      })
    },
    deleteEvent(id) {
      this.events = this.events.filter(event => event.id !== id)
      eventsData = this.events
    }
  }
}
</script>

<style scoped>
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters button {
  padding: 0.5rem 1.5rem;
  margin-left: 1rem;
  border: 1px solid #dee2e6;
  border-radius: 20px;
  background: none;
  cursor: pointer;
}

.active-filter {
  background: #007bff !important;
  color: white !important;
  border-color: #007bff !important;
}

.events-table {
  width: 100%;
  border-collapse: collapse;
}

.events-table th,
.events-table td {
  padding: 1rem;
  border: 1px solid #dee2e6;
  text-align: left;
}

.event-type-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  background: #e9ecef;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.edit-btn {
  background: #17a2b8;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
}

.delete-btn {
  background: #dc3545;
  color: white;
  padding: 0.5rem;
  border: none;
  border-radius: 4px;
}

.pi {
  font-size: 1rem;
}
</style>