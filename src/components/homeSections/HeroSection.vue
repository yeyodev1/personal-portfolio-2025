<script setup lang="ts">
import { ref, onMounted } from 'vue';
import BaseButton from '@/components/base/BaseButton.vue';

// Estado y lógica del componente
const heroContainer = ref<HTMLElement | null>(null);
const mousePosition = ref({ x: 0, y: 0 });
const isLoaded = ref(false);
const currentRole = ref(0);

// Roles que se van alternando
const roles = [
  'Full-Stack Developer',
  'Frontend Specialist',
  'Vue.js Expert',
  'UI/UX Enthusiast'
];

// Estadísticas del hero
const heroStats = [
  { label: 'Años de Experiencia', value: '3+', icon: '📅' },
  { label: 'Proyectos Completados', value: '15+', icon: '🚀' },
  { label: 'Tecnologías Dominadas', value: '20+', icon: '⚡' },
  { label: 'Clientes Satisfechos', value: '12+', icon: '😊' }
];

// Manejo del mouse para efectos parallax
const handleMouseMove = (event: MouseEvent) => {
  const rect = heroContainer.value?.getBoundingClientRect();
  if (rect) {
    mousePosition.value = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    };
  }
};

// Cambio automático de roles
const rotateRoles = () => {
  setInterval(() => {
    currentRole.value = (currentRole.value + 1) % roles.length;
  }, 3000);
};

// Configuración inicial
onMounted(() => {
  isLoaded.value = true;
  
  if (heroContainer.value) {
    heroContainer.value.addEventListener('mousemove', handleMouseMove);
  }
  
  // Iniciar rotación de roles después de un delay
  setTimeout(() => {
    rotateRoles();
  }, 2000);
});
</script>

<template>
  <section 
    ref="heroContainer"
    class="hero"
    :class="{ 'hero--loaded': isLoaded }"
  >
    <!-- Elementos decorativos de fondo -->
    <div class="hero__bg-elements">
      <div 
        class="hero__bg-circle hero__bg-circle--1"
        :style="{
          transform: `translate(${mousePosition.x * 30}px, ${mousePosition.y * 30}px)`
        }"
      ></div>
      <div 
        class="hero__bg-circle hero__bg-circle--2"
        :style="{
          transform: `translate(${mousePosition.x * -20}px, ${mousePosition.y * -20}px)`
        }"
      ></div>
      <div 
        class="hero__bg-circle hero__bg-circle--3"
        :style="{
          transform: `translate(${mousePosition.x * 15}px, ${mousePosition.y * 15}px)`
        }"
      ></div>
      <div class="hero__bg-gradient"></div>
      <div class="hero__bg-mesh"></div>
      <div class="hero__floating-particles">
        <div 
          v-for="i in 12" 
          :key="i" 
          class="hero__particle"
          :style="{ '--particle-delay': i * 0.5 + 's' }"
        ></div>
      </div>
    </div>

    <div class="hero__container">
      <!-- Contenido principal mejorado -->
      <div class="hero__content">
        <!-- Badge de estado -->
        <div class="hero__badge">
          <span class="hero__badge-dot"></span>
          Disponible para proyectos
        </div>

        <!-- Título principal con efectos -->
        <div class="hero__title-section">
          <div class="hero__greeting">
            <span class="hero__greeting-text">¡Hola! Soy</span>
          </div>
          
          <div class="hero__title-mask">
            <h1 class="hero__title">
              <span class="hero__name">Diego Reyes</span>
            </h1>
          </div>
          
          <!-- Rol dinámico -->
          <div class="hero__role-container">
            <span class="hero__role-prefix">Soy un</span>
            <div class="hero__role-switcher">
              <span 
                v-for="(role, index) in roles"
                :key="role"
                class="hero__role"
                :class="{ 'hero__role--active': index === currentRole }"
              >
                {{ role }}
              </span>
            </div>
          </div>
        </div>

        <!-- Descripción mejorada -->
        <div class="hero__description">
          <p class="hero__subtitle">
            Especializado en crear <strong>aplicaciones web modernas</strong> y 
            <strong>experiencias digitales excepcionales</strong> que combinan 
            funcionalidad, rendimiento y diseño elegante.
          </p>
          
          <div class="hero__highlights">
            <span class="hero__highlight">Vue.js Expert</span>
            <span class="hero__highlight">TypeScript</span>
            <span class="hero__highlight">Node.js</span>
            <span class="hero__highlight">UI/UX Design</span>
          </div>
        </div>

        <!-- Acciones principales -->
        <div class="hero__actions">
          <BaseButton href="#projects" variant="primary" class="hero__cta-primary">
            <span class="hero__cta-text">Ver Mis Proyectos</span>
            <span class="hero__cta-icon">→</span>
          </BaseButton>
          <BaseButton href="/cv.pdf" variant="secondary" class="hero__cta-secondary">
            <span class="hero__cta-text">Descargar CV</span>
            <span class="hero__cta-icon">📄</span>
          </BaseButton>
        </div>

        <!-- Badge flotante para reclutadores -->
        <div class="hero__recruiter-badge">
          <a href="https://www.self.so/yeyodev" target="_blank" rel="noopener noreferrer" class="hero__recruiter-link">
            <div class="hero__recruiter-pulse"></div>
            <div class="hero__recruiter-content">
              <span class="hero__recruiter-icon">💼</span>
              <div class="hero__recruiter-text">
                <strong>¿Hiring?</strong>
                <small>Click aquí</small>
              </div>
            </div>
          </a>
        </div>

        <!-- Estadísticas del hero -->
        <div class="hero__stats">
          <div 
            v-for="(stat, index) in heroStats"
            :key="stat.label"
            class="hero__stat"
            :style="{ '--stat-delay': index * 0.1 + 's' }"
          >
            <div class="hero__stat-icon">{{ stat.icon }}</div>
            <div class="hero__stat-content">
              <div class="hero__stat-value">{{ stat.value }}</div>
              <div class="hero__stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección visual lateral -->
      <div class="hero__visual">
        <div class="hero__avatar-container">
          <div class="hero__avatar-frame">
            <div class="hero__avatar-glow"></div>
            <div class="hero__avatar-border"></div>
            <div class="hero__avatar-content">
              <div class="hero__avatar-placeholder">
                <span class="hero__avatar-initial">DR</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Elementos decorativos -->
        <div class="hero__decorative-elements">
          <div class="hero__code-snippet">
            <div class="hero__code-header">
              <div class="hero__code-dots">
                <span></span><span></span><span></span>
              </div>
              <span class="hero__code-title">portfolio.vue</span>
            </div>
            <div class="hero__code-content">
              <div class="hero__code-line">
                <span class="hero__code-keyword">const</span>
                <span class="hero__code-variable">developer</span>
                <span class="hero__code-operator">=</span>
                <span class="hero__code-string">"Diego"</span>
              </div>
              <div class="hero__code-line">
                <span class="hero__code-keyword">export</span>
                <span class="hero__code-keyword">default</span>
                <span class="hero__code-variable">awesome</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Indicador de scroll -->
    <div class="hero__scroll-indicator">
      <div class="hero__scroll-text">Scroll para explorar</div>
      <div class="hero__scroll-arrow">↓</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// Animaciones sofisticadas
