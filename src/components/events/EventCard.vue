<template>
  <div class="event-card" @click="goToEvent">
    <div class="card-image">
      <img :src="event.image || defaultImage" :alt="event.title">
      <div class="event-badge">{{ eventType }}</div>
    </div>
    <div class="card-content">
      <h3 class="event-title">{{ event.title }}</h3>
      <div class="event-meta">
        <div class="meta-item">
          <i class="pi pi-calendar"></i>
          <span>{{ formattedDate }}</span>
        </div>
        <div class="meta-item">
          <i class="pi pi-map-marker"></i>
          <span>{{ event.address }}</span>
        </div>
      </div>
      <div class="event-footer">
        <span class="price" v-if="event.price">{{ event.price }} ₽</span>
        <button class="details-btn">Подробнее</button>
      </div>
    </div>
  </div>
</template>

<script>
import defaultImage from '@/assets/based_image.jpg'

export default {
  props: {
    event: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      defaultImage
    }
  },
  computed: {
    formattedDate() {
      const date = new Date(this.event.date)
      return date.toLocaleDateString('ru-RU', {
        day: 'numeric',
        month: 'long',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    eventType() {
      const types = {
        concert: 'Концерт',
        exhibition: 'Выставка',
        festival: 'Фестиваль',
        lecture: 'Лекция'
      }
      return types[this.event.type] || this.event.type
    }
  },
  methods: {
    goToEvent() {
      this.$router.push({ name: 'Event', params: { id: this.event.id } })
    }
  }
}
</script>

<style scoped>
/* Все стили остаются без изменений */
.event-card {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  background: white;
  cursor: pointer;
}

.event-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.card-image {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.event-card:hover .card-image img {
  transform: scale(1.05);
}

.event-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
}

.card-content {
  padding: 16px;
}

.event-title {
  margin: 0 0 12px;
  font-size: 18px;
  font-weight: 600;
  color: #333;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.event-meta {
  margin-bottom: 16px;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.meta-item i {
  margin-right: 8px;
  font-size: 16px;
}

.event-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid #eee;
}

.price {
  font-weight: 600;
  color: #333;
}

.details-btn {
  background: #2196F3;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.3s;
}

.details-btn:hover {
  background: #0d8aee;
}
</style>