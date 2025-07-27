<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Lógica del Intersection Observer para la animación al hacer scroll
const sectionContainer = ref<HTMLElement | null>(null);
const isVisible = ref(false);
const mousePosition = ref({ x: 0, y: 0 });

// Datos de habilidades y logros
const achievements = ref([
  { number: '50+', label: 'Proyectos Completados', icon: '🚀' },
  { number: '3+', label: 'Años de Experiencia', icon: '⏰' },
  { number: '15+', label: 'Tecnologías Dominadas', icon: '💻' },
  { number: '100%', label: 'Dedicación', icon: '❤️' }
]);

const skills = ref([
  'Arquitectura de Software',
  'Clean Code',
  'Metodologías Ágiles',
  'Liderazgo Técnico',
  'Optimización de Performance',
  'Testing & QA'
]);

// Manejo del mouse para efectos parallax
const handleMouseMove = (event: MouseEvent) => {
  const rect = sectionContainer.value?.getBoundingClientRect();
  if (rect) {
    mousePosition.value = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height
    };
  }
};

onMounted(() => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry && entry.isIntersecting) {
        isVisible.value = true;
        observer.unobserve(sectionContainer.value as Element);
      }
    },
    { threshold: 0.2 }
  );

  if (sectionContainer.value) {
    observer.observe(sectionContainer.value);
    sectionContainer.value.addEventListener('mousemove', handleMouseMove);
  }
});
</script>

