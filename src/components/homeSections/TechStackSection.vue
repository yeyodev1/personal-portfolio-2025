<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)
const hoveredSkill = ref<string | null>(null)

const techCategories = [
  {
    name: 'Frontend',
    icon: '🎨',
    color: '#42b883',
    skills: [
      { name: 'Vue.js', level: 95, description: 'Framework principal para desarrollo de interfaces' },
      { name: 'TypeScript', level: 90, description: 'Tipado estático para JavaScript' },
      { name: 'SCSS', level: 85, description: 'Preprocesador CSS avanzado' },
      { name: 'Vite', level: 88, description: 'Build tool moderno y rápido' }
    ]
  },
  {
    name: 'Backend',
    icon: '⚙️',
    color: '#ff6b6b',
    skills: [
      { name: 'Node.js', level: 85, description: 'Runtime de JavaScript en servidor' },
      { name: 'Express', level: 80, description: 'Framework web para Node.js' },
      { name: 'MongoDB', level: 75, description: 'Base de datos NoSQL' },
      { name: 'PostgreSQL', level: 70, description: 'Base de datos relacional' }
    ]
  },
  {
    name: 'Tools & DevOps',
    icon: '🛠️',
    color: '#4ecdc4',
    skills: [
      { name: 'Git', level: 90, description: 'Control de versiones' },
      { name: 'Docker', level: 75, description: 'Containerización de aplicaciones' },
      { name: 'AWS', level: 70, description: 'Servicios en la nube' },
      { name: 'CI/CD', level: 80, description: 'Integración y despliegue continuo' }
    ]
  }
]

const handleSkillHover = (skillName: string) => {
  hoveredSkill.value = skillName
}

const handleSkillLeave = () => {
  hoveredSkill.value = null
}

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <section class="stack" :class="{ 'is-visible': isVisible }">
    <div class="stack__bg-elements">
      <div class="stack__bg-circle stack__bg-circle--1"></div>
      <div class="stack__bg-circle stack__bg-circle--2"></div>
      <div class="stack__bg-circle stack__bg-circle--3"></div>
    </div>
    
    <div class="stack__container">
      <header class="stack__header">
        <h2 class="stack__title">Tech Stack</h2>
        <p class="stack__subtitle">
          Tecnologías y herramientas que domino para crear experiencias digitales excepcionales
        </p>
      </header>
      
      <div class="stack__categories">
        <div 
          v-for="(category, categoryIndex) in techCategories" 
          :key="category.name"
          class="stack__category"
          :style="{ 
            '--category-color': category.color,
            '--category-delay': categoryIndex 
          }"
        >
          <div class="stack__category-header">
            <span class="stack__category-icon">{{ category.icon }}</span>
            <h3 class="stack__category-title">{{ category.name }}</h3>
          </div>
          
          <div class="stack__skills-grid">
            <div 
              v-for="(skill, skillIndex) in category.skills" 
              :key="skill.name"
              class="stack__skill"
              :style="{ 
                '--skill-delay': skillIndex,
                '--skill-level': skill.level + '%'
              }"
              @mouseenter="handleSkillHover(skill.name)"
              @mouseleave="handleSkillLeave"
            >
              <div class="stack__skill-content">
                <div class="stack__skill-header">
                  <span class="stack__skill-name">{{ skill.name }}</span>
                  <span class="stack__skill-level">{{ skill.level }}%</span>
                </div>
                <div class="stack__skill-bar">
                  <div class="stack__skill-progress"></div>
                </div>
              </div>
              
              <div 
                class="stack__skill-tooltip"
                :class="{ 'is-visible': hoveredSkill === skill.name }"
              >
                {{ skill.description }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

@keyframes category-fade-in {
  from {
    opacity: 0;
    transform: translateY(50px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes skill-slide-in {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes progress-fill {
  from {
    width: 0;
  }
  to {
    width: var(--skill-level);
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
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

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.stack {
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
}

.stack__container {
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
}

.stack__header {
  text-align: center;
  margin-bottom: 5rem;
}

.stack__title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 800;
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradient-shift 3s ease infinite;
  margin-bottom: 1rem;
  letter-spacing: -0.02em;
}

.stack__subtitle {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 300;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.stack__categories {
  display: grid;
  grid-template-columns: 1fr;
  gap: 3rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 3.5rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
    gap: 4rem;
  }
}

.stack__category {
  opacity: 0;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 24px;
  padding: 2.5rem;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 24px;
    background: linear-gradient(135deg, var(--category-color), transparent);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }

  &:hover {
    transform: translateY(-8px) scale(1.02);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    
    &::before {
      opacity: 0.1;
    }
  }

  .stack.is-visible & {
    animation: category-fade-in 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    animation-delay: calc(var(--category-delay) * 200ms);
  }
}

.stack__category-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(79, 172, 254, 0.3);
}

.stack__category-icon {
  font-size: 2rem;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
}

.stack__category-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin: 0;
}

.stack__skills-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stack__skill {
  opacity: 0;
  position: relative;
  
  .stack.is-visible & {
    animation: skill-slide-in 0.6s ease-out forwards;
    animation-delay: calc(var(--category-delay) * 200ms + var(--skill-delay) * 100ms + 300ms);
  }
}

.stack__skill-content {
  background: rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: rgba(255, 255, 255, 0.12);
    transform: translateX(4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(79, 172, 254, 0.3);
  }
}

.stack__skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.stack__skill-name {
  font-weight: 600;
  color: rgba(255, 255, 255, 0.95);
  font-size: 1rem;
}

.stack__skill-level {
  font-size: 0.875rem;
  font-weight: 700;
  color: #4facfe;
  background: rgba(79, 172, 254, 0.1);
  border: 1px solid rgba(79, 172, 254, 0.2);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
}

.stack__skill-bar {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

.stack__skill-progress {
  height: 100%;
  background: var(--category-color);
  border-radius: 3px;
  width: 0;
  position: relative;
  
  .stack.is-visible & {
    animation: progress-fill 1.5s ease-out forwards;
    animation-delay: calc(var(--category-delay) * 200ms + var(--skill-delay) * 100ms + 800ms);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    animation: shimmer 2s infinite;
  }
}

.stack__skill-tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-8px);
  background: rgba(34, 34, 59, 0.95);
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 10;
  backdrop-filter: blur(10px);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: rgba(34, 34, 59, 0.95);
  }
  
  &.is-visible {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-12px);
  }
}

.stack__bg-elements {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  z-index: 1;
}

.stack__bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(79, 172, 254, 0.1), rgba(0, 242, 254, 0.05));
  animation: float 6s ease-in-out infinite;
  
  &--1 {
    width: 200px;
    height: 200px;
    top: 10%;
    left: 5%;
    animation-delay: 0s;
  }
  
  &--2 {
    width: 150px;
    height: 150px;
    top: 60%;
    right: 10%;
    animation-delay: 2s;
  }
  
  &--3 {
    width: 100px;
    height: 100px;
    bottom: 20%;
    left: 15%;
    animation-delay: 4s;
  }
}

@media (max-width: 640px) {
  .stack {
    padding: 4rem 1rem;
  }
  
  .stack__category {
    padding: 2rem;
  }
  
  .stack__skill-content {
    padding: 1.25rem;
  }
  
  .stack__skill-tooltip {
    position: fixed;
    bottom: 20px;
    left: 20px;
    right: 20px;
    transform: none;
    white-space: normal;
    text-align: center;
    
    &::after {
      display: none;
    }
  }
}
</style>