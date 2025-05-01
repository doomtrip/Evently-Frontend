<template>
  <div class="search-wrapper">
    <input 
      type="text" 
      v-model="query" 
      @input="handleSearch" 
      placeholder="Поиск событий..."
    >
    <div v-if="results.length" class="dropdown">
      <div 
        v-for="event in results" 
        :key="event.id"
        @click="navigateToEvent(event.id)"
      >
        {{ event.title }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['events'],
  data() {
    return {
      query: '',
      results: []
    }
  },
  methods: {
    handleSearch() {
      this.results = this.events.filter(event => 
        event.title.toLowerCase().includes(this.query.toLowerCase())
      ).slice(0, 5);
    },
    navigateToEvent(id) { /* ... */ }
  }
}
</script>