<template>
  <section ref="sectionContainer" id="about" class="about" :class="{ 'is-visible': isVisible }">
    <!-- Elementos decorativos de fondo -->
    <div class="about__bg-elements">
      <div class="about__bg-circle about__bg-circle--1"></div>
      <div class="about__bg-circle about__bg-circle--2"></div>
      <div class="about__bg-circle about__bg-circle--3"></div>
      <div class="about__floating-shapes">
        <div class="about__shape about__shape--triangle"></div>
        <div class="about__shape about__shape--square"></div>
        <div class="about__shape about__shape--circle"></div>
      </div>
    </div>

    <div class="about__container">
      <!-- Header con efectos de texto -->
      <div class="about__header">
        <h2 class="about__title">
          <span class="about__title-line">Sobre</span>
          <span class="about__title-line about__title-line--accent">Mí</span>
        </h2>
        <div class="about__title-decoration"></div>
      </div>

      <!-- Grid principal -->
      <div class="about__main-grid">
        <!-- Contenido de texto mejorado -->
        <div class="about__content-section">
          <div class="about__text-content">
            <div class="about__intro">
              <p class="about__intro-text">
                ¡Hola! Soy <strong>Diego</strong>, un desarrollador de software con una profunda pasión por la 
                <span class="about__highlight">arquitectura de sistemas</span> y la creación de experiencias de usuario memorables.
              </p>
              <p class="about__intro-text">
                Mi enfoque se centra en escribir <span class="about__highlight">código limpio, escalable y bien documentado</span>, 
                aplicando principios sólidos para construir productos que no solo funcionen hoy, sino que sean fáciles de mantener y evolucionar mañana.
              </p>
              <p class="about__intro-text">
                Disfruto desentrañando problemas complejos y traduciendo ideas en soluciones tecnológicas robustas. 
                Siempre estoy explorando nuevas herramientas y paradigmas para mantenerme a la vanguardia.
              </p>
            </div>

            <!-- Lista de habilidades -->
            <div class="about__skills">
              <h3 class="about__skills-title">Especialidades</h3>
              <div class="about__skills-grid">
                <div 
                  v-for="(skill, index) in skills" 
                  :key="skill"
                  class="about__skill-tag"
                  :style="{ '--skill-delay': index }"
                >
                  {{ skill }}
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Sección de imagen mejorada -->
        <div class="about__visual-section">
          <div class="about__image-container">
            <div class="about__image-frame">
              <img 
                src="../../assets/fotos/yo.jpg" 
                alt="Retrato de Diego Reyes" 
                class="about__image"
              />
              <div class="about__image-overlay"></div>
            </div>
            <div class="about__image-decoration">
              <div class="about__decoration-dot"></div>
              <div class="about__decoration-line"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección de logros -->
      <div class="about__achievements">
        <div class="about__achievements-grid">
          <div 
            v-for="(achievement, index) in achievements" 
            :key="achievement.label"
            class="about__achievement-card"
            :style="{ '--achievement-delay': index }"
          >
            <div class="about__achievement-icon">{{ achievement.icon }}</div>
            <div class="about__achievement-number">{{ achievement.number }}</div>
            <div class="about__achievement-label">{{ achievement.label }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// Animaciones sofisticadas
@keyframes float-gentle {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}

@keyframes pulse-glow {
  0%, 100% {
    box-shadow: 0 0 20px rgba(79, 172, 254, 0.3);
  }
  50% {
    box-shadow: 0 0 40px rgba(79, 172, 254, 0.6);
  }
}

@keyframes slide-in-up {
  from {
    opacity: 0;
    transform: translateY(60px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(80px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

@keyframes rotate-slow {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

// Estilos principales
.about {
  padding: 8rem 1.5rem;
  background: linear-gradient(135deg, 
    $YEYO-VIOLET 0%, 
    rgba(26, 26, 46, 0.95) 20%, 
    rgba(22, 33, 62, 0.9) 40%, 
    rgba(15, 52, 96, 0.85) 60%, 
    rgba(34, 34, 59, 0.8) 80%, 
    rgba(34, 34, 59, 0.8) 100%
  );
  background-size: 400% 400%;
  animation: gradient-shift 15s ease infinite;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    padding: 6rem 1rem;
  }
}

// Elementos decorativos de fondo
.about__bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
}

.about__bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.05));
  animation: float-gentle 8s ease-in-out infinite;

  &--1 {
    width: 300px;
    height: 300px;
    top: 10%;
    left: -10%;
    animation-delay: 0s;
  }

  &--2 {
    width: 200px;
    height: 200px;
    top: 60%;
    right: -5%;
    animation-delay: 2s;
  }

  &--3 {
    width: 150px;
    height: 150px;
    bottom: 20%;
    left: 20%;
    animation-delay: 4s;
  }
}

.about__floating-shapes {
  position: absolute;
  width: 100%;
  height: 100%;
}

.about__shape {
  position: absolute;
  animation: float-gentle 6s ease-in-out infinite;

  &--triangle {
    width: 0;
    height: 0;
    border-left: 15px solid transparent;
    border-right: 15px solid transparent;
    border-bottom: 25px solid rgba(34, 34, 59, 0.1);
    top: 30%;
    right: 20%;
    animation-delay: 1s;
  }

  &--square {
    width: 20px;
    height: 20px;
    background: rgba(154, 3, 30, 0.2);
    top: 70%;
    left: 10%;
    animation-delay: 3s;
    transform: rotate(45deg);
  }

  &--circle {
    width: 12px;
    height: 12px;
    background: rgba(66, 184, 131, 0.3);
    border-radius: 50%;
    top: 20%;
    left: 70%;
    animation-delay: 5s;
  }
}

// Container principal
.about__container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

// Header mejorado
.about__header {
  text-align: center;
  margin-bottom: 6rem;
  position: relative;
}

.about__title {
  font-size: clamp(3rem, 6vw, 5rem);
  font-weight: 800;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  @media (min-width: 768px) {
    flex-direction: row;
    justify-content: center;
    gap: 1rem;
  }
}

.about__title-line {
  display: inline-block;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  opacity: 0;

  .about.is-visible & {
    animation: slide-in-up 1s ease-out forwards;

    &:first-child {
      animation-delay: 0.2s;
    }

    &--accent {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 200% 200%;
      animation: gradient-shift 3s ease infinite;
      animation-delay: 0.4s;
    }
  }
}

.about__title-decoration {
  width: 100px;
  height: 4px;
  background: linear-gradient(90deg, #4facfe, #00f2fe);
  margin: 2rem auto 0;
  border-radius: 2px;
  opacity: 0;

  .about.is-visible & {
    animation: scale-in 0.8s ease-out 0.8s forwards;
  }
}

// Grid principal
.about__main-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 4rem;
  align-items: center;
  margin-bottom: 6rem;

  @media (min-width: 1024px) {
    grid-template-columns: 1.2fr 0.8fr;
    gap: 6rem;
  }
}

// Sección de contenido
.about__content-section {
  opacity: 0;

  .about.is-visible & {
    animation: slide-in-left 1s ease-out 0.6s forwards;
  }
}

.about__text-content {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 24px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(79, 172, 254, 0.1), transparent);
    animation: shimmer 3s infinite;
  }

  @media (max-width: 640px) {
    padding: 2rem;
  }
}

