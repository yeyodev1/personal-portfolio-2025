<script setup lang="ts">
import BaseButton from '@/components/base/BaseButton.vue';
// En un futuro, podrías usar ref y un watcher para manejar el estado del menú móvil
</script>

<template>
  <header class="header">
    <div class="header__container">
      <a href="/" class="header__logo">
        yeyodev<span class="header__logo--dot">.</span>
      </a>
      <nav class="header__nav">
        <a href="#projects">Proyectos</a>
        <a href="#about">Sobre Mí</a>
        <a href="#contact">Contacto</a>
      </nav>
      <BaseButton href="mailto:tu.email@example.com" variant="primary">
        ¡Hablemos!
      </BaseButton>
      </div>
  </header>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.header {
  background: linear-gradient(135deg,
      $YEYO-VIOLET 0%,
      rgba(26, 26, 46, 0.95) 50%,
      rgba(34, 34, 59, 0.9) 100%);
  backdrop-filter: blur(20px);
  padding: 1.5rem 1rem; // Padding mobile
  position: sticky;
  top: 0;
  z-index: 10;
  border-bottom: 1px solid rgba(79, 172, 254, 0.2);

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    font-family: $font-principal;
    font-size: 1.75rem;
    font-weight: 700;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-decoration: none;

    &--dot {
      color: #4facfe;
    }
  }

  &__nav {
    display: none; // Oculto en mobile-first

    a {
      margin: 0 1rem;
      font-weight: 500;
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      transition: all 0.3s ease;
      position: relative;

      &:hover {
        color: #4facfe;
        transform: translateY(-1px);
      }

      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 2px;
        background: linear-gradient(90deg, #4facfe, #00f2fe);
        transition: width 0.3s ease;
      }

      &:hover::after {
        width: 100%;
      }
    }
  }
}

// --- Estilos para pantallas más grandes ---
@media (min-width: 768px) {
  .header {
    padding: 1.5rem 2rem;
  }

  .header__nav {
    display: flex;
  }
}
</style>