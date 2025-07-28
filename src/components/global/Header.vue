<script setup lang="ts">
import { onMounted } from 'vue'
import BaseButton from '@/components/base/BaseButton.vue'
import { useLanguage } from '@/composables/useLanguage'

const { t, toggleLanguage, languageLabel, languageFlag, initializeLanguage } = useLanguage()

onMounted(() => {
  initializeLanguage()
})
</script>

<template>
  <header class="header">
    <div class="header__container">
      <a href="/" class="header__logo">
        yeyodev<span class="header__logo--dot">.</span>
      </a>
      <nav class="header__nav">
        <router-link to="/blog">{{ t('nav.blog') }}</router-link>
        <a href="#contact">{{ t('nav.contact') }}</a>
      </nav>
      
      <!-- Botones de acción -->
      <div class="header__actions">
        <!-- Botón de cambio de idioma -->
        <button @click="toggleLanguage" class="header__language-btn" :title="`Switch to ${languageLabel}`">
          <span class="header__language-flag">{{ languageFlag }}</span>
          <span class="header__language-text">{{ languageLabel }}</span>
        </button>
        
        <!-- Botón especial para reclutadores -->
        <a href="https://www.self.so/yeyodev" target="_blank" rel="noopener noreferrer" class="header__recruiter-btn">
          <span class="header__recruiter-icon">🎯</span>
          <span class="header__recruiter-text">{{ t('buttons.forRecruiters') }}</span>
        </a>
        
        <!-- Botón principal de contacto -->
        <BaseButton href="https://wa.me/17633524852" target="_blank" rel="noopener noreferrer" variant="primary" class="header__contact-btn">
          {{ t('buttons.letsTalk') }}
        </BaseButton>
      </div>
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

    a,
    :deep(a) {
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

      &.router-link-active {
        color: #4facfe;

        &::after {
          width: 100%;
        }
      }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__language-btn {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.5rem 0.75rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    color: rgba(255, 255, 255, 0.9);
    font-weight: 600;
    font-size: 0.8rem;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.15);
      border-color: rgba(79, 172, 254, 0.5);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &__language-flag {
    font-size: 1rem;
    transition: transform 0.3s ease;
  }

  &__language-text {
    font-size: 0.8rem;
    white-space: nowrap;
  }

  &__language-btn:hover &__language-flag {
    transform: scale(1.1);
  }

  &__recruiter-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.6rem 1rem;
    background: linear-gradient(135deg,
        rgba(255, 193, 7, 0.9) 0%,
        rgba(255, 152, 0, 0.9) 50%,
        rgba(255, 87, 34, 0.9) 100%);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    color: white;
    font-weight: 600;
    font-size: 0.85rem;
    text-decoration: none;
    transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    position: relative;
    overflow: hidden;
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 15px rgba(255, 152, 0, 0.3);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
          transparent,
          rgba(255, 255, 255, 0.3),
          transparent);
      transition: left 0.5s ease;
    }

    &:hover {
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 20px rgba(255, 152, 0, 0.4);
      border-color: rgba(255, 255, 255, 0.4);

      &::before {
        left: 100%;
      }

      .header__recruiter-icon {
        animation: pulse-target 0.6s ease;
      }
    }
  }

  &__recruiter-icon {
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  &__recruiter-text {
    font-size: 0.85rem;
    white-space: nowrap;
  }

  &__contact-btn {
    white-space: nowrap;
  }
}

@keyframes pulse-target {

  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

// --- Estilos para pantallas más grandes ---
@media (max-width: 767px) {
  .header__language-text {
    display: none;
  }

  .header__language-btn {
    padding: 0.5rem;
    min-width: auto;
  }

  .header__recruiter-text {
    display: none;
  }

  .header__recruiter-btn {
    padding: 0.6rem;
    min-width: auto;
  }

  .header__actions {
    gap: 0.4rem;
  }
}

@media (min-width: 768px) {
  .header {
    padding: 1.5rem 2rem;
  }

  .header__nav {
    display: flex;
  }

  .header__actions {
    gap: 1rem;
  }
}
</style>