<template>
  <div class="create-event">
    <h1>Создание нового события</h1>
    <div class="form-layout">
      <!-- Левая часть - форма -->
      <div class="form-section">
        <form @submit.prevent="submitEvent">
          <div class="form-group">
            <label>Название</label>
            <input type="text" v-model="event.title" required>
          </div>

          <div class="form-group">
            <label>Тип события</label>
            <input
              type="text"
              v-model="event.type"
              placeholder="Введите тип события"
              required
            >
          </div>

          <div class="form-group">
            <label>Дата и время</label>
            <input 
              type="datetime-local" 
              v-model="event.date"
              required
            >
          </div>

          <div class="form-group">
            <label>Адрес</label>
            <input type="text" v-model="event.address" required>
          </div>

          <div class="form-group">
            <label>Описание</label>
            <textarea v-model="event.description" required></textarea>
          </div>

          <div class="image-upload">
            <label>Изображение</label>
            <div class="upload-controls">
              <input 
                type="file" 
                @change="handleImageUpload"
                accept="image/*"
              >
              <button 
                type="button" 
                @click="clearImage"
                class="clear-btn"
              >
                Очистить
              </button>
            </div>
          </div>

          <button type="submit" class="submit-btn">Создать событие</button>
        </form>
      </div>

      <!-- Правая часть - превью -->
      <div class="preview-section">
        <div class="preview-card">
          <div class="preview-image">
            <img 
              :src="event.image || basedImage" 
              alt="Превью события"
            >
            <div class="event-overlay">
              <div class="preview-header">
                <span class="preview-type">{{ eventTypeLabel }}</span>
                <h3 class="preview-title">{{ event.title }}</h3>
              </div>
              
              <div class="preview-details">
                <div class="detail-item">
                  <span class="detail-label">Дата и время</span>
                  <span class="detail-value">{{ formattedDate }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">Место</span>
                  <span class="detail-value">{{ event.address }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import basedImage from '@/assets/based_image.jpg';

export default {
  data() {
    return {
      basedImage: basedImage,
      event: {
        title: '',
        type: '',
        date: '',
        address: '',
        description: '',
        image: null
      }
    }
  },
  computed: {
    formattedDate() {
      if (!this.event.date) return 'Дата не указана';
      
      const date = new Date(this.event.date);
      const options = {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      };
      
      return date.toLocaleDateString('ru-RU', options)
        .replace(' г.', '')
        .replace(',', '');
    },
    eventTypeLabel() {
      // Возвращает введенное значение или стандартные варианты
      return {
        meetup: 'Митап',
        conference: 'Конференция'
      }[this.event.type.toLowerCase()] || this.event.type;
    }
  },
  methods: {
    handleImageUpload(e) {
      const file = e.target.files[0]
      if (file) {
        this.event.image = URL.createObjectURL(file)
      }
    },
    clearImage() {
      this.event.image = null
    },
    submitEvent() {
      console.log('Событие создано:', this.event)
    }
  }
}
</script>

<style scoped>
/* Все стили остаются без изменений из предыдущей версии */
.create-event {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.form-layout {
  display: flex;
  gap: 3rem;
  margin-top: 2rem;
}

.form-section {
  flex: 1;
  max-width: 600px;
}

.preview-section {
  flex: 1;
  max-width: 500px;
  position: sticky;
  top: 1rem;
  align-self: flex-start;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #2c3e50;
}

input,
textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

input:focus,
textarea:focus {
  outline: none;
  border-color: #007bff;
}

textarea {
  height: 120px;
  resize: vertical;
}

.image-upload {
  margin: 2rem 0;
}

.upload-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.clear-btn {
  background: #dc3545;
  color: white;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.3s;
}

.clear-btn:hover {
  background: #c82333;
}

.submit-btn {
  width: 100%;
  padding: 1rem;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s;
}

.submit-btn:hover {
  background: #218838;
}

.preview-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.preview-image {
  position: relative;
  height: 400px;
}

.preview-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
}

.event-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 1.5rem;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.8));
  color: white;
}

.preview-header {
  margin-bottom: 1.5rem;
}

.preview-type {
  display: block;
  font-size: 1.1rem;
  color: #ffffffcc;
  margin-bottom: 0.5rem;
}

.preview-title {
  margin: 0;
  font-size: 1.8rem;
  line-height: 1.3;
}

.preview-details {
  display: grid;
  gap: 1rem;
  margin-top: 2rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  padding: 0.8rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
}

.detail-label {
  color: #ffffffcc;
  font-size: 0.9rem;
}

.detail-value {
  font-weight: 500;
}

@media (max-width: 1024px) {
  .form-layout {
    flex-direction: column;
  }

  .form-section,
  .preview-section {
    max-width: 100%;
  }

  .preview-section {
    position: static;
  }
}
</style>