<template>
  <section class="hero-container">

    <!-- HERO BACKGROUND (ALWAYS VISIBLE) -->
    <img
      src="/img/1.png"
      alt="BAP Federation Hero Background"
      class="hero-bg"
    />

    <!-- DARK OVERLAY -->
    <div class="overlay"></div>

    <!-- DESKTOP LOGO / DESIGN -->
    <img
      src="/img/BAP-2.png"
      alt="BAP Federation Logo"
      class="hero-logo-desktop"
    />

    <!-- MOBILE LOGO (OPTIONAL, SMALL & CLEAN) -->
    <img
      src="/img/BAP-2.png"
      alt="BAP Federation Logo"
      class="hero-logo-mobile"
    />

  </section>
</template>

<script setup>
</script>

<style scoped>
  /* =========================
   HERO WRAPPER
========================= */
.hero-container {
  position: relative;
  width: 100%;
  height: 100svh;
  overflow: hidden;
}

/* =========================
   BACKGROUND
========================= */
.hero-bg {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

/* =========================
   OVERLAY
========================= */
.overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 1;
}

/* =========================
   DESKTOP / DEFAULT LOGO
========================= */
.hero-logo-desktop {
  position: absolute;
  left: 6%;
  top: 50%;
  transform: translateY(-50%);
  width: 38%;
  max-width: 520px;
  z-index: 2;
  filter: drop-shadow(0 0 30px rgba(255, 200, 80, 0.8));
}

/* =========================
   MOBILE LOGO (TOP CENTER)
========================= */
.hero-logo-mobile {
  display: none;
  position: absolute;
  top: 20px; /* 🔥 BELOW NAVBAR */
  left: 50%;
  transform: translateX(-50%);
  width: 500px;
  z-index: 0;
  filter: drop-shadow(0 0 20px rgba(255, 200, 80, 0.7));
}

/* =========================
   TABLETS (768×768)
========================= */
@media (min-width: 768px) and (max-width: 1024px) {
  .hero-logo-desktop {
    left: 3%;
    width: 45%;
    max-width: 480px;
  }

  .hero-logo-mobile {
    display: none;
  }
}

/* =========================
   SMALL LAPTOP / OLD PC (640×480)
========================= */
@media (min-width: 640px) and (max-width: 767px) {
  .hero-logo-desktop {
    left: 2%;
    top: 50%;
    transform: translateY(-50%);
    width: 50%;
    max-width: 100%;
    z-index: 0;
  }

  .hero-logo-mobile {
    display: none;
  }
}

/* =========================
   MOBILE PHONES ONLY
========================= */
@media (max-width: 639px) {
  .hero-logo-desktop {
    display: none;
  }

  .hero-logo-mobile {
    display: block;
  }
}

/* =========================
   VERY SHORT HEIGHT (LANDSCAPE)
========================= */
@media (max-height: 600px) and (min-width: 640px) {
  .hero-logo-desktop {
    width: 36%;
  }
}

</style>
