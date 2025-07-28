<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useLanguage } from '@/composables/useLanguage';

const { t } = useLanguage();

// Estados para animaciones
const isVisible = ref(false);
const particles = ref<Array<{ id: number; x: number; y: number; delay: number }>>([]);

// Generar partículas para el fondo animado
const generateParticles = () => {
  const particleCount = 20;
  particles.value = Array.from({ length: particleCount }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    delay: Math.random() * 2
  }));
};

onMounted(() => {
  generateParticles();
  setTimeout(() => {
    isVisible.value = true;
  }, 100);
});
</script>

<template>
  <section class="blog-hero">
    <!-- Fondo animado con partículas -->
    <div class="blog-hero__background">
      <div 
        v-for="particle in particles"
        :key="particle.id"
        class="particle"
        :style="{
          left: `${particle.x}%`,
          top: `${particle.y}%`,
          animationDelay: `${particle.delay}s`
        }"
      ></div>
    </div>
    
    <!-- Contenido principal -->
    <div class="blog-hero__container">
      <div 
        class="blog-hero__content"
        :class="{ 'blog-hero__content--visible': isVisible }"
      >
        <!-- Badge -->
        <div class="blog-hero__badge">
          <span class="badge-icon">✨</span>
          <span>{{ t('blog.hero.badge') }}</span>
        </div>
        
        <!-- Título principal -->
        <h1 class="blog-hero__title">
          <span class="title-main">{{ t('blog.hero.title') }}</span>
          <span class="title-accent">{{ t('blog.hero.titleAccent') }}</span>
        </h1>
        
        <!-- Subtítulo -->
        <p class="blog-hero__subtitle">
          {{ t('blog.hero.subtitle') }}
        </p>
        
        <!-- Estadísticas -->
        <div class="blog-hero__stats">
          <div class="stat-item">
            <span class="stat-number">{{ t('blog.hero.stats.posts') }}</span>
            <span class="stat-label">{{ t('blog.hero.stats.postsLabel') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ t('blog.hero.stats.categories') }}</span>
            <span class="stat-label">{{ t('blog.hero.stats.categoriesLabel') }}</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat-item">
            <span class="stat-number">{{ t('blog.hero.stats.readers') }}</span>
            <span class="stat-label">{{ t('blog.hero.stats.readersLabel') }}</span>
          </div>
        </div>
        
        <!-- Call to action -->
        <div class="blog-hero__cta">
          <button class="cta-button cta-button--primary">
            <span>{{ t('blog.hero.cta.explore') }}</span>
            <svg class="cta-icon" viewBox="0 0 24 24" fill="none">
              <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
          
          <button class="cta-button cta-button--secondary">
            <svg class="cta-icon" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M7 10L12 15L17 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M12 15V3" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ t('blog.hero.cta.newsletter') }}</span>
          </button>
        </div>
      </div>
      
      <!-- Elemento visual decorativo -->
      <div class="blog-hero__visual">
        <div class="visual-element visual-element--1"></div>
        <div class="visual-element visual-element--2"></div>
        <div class="visual-element visual-element--3"></div>
      </div>
    </div>
    
    <!-- Indicador de scroll -->
    <div class="blog-hero__scroll-indicator">
      <div class="scroll-line"></div>
      <div class="scroll-text">{{ t('blog.hero.scrollDown') }}</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.blog-hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, 
    $YEYO-VIOLET 0%, 
    rgba(26, 26, 46, 0.95) 30%, 
    rgba(22, 33, 62, 0.9) 100%
  );
  
  &__background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    
    .particle {
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(79, 172, 254, 0.6);
      border-radius: 50%;
      animation: float 6s ease-in-out infinite;
      
      &::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        width: 8px;
        height: 8px;
        background: rgba(79, 172, 254, 0.2);
        border-radius: 50%;
        animation: pulse 3s ease-in-out infinite;
      }
    }
  }
  
  &__container {
    max-width: 1200px;
    width: 100%;
    margin: 0 auto;
    padding: 0 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    position: relative;
    z-index: 2;
  }
  
  &__content {
    opacity: 0;
    transform: translateY(50px);
    transition: all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    
    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(79, 172, 254, 0.3);
    border-radius: 50px;
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.875rem;
    font-weight: 500;
    backdrop-filter: blur(10px);
    margin-bottom: 1.5rem;
    
    .badge-icon {
      font-size: 1rem;
      animation: sparkle 2s ease-in-out infinite;
    }
  }
  
  &__title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
    
    .title-main {
      display: block;
      color: white;
      margin-bottom: 0.5rem;
    }
    
    .title-accent {
      display: block;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60%;
        height: 4px;
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        border-radius: 2px;
        animation: underlineGrow 1s ease-out 0.5s both;
      }
    }
  }
  
  &__subtitle {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.8);
    line-height: 1.6;
    margin-bottom: 2rem;
    max-width: 500px;
  }
  
  &__stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2.5rem;
    
    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }
    
    .stat-number {
      font-size: 2rem;
      font-weight: 700;
      color: #4facfe;
      line-height: 1;
      margin-bottom: 0.25rem;
    }
    
    .stat-label {
      font-size: 0.875rem;
      color: rgba(255, 255, 255, 0.7);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    
    .stat-divider {
      width: 1px;
      height: 40px;
      background: rgba(255, 255, 255, 0.2);
    }
  }
  
  &__cta {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    
    .cta-button {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 1.5rem;
      border: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      .cta-icon {
        width: 20px;
        height: 20px;
        transition: transform 0.3s ease;
      }
      
      &--primary {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        color: white;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 10px 30px rgba(79, 172, 254, 0.4);
          
          .cta-icon {
            transform: translate(2px, -2px);
          }
        }
      }
      
      &--secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
        
        &:hover {
          background: rgba(255, 255, 255, 0.2);
          border-color: rgba(255, 255, 255, 0.4);
          transform: translateY(-2px);
          
          .cta-icon {
            transform: translateY(-2px);
          }
        }
      }
    }
  }
  
  &__visual {
    position: relative;
    height: 400px;
    
    .visual-element {
      position: absolute;
      border-radius: 20px;
      background: linear-gradient(135deg, 
        rgba(79, 172, 254, 0.2) 0%, 
        rgba(0, 242, 254, 0.1) 100%
      );
      backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      
      &--1 {
        width: 200px;
        height: 250px;
        top: 0;
        right: 0;
        animation: float 6s ease-in-out infinite;
      }
      
      &--2 {
        width: 150px;
        height: 180px;
        bottom: 50px;
        right: 100px;
        animation: float 6s ease-in-out infinite 2s;
      }
      
      &--3 {
        width: 100px;
        height: 120px;
        top: 100px;
        left: 50px;
        animation: float 6s ease-in-out infinite 4s;
      }
    }
  }
  
  &__scroll-indicator {
    position: absolute;
    bottom: 2rem;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.875rem;
    
    .scroll-line {
      width: 1px;
      height: 30px;
      background: linear-gradient(to bottom, 
        transparent 0%, 
        rgba(255, 255, 255, 0.6) 50%, 
        transparent 100%
      );
      animation: scrollPulse 2s ease-in-out infinite;
    }
    
    .scroll-text {
      text-transform: uppercase;
      letter-spacing: 1px;
      font-weight: 500;
    }
  }
}