.about__intro-text {
  font-family: $font-secondary;
  font-size: 1.125rem;
  color: rgba(255, 255, 255, 0.9);
  line-height: 1.8;
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }

  strong {
    color: #4facfe;
    font-weight: 700;
  }
}

.about__highlight {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 600;
}

// Habilidades
.about__skills {
  margin-top: 3rem;
}

.about__skills-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-bottom: 1.5rem;
  text-align: center;
}

.about__skills-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
}

.about__skill-tag {
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-size: 0.875rem;
  font-weight: 600;
  box-shadow: 0 4px 15px rgba(79, 172, 254, 0.3);
  transition: all 0.3s ease;
  opacity: 0;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(79, 172, 254, 0.4);
  }

  .about.is-visible & {
    animation: scale-in 0.6s ease-out forwards;
    animation-delay: calc(1.2s + var(--skill-delay) * 0.1s);
  }
}

// Sección visual
.about__visual-section {
  opacity: 0;
  position: relative;

  .about.is-visible & {
    animation: slide-in-right 1s ease-out 0.8s forwards;
  }

  @media (max-width: 1023px) {
    order: -1;
  }
}

.about__image-container {
  position: relative;
  display: flex;
  justify-content: center;
}

.about__image-frame {
  position: relative;
  border-radius: 24px;
  overflow: hidden;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  padding: 4px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.2);
  }
}

.about__image {
  width: 100%;
  max-width: 400px;
  height: auto;
  display: block;
  border-radius: 20px;
  transition: all 0.4s ease;

  &:hover {
    transform: scale(1.05);
  }
}

.about__image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 20px;

  .about__image-frame:hover & {
    opacity: 1;
  }
}

.about__image-decoration {
  position: absolute;
  top: -20px;
  right: -20px;
  z-index: -1;
}

.about__decoration-dot {
  width: 60px;
  height: 60px;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  border-radius: 50%;
  animation: pulse-glow 2s ease-in-out infinite;
}

.about__decoration-line {
  position: absolute;
  top: 30px;
  left: 30px;
  width: 100px;
  height: 2px;
  background: linear-gradient(90deg, #4facfe, transparent);
  transform: rotate(45deg);
}

// Sección de logros
.about__achievements {
  opacity: 0;

  .about.is-visible & {
    animation: slide-in-up 1s ease-out 1.2s forwards;
  }
}

.about__achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;

  @media (max-width: 640px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

.about__achievement-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border-radius: 20px;
  padding: 2rem 1.5rem;
  text-align: center;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  transition: all 0.4s ease;
  opacity: 0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, #4facfe, #00f2fe);
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.2);
  }

  .about.is-visible & {
    animation: scale-in 0.8s ease-out forwards;
    animation-delay: calc(1.4s + var(--achievement-delay) * 0.2s);
  }

  @media (max-width: 640px) {
    padding: 1.5rem 1rem;
  }
}

.about__achievement-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.about__achievement-number {
  font-size: 2.5rem;
  font-weight: 800;
  background: linear-gradient(135deg, #4facfe, #00f2fe);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin-bottom: 0.5rem;
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 2rem;
  }
}

.about__achievement-label {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 600;
  opacity: 0.9;
  line-height: 1.4;
}
</style>