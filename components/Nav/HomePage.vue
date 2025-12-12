<template>
  <section class="hero-container">
    <!-- HERO IMAGE -->
    <img 
      src="/img/HEROBG2.png"
      alt="BAP Federation Hero"
      class="w-full h-full object-cover"
    />

    <!-- Optional dark overlay -->
    <div class="overlay"></div>
  </section>
</template>

<script setup>
</script>

<style scoped>
.hero-container {
  position: relative;
  width: 100%;
  height: 100vh;          /* 🔥 Full page height */
  overflow: hidden;        /* Prevent scrolling inside the section */
}

.hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;       /* 🔥 Always covers the whole screen */
  object-position: center;
}

.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1); /* optional dark overlay */
}
</style>
