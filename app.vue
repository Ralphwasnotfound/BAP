<template>
  <NuxtLayout>
    <NuxtPage />
    <Toast ref="toast" 
    />
  </NuxtLayout>
</template>

<script>
import Toast from './components/Toast.vue';

export default {
  components: {
    Toast
  }
}

</script>

<script setup>

useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap"
    }
  ]
})
</script>
