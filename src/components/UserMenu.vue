<template>
  <div class="user-menu">
    <img
      :src="userAvatar"
      class="user-avatar"
      @click="toggleMenu"
    >
    
    <Menu 
      ref="menu"
      :model="menuItems"
      :popup="true"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import Menu from 'primevue/menu'
import defaultAvatar from '@/assets/default-avatar.png'

const router = useRouter()
const store = useStore()
const menu = ref(null)

const userAvatar = computed(() => {
  return store.state.user?.avatar || defaultAvatar
})

const menuItems = computed(() => {
  const items = [
    {
      label: 'Настройки профиля',
      icon: 'pi pi-cog',
      command: () => {
        if (store.state.user?.role === 'admin') {
          router.push({ name: 'AdminProfile' })
        } else {
          router.push({ name: 'UserProfile' }) // Исправлено имя маршрута
        }
      }
    },
    {
      label: 'Выход',
      icon: 'pi pi-sign-out',
      command: () => {
        store.dispatch('logout')
        router.push('/')
      }
    }
  ]
  return items
})

const toggleMenu = (event) => {
  menu.value.toggle(event)
}
</script>

<style scoped>
.user-menu {
  position: relative;
  display: flex;
  align-items: center;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  border: 2px solid #fff;
  transition: transform 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.1);
}

::v-deep(.p-menu) {
  width: 200px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border: none;
}

::v-deep(.p-menuitem-link) {
  padding: 12px 16px;
}
</style>