// Animaciones
@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

@keyframes pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

@keyframes sparkle {
  0%, 100% { transform: scale(1) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
}

@keyframes underlineGrow {
  0% { width: 0; }
  100% { width: 60%; }
}

@keyframes scrollPulse {
  0%, 100% { opacity: 0.6; }
  50% { opacity: 1; }
}

// Responsive Design
@media (max-width: 1024px) {
  .blog-hero {
    &__container {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }
    
    &__visual {
      order: -1;
      height: 300px;
    }
  }
}

@media (max-width: 768px) {
  .blog-hero {
    &__container {
      padding: 0 1.5rem;
      gap: 2rem;
    }
    
    &__stats {
      gap: 1rem;
      
      .stat-number {
        font-size: 1.5rem;
      }
    }
    
    &__cta {
      justify-content: center;
      
      .cta-button {
        padding: 0.875rem 1.25rem;
        font-size: 0.9rem;
      }
    }
    
    &__visual {
      height: 250px;
      
      .visual-element {
        &--1 {
          width: 150px;
          height: 180px;
        }
        
        &--2 {
          width: 120px;
          height: 140px;
        }
        
        &--3 {
          width: 80px;
          height: 100px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .blog-hero {
    &__container {
      padding: 0 1rem;
    }
    
    &__stats {
      flex-direction: column;
      gap: 1rem;
      
      .stat-divider {
        width: 40px;
        height: 1px;
      }
    }
    
    &__cta {
      flex-direction: column;
      
      .cta-button {
        width: 100%;
        justify-content: center;
      }
    }
  }
}
</style>