@keyframes float-gentle {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(1deg); }
  66% { transform: translateY(-5px) rotate(-1deg); }
}

@keyframes pulse-glow {
  0%, 100% { 
    box-shadow: 0 0 20px rgba(79, 172, 254, 0.3);
    transform: scale(1);
  }
  50% { 
    box-shadow: 0 0 40px rgba(79, 172, 254, 0.6);
    transform: scale(1.02);
  }
}

@keyframes slide-in-up {
  from {
    transform: translateY(60px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

@keyframes slide-in-left {
  from {
    transform: translateX(-60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slide-in-right {
  from {
    transform: translateX(60px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes scale-in {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes shimmer {
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

@keyframes particle-float {
  0%, 100% { 
    transform: translateY(0px) translateX(0px) rotate(0deg);
    opacity: 0.3;
  }
  25% { 
    transform: translateY(-20px) translateX(10px) rotate(90deg);
    opacity: 0.7;
  }
  50% { 
    transform: translateY(-10px) translateX(-5px) rotate(180deg);
    opacity: 0.5;
  }
  75% { 
    transform: translateY(-30px) translateX(-10px) rotate(270deg);
    opacity: 0.8;
  }
}

@keyframes role-switch {
  0%, 20% { 
    transform: translateY(0) rotateX(0deg);
    opacity: 1;
  }
  25%, 75% { 
    transform: translateY(-20px) rotateX(90deg);
    opacity: 0;
  }
  80%, 100% { 
    transform: translateY(0) rotateX(0deg);
    opacity: 1;
  }
}

@keyframes bounce-arrow {
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-10px); }
  60% { transform: translateY(-5px); }
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.3);
    opacity: 0;
  }
}

@keyframes bounce-gentle {
  0%, 100% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.1); }
}

// Sección Hero Principal
.hero {
  min-height: 100vh;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, 
    $YEYO-VIOLET 0%, 
    rgba(26, 26, 46, 0.95) 20%, 
    rgba(22, 33, 62, 0.9) 40%, 
    rgba(15, 52, 96, 0.85) 60%, 
    rgba(34, 34, 59, 0.8) 80%, 
    rgba(34, 34, 59, 0.8) 100%
  );
  
  // Estado de carga
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  
  &--loaded {
    opacity: 1;
    transform: translateY(0);
  }

  // Elementos decorativos de fondo
  &__bg-elements {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  &__bg-circle {
    position: absolute;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79, 172, 254, 0.1) 0%, transparent 70%);
    animation: float-gentle 8s ease-in-out infinite;
    
    &--1 {
      width: 300px;
      height: 300px;
      top: 10%;
      right: 10%;
      animation-delay: 0s;
    }
    
    &--2 {
      width: 200px;
      height: 200px;
      bottom: 20%;
      left: 5%;
      animation-delay: 2s;
      background: radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, transparent 70%);
    }
    
    &--3 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 30%;
      animation-delay: 4s;
      background: radial-gradient(circle, rgba(255, 107, 107, 0.1) 0%, transparent 70%);
    }
  }

  &__bg-gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 80%, rgba(79, 172, 254, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(78, 205, 196, 0.1) 0%, transparent 50%);
    animation: gradient-shift 8s ease-in-out infinite;
  }

  &__bg-mesh {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      linear-gradient(rgba(79, 172, 254, 0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(79, 172, 254, 0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    animation: float-gentle 12s ease-in-out infinite reverse;
  }

  &__floating-particles {
    position: absolute;
    width: 100%;
    height: 100%;
  }

  &__particle {
    position: absolute;
    width: 4px;
    height: 4px;
    background: rgba(79, 172, 254, 0.6);
    border-radius: 50%;
    animation: particle-float 6s ease-in-out infinite;
    animation-delay: var(--particle-delay);
    
    &:nth-child(odd) {
      background: rgba(255, 107, 107, 0.6);
    }
    
    &:nth-child(3n) {
      background: rgba(78, 205, 196, 0.6);
    }
    
    // Posicionamiento aleatorio
    &:nth-child(1) { top: 20%; left: 10%; }
    &:nth-child(2) { top: 60%; left: 20%; }
    &:nth-child(3) { top: 30%; left: 70%; }
    &:nth-child(4) { top: 80%; left: 60%; }
    &:nth-child(5) { top: 10%; left: 50%; }
    &:nth-child(6) { top: 70%; left: 80%; }
    &:nth-child(7) { top: 40%; left: 30%; }
    &:nth-child(8) { top: 90%; left: 40%; }
    &:nth-child(9) { top: 15%; left: 85%; }
    &:nth-child(10) { top: 55%; left: 15%; }
    &:nth-child(11) { top: 75%; left: 75%; }
    &:nth-child(12) { top: 35%; left: 55%; }
  }

  // Contenedor principal
  &__container {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 4rem;
    align-items: center;
    min-height: 100vh;
  }

  // Contenido principal
  &__content {
    animation: slide-in-left 1s ease-out 0.3s both;
  }

  &__badge {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: rgba(79, 172, 254, 0.1);
    border: 1px solid rgba(79, 172, 254, 0.3);
    border-radius: 50px;
    color: #4facfe;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 2rem;
    backdrop-filter: blur(10px);
    animation: scale-in 0.8s ease-out 0.5s both;
  }

  &__badge-dot {
    width: 8px;
    height: 8px;
    background: #4facfe;
    border-radius: 50%;
    animation: pulse-glow 2s ease-in-out infinite;
  }

  // Sección del título
  &__title-section {
    margin-bottom: 2rem;
  }

  &__greeting {
    margin-bottom: 0.5rem;
    animation: slide-in-up 0.8s ease-out 0.7s both;
  }

  &__greeting-text {
    font-size: 1.25rem;
    color: rgba(255, 255, 255, 0.8);
    font-weight: 400;
  }

  &__title-mask {
    overflow: hidden;
    margin-bottom: 1rem;
  }

  &__title {
    font-size: clamp(3rem, 8vw, 5rem);
    font-weight: 800;
    margin: 0;
    line-height: 1.1;
    animation: slide-in-up 1s ease-out 0.9s both;
  }

  &__name {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      background-size: 200% 200%;
      animation: shimmer 3s ease-in-out infinite;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
  }

  // Rol dinámico
  &__role-container {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    color: rgba(255, 255, 255, 0.9);
    animation: slide-in-up 1s ease-out 1.1s both;
  }

  &__role-prefix {
    font-weight: 400;
  }

  &__role-switcher {
    position: relative;
    height: 2rem;
    overflow: hidden;
  }

  &__role {
    position: absolute;
    top: 0;
    left: 0;
    font-weight: 600;
    background: linear-gradient(135deg, #ff6b6b 0%, #feca57 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    
    &--active {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Descripción
  &__description {
    margin-bottom: 3rem;
    animation: slide-in-up 1s ease-out 1.3s both;
  }

  &__subtitle {
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.85);
    margin-bottom: 1.5rem;
    
    strong {
      color: #4facfe;
      font-weight: 600;
    }
  }

  &__highlights {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
  }

  &__highlight {
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 25px;
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(79, 172, 254, 0.2);
      border-color: rgba(79, 172, 254, 0.4);
      transform: translateY(-2px);
    }
  }

  // Acciones
  &__actions {
    display: flex;
    gap: 1rem;
    margin-bottom: 3rem;
    animation: slide-in-up 1s ease-out 1.5s both;
  }

  &__cta-primary,
  &__cta-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-2px);
      
      .hero__cta-icon {
        transform: translateX(4px);
      }
    }
  }

  &__cta-icon {
    transition: transform 0.3s ease;
  }

  // Estadísticas
  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1.5rem;
    animation: slide-in-up 1s ease-out 1.7s both;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    animation: scale-in 0.8s ease-out calc(1.8s + var(--stat-delay)) both;
    
    &:hover {
      background: rgba(255, 255, 255, 0.1);
      border-color: rgba(79, 172, 254, 0.3);
      transform: translateY(-4px);
    }
  }

  &__stat-icon {
    font-size: 1.5rem;
  }

  &__stat-value {
    font-size: 1.25rem;
    font-weight: 700;
    color: #4facfe;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    line-height: 1;
  }

  // Sección visual
  &__visual {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 2rem;
    animation: slide-in-right 1s ease-out 0.5s both;
  }

  &__avatar-container {
    position: relative;
  }

  &__avatar-frame {
    position: relative;
    width: 300px;
    height: 300px;
    border-radius: 50%;
    animation: float-gentle 6s ease-in-out infinite;
  }

  &__avatar-glow {
    position: absolute;
    top: -20px;
    left: -20px;
    right: -20px;
    bottom: -20px;
    background: conic-gradient(from 0deg, #4facfe, #00f2fe, #ff6b6b, #feca57, #4facfe);
    border-radius: 50%;
    animation: rotate-slow 8s linear infinite;
    filter: blur(20px);
    opacity: 0.7;
  }

  &__avatar-border {
    position: absolute;
    top: -4px;
    left: -4px;
    right: -4px;
    bottom: -4px;
    background: conic-gradient(from 0deg, #4facfe, #00f2fe, #ff6b6b, #feca57, #4facfe);
    border-radius: 50%;
    animation: rotate-slow 6s linear infinite;
  }

  &__avatar-content {
    position: relative;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1;
  }

  &__avatar-placeholder {
    width: 80%;
    height: 80%;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__avatar-initial {
    font-size: 4rem;
    font-weight: 800;
    color: white;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  // Elementos decorativos
  &__decorative-elements {
    position: relative;
  }

  &__code-snippet {
    background: rgba(15, 15, 35, 0.9);
    border: 1px solid rgba(79, 172, 254, 0.3);
    border-radius: 12px;
    padding: 1rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: scale-in 1s ease-out 2s both;
  }

  &__code-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0.75rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  &__code-dots {
    display: flex;
    gap: 0.25rem;
    
    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      
      &:nth-child(1) { background: #ff5f56; }
      &:nth-child(2) { background: #ffbd2e; }
      &:nth-child(3) { background: #27ca3f; }
    }
  }

  &__code-title {
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.7);
    font-family: 'Monaco', 'Menlo', monospace;
  }

  &__code-content {
    font-family: 'Monaco', 'Menlo', monospace;
    font-size: 0.875rem;
    line-height: 1.5;
  }

  &__code-line {
    margin-bottom: 0.25rem;
  }

  &__code-keyword {
    color: #ff6b6b;
    font-weight: 600;
  }

  &__code-variable {
    color: #4facfe;
  }

  &__code-operator {
    color: #feca57;
  }

  &__code-string {
    color: #48cae4;
  }

  // Badge flotante para reclutadores
  &__recruiter-badge {
    position: absolute;
    top: 2rem;
    right: 2rem;
    z-index: 5;
    animation: slide-in-right 1s ease-out 1.5s both;
  }

  &__recruiter-link {
    position: relative;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    background: linear-gradient(135deg, 
      rgba(76, 175, 80, 0.9) 0%, 
      rgba(67, 160, 71, 0.9) 50%,
      rgba(56, 142, 60, 0.9) 100%
    );
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 50px;
    color: white;
    text-decoration: none;
    backdrop-filter: blur(15px);
    box-shadow: 0 8px 32px rgba(76, 175, 80, 0.3);
    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
    overflow: hidden;
    
    &:hover {
      transform: translateY(-3px) scale(1.05);
      box-shadow: 0 12px 40px rgba(76, 175, 80, 0.4);
      border-color: rgba(255, 255, 255, 0.4);
      
      .hero__recruiter-pulse {
        animation: pulse-ring 1.5s ease-out infinite;
      }
      
      .hero__recruiter-icon {
        animation: bounce-gentle 0.6s ease;
      }
    }
  }

  &__recruiter-pulse {
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border: 2px solid rgba(76, 175, 80, 0.6);
    border-radius: 50px;
    animation: pulse-ring 2s ease-out infinite;
  }

  &__recruiter-content {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    z-index: 1;
  }

  &__recruiter-icon {
    font-size: 1.25rem;
    transition: all 0.3s ease;
  }

  &__recruiter-text {
    display: flex;
    flex-direction: column;
    line-height: 1.2;
    
    strong {
      font-size: 0.9rem;
      font-weight: 700;
      margin-bottom: 0.1rem;
    }
    
    small {
      font-size: 0.75rem;
      opacity: 0.9;
      font-weight: 400;
    }
  }

  // Indicador de scroll
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
    animation: slide-in-up 1s ease-out 2.5s both;
    z-index: 2;
  }

  &__scroll-text {
    font-size: 0.875rem;
    font-weight: 500;
  }

  &__scroll-arrow {
    font-size: 1.5rem;
    animation: bounce-arrow 2s ease-in-out infinite;
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .hero {
    &__container {
      grid-template-columns: 1fr;
      gap: 3rem;
      text-align: center;
    }
    
    &__visual {
      order: -1;
    }
    
    &__avatar-frame {
      width: 250px;
      height: 250px;
    }
    
    &__recruiter-badge {
      top: 1.5rem;
      right: 1.5rem;
    }
    
    &__recruiter-link {
      padding: 0.875rem 1.25rem;
      gap: 0.5rem;
    }
    
    &__recruiter-text {
      strong {
        font-size: 0.85rem;
      }
      
      small {
        font-size: 0.7rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .hero {
    &__container {
      padding: 1rem;
      gap: 2rem;
    }
    
    &__actions {
      flex-direction: column;
      align-items: center;
    }
    
    &__stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    &__highlights {
      justify-content: center;
    }
    
    &__avatar-frame {
      width: 200px;
      height: 200px;
    }
    
    &__avatar-initial {
      font-size: 3rem;
    }
    
    &__recruiter-badge {
      top: 1rem;
      right: 1rem;
    }
    
    &__recruiter-link {
      padding: 0.75rem 1rem;
      gap: 0.5rem;
    }
    
    &__recruiter-text {
      strong {
        font-size: 0.8rem;
      }
      
      small {
        font-size: 0.65rem;
      }
    }
    
    &__recruiter-icon {
      font-size: 1.1rem;
    }
  }
}

@media (max-width: 480px) {
  .hero {
    &__container {
      padding: 0.5rem;
    }
    
    &__stats {
      grid-template-columns: 1fr;
    }
    
    &__code-snippet {
      padding: 0.75rem;
    }
    
    &__avatar-frame {
      width: 180px;
      height: 180px;
    }
    
    &__recruiter-badge {
      top: 0.75rem;
      right: 0.75rem;
    }
    
    &__recruiter-link {
      padding: 0.625rem 0.875rem;
      gap: 0.375rem;
    }
    
    &__recruiter-text {
      display: none; // Ocultar texto en pantallas muy pequeñas
    }
    
    &__recruiter-icon {
      font-size: 1rem;
    }
  }
}

@media (max-width: 375px) {
  .hero {
    &__recruiter-badge {
      top: 0.5rem;
      right: 0.5rem;
    }
    
    &__recruiter-link {
      padding: 0.5rem;
      min-width: 44px; // Tamaño mínimo para touch targets
      min-height: 44px;
      justify-content: center;
    }
  }
}
</style>