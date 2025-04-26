<template>
  <div class="user-events">
    <EventList 
      title="Мои события"
      :show-filters="true"
      :initial-filter="'my'"
    />
  </div>
</template>

<script>
import EventList from '@/components/events/EventList.vue'

export default {
  components: { EventList }
}
</script>

<style scoped>
.user-events {
  padding: 2rem;
}
</style>