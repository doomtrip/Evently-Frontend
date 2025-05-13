<template>
  <div class="events-container">
    <div class="events-header">
     <h2 v-if="title">{{ title }}</h2>
      <div class="filters" v-if="showFilters">
        <button
          v-for="filter in availableFilters"
          :key="filter.value"
          :class="{ active: currentFilter === filter.value }"
          @click="setFilter(filter.value)"
          :data-filter="filter.value"
        >
          {{ filter.label }}
        </button>
      </div>
    </div>

    <div class="events-grid">
      <EventCard 
        v-for="event in filteredEvents" 
        :key="event.id" 
        :event="event"
        @click="goToEvent(event.id)"
      />
    </div>

    <div 
      class="load-more" 
      v-if="showLoadMore && hasMore"
    >
      <button @click="loadMore">
        Показать еще
      </button>
    </div>
    
    <div 
      v-if="filteredEvents.length === 0"
      class="no-events"
    >
      <p>Событий не найдено</p>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EventCard from './EventCard.vue'

export default {
  components: { EventCard },
  props: {
    title: {
      type: String,
      default: 'События'
    },
    showFilters: {
      type: Boolean,
      default: false
    },
    perPage: {
      type: Number,
      default: 4
    },
    events: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1,
      currentFilter: 'all'
    }
  },
  computed: {
    ...mapState(['user']),
    availableFilters() {
      const baseFilters = [
        { value: 'all', label: 'Все' },
        { value: 'past', label: 'Прошедшие' }
      ]
      if (this.user) {
        baseFilters.splice(1, 0, { 
          value: 'my', 
          label: 'Мои события' 
        })
      }
      return baseFilters
    },
    filteredEvents() {
      const now = new Date()
      
      // Создаем копию событий и сортируем их
      let events = [...this.events]
        .map(e => ({ ...e, dateObj: new Date(e.date) })) // Добавляем объект даты
        .sort((a, b) => a.dateObj - b.dateObj) // Сортировка по возрастанию даты

      // Разделяем на предстоящие и завершенные
      const upcoming = events.filter(e => e.dateObj >= now)
      const past = events.filter(e => e.dateObj < now).reverse() // Реверсируем завершенные

      // Объединяем в правильном порядке
      const orderedEvents = [...upcoming, ...past]

      // Применяем фильтры
      let filtered = orderedEvents
      switch(this.currentFilter) {
        case 'my':
          filtered = filtered.filter(e => e.isMine)
          break
        case 'past':
          filtered = filtered.filter(e => e.dateObj < now)
          break
      }

      // Пагинация
      return filtered.slice(0, this.currentPage * this.perPage)
    },
    hasMore() {
      return this.filteredEvents.length < this.events.length
    },
    showLoadMore() {
      return this.perPage < this.events.length
    }
  },
  methods: {
    setFilter(filter) {
      this.currentFilter = filter
      this.currentPage = 1
      this.$emit('filter-change', filter)
    },
    loadMore() {
      this.currentPage++
    },
    goToEvent(id) {
      this.$router.push(`/event/${id}`)
    }
  }
}
</script>

<style scoped>
.no-events {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
  font-size: 1.2rem;
}

.events-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem;
}

.events-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  display: flex;
  gap: 1rem;
}

.filters button {
  padding: 0.5rem 1.5rem;
  border: 1px solid #ddd;
  border-radius: 20px;
  background: none;
  cursor: pointer;
  transition: all 0.3s;
}

.filters button.active {
  background: #007bff;
  border-color: #007bff;
  color: #fff;
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

.load-more {
  margin-top: 2rem;
  text-align: center;
}

.load-more button {
  padding: 0.75rem 1.5rem;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.3s;
}

.load-more button:hover {
  background: #0056b3;
}

@media (max-width: 768px) {
  .events-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  
  .filters {
    flex-wrap: wrap;
  }
}
</style>