<template>
  <div class="events-container">
    <div class="events-header">
      <h2>{{ title }}</h2>
      <div class="filters" v-if="showFilters">
        <button
          v-for="filter in filters"
          :key="filter.value"
          :class="{ active: currentFilter === filter.value }"
          @click="setFilter(filter.value)"
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

    <div class="load-more" v-if="showLoadMore && hasMore">
      <button @click="loadMore">
        Показать еще
      </button>
    </div>
  </div>
</template>

<script>
import EventCard from './EventCard.vue'
import { eventsData } from './eventsData'

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
    }
  },
  data() {
    return {
      events: eventsData,
      currentPage: 1,
      currentFilter: 'all',
      filters: [
        { value: 'all', label: 'Все' },
        { value: 'my', label: 'Мои события' },
        { value: 'visited', label: 'Посещенные' }
      ]
    }
  },
  computed: {
    filteredEvents() {
      let events = [...this.events]
      
      if (this.currentFilter === 'my') {
        events = events.filter(e => e.isMine)
      } else if (this.currentFilter === 'visited') {
        events = events.filter(e => e.isVisited)
      }
      
      return events.slice(0, this.currentPage * this.perPage)
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