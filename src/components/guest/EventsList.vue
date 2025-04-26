<template>
  <div class="events-list">
    <div class="events-grid">
      <EventCard 
        v-for="event in events"
        :key="event.id"
        :event="event"
      />
    </div>
  </div>
</template>

<script>
import EventCard from '@/components/EventCard.vue'

export default {
  props: ['events'],
  components: {
    EventCard
  }
}
</script>

<style scoped>
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 1rem;
}
</style>