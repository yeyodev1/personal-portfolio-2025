<script setup lang="ts">
import { ref, onMounted } from 'vue';
import ProjectCard from '../card/ProjectCard.vue';

// Estado y Lógica del Componente
const sectionContainer = ref<HTMLElement | null>(null);
const gridContainer = ref<HTMLDivElement | null>(null);
const isVisible = ref(false);
const mousePosition = ref({ x: 0, y: 0 });
const hoveredProject = ref<string | null>(null);

// Datos de proyectos mejorados con más información
const projects = ref([
  {
    id: 'proj-1',
    title: 'Plataforma de E-commerce',
    category: 'Desarrollo Web',
    description: 'Sistema completo de comercio electrónico con carrito, pagos y gestión de inventario',
    technologies: ['Vue.js', 'Node.js', 'MongoDB', 'Stripe'],
    imageUrl: 'https://placehold.co/600x400/42b883/ffffff?text=E-commerce',
    projectUrl: '#',
    featured: true,
    status: 'Completado'
  },
  {
    id: 'proj-2',
    title: 'Dashboard Analítico',
    category: 'Aplicación Web',
    description: 'Panel de control con métricas en tiempo real y visualización de datos avanzada',
    technologies: ['Vue.js', 'TypeScript', 'Chart.js', 'WebSockets'],
    imageUrl: 'https://placehold.co/600x400/9a031e/ffffff?text=Dashboard',
    projectUrl: '#',
    featured: false,
    status: 'En desarrollo'
  },
  {
    id: 'proj-3',
    title: 'Landing Page Corporativa',
    category: 'Diseño y Desarrollo',
    description: 'Sitio web corporativo responsive con animaciones y optimización SEO',
    technologies: ['Vue.js', 'SCSS', 'Vite', 'Netlify'],
    imageUrl: 'https://placehold.co/600x400/4a4e69/ffffff?text=Landing',
    projectUrl: '#',
    featured: true,
    status: 'Completado'
  },
  {
    id: 'proj-4',
    title: 'API RESTful Segura',
    category: 'Backend',
    description: 'API robusta con autenticación JWT, rate limiting y documentación completa',
    technologies: ['Node.js', 'Express', 'PostgreSQL', 'JWT'],
    imageUrl: 'https://placehold.co/600x400/22223b/ffffff?text=API+REST',
    projectUrl: '#',
    featured: false,
    status: 'Completado'
  },
  {
    id: 'proj-5',
    title: 'App Móvil Híbrida',
    category: 'Desarrollo Móvil',
    description: 'Aplicación móvil multiplataforma con sincronización offline',
    technologies: ['Vue.js', 'Capacitor', 'Ionic', 'Firebase'],
    imageUrl: 'https://placehold.co/600x400/66d9a5/ffffff?text=Mobile+App',
    projectUrl: '#',
    featured: true,
    status: 'En desarrollo'
  },
  {
    id: 'proj-6',
    title: 'Sistema de Gestión',
    category: 'Aplicación Empresarial',
    description: 'ERP personalizado para gestión de recursos y procesos empresariales',
    technologies: ['Vue.js', 'Laravel', 'MySQL', 'Redis'],
    imageUrl: 'https://placehold.co/600x400/f4c2a1/22223b?text=ERP+System',
    projectUrl: '#',
    featured: false,
    status: 'Completado'
  }
]);

// Estadísticas de proyectos
const projectStats = ref([
  { label: 'Proyectos Completados', value: '15+', icon: '✅' },
  { label: 'Clientes Satisfechos', value: '12+', icon: '😊' },
  { label: 'Tecnologías Usadas', value: '20+', icon: '🛠️' },
  { label: 'Años de Experiencia', value: '3+', icon: '📅' }
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

// Manejo de hover en proyectos
const handleProjectHover = (projectId: string | null) => {
  hoveredProject.value = projectId;
};

// Configuración del IntersectionObserver
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
  <section 
    ref="sectionContainer"
    class="projects"
    :class="{ 'projects--visible': isVisible }"
  >


    <div class="projects__container">
      <!-- Header mejorado -->
      <div class="projects__header">
        <div class="projects__header-content">
          <span class="projects__badge">💼 Portfolio</span>
          <h2 class="projects__title">
            <span class="projects__title-main">Mis</span>
            <span class="projects__title-accent">Proyectos</span>
          </h2>
          <p class="projects__subtitle">
            Una selección cuidadosa de mis trabajos más destacados,
            <br class="projects__subtitle-break">
            donde la innovación se encuentra con la funcionalidad
          </p>
        </div>
        
        <!-- Estadísticas de proyectos -->
        <div class="projects__stats">
          <div 
            v-for="(stat, index) in projectStats"
            :key="stat.label"
            class="projects__stat"
            :style="{ '--stat-index': index }"
          >
            <div class="projects__stat-icon">{{ stat.icon }}</div>
            <div class="projects__stat-content">
              <div class="projects__stat-value">{{ stat.value }}</div>
              <div class="projects__stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Filtros de categorías -->
      <div class="projects__filters">
        <button class="projects__filter projects__filter--active">
          Todos los Proyectos
        </button>
        <button class="projects__filter">Desarrollo Web</button>
        <button class="projects__filter">Aplicaciones</button>
        <button class="projects__filter">Backend</button>
      </div>
      
      <!-- Grilla de proyectos mejorada -->
      <div 
        ref="gridContainer" 
        class="projects__grid" 
        :class="{ 'projects__grid--visible': isVisible }"
      >
        <div
          v-for="(project, index) in projects"
          :key="project.id"
          class="projects__card-wrapper"
          :class="{
            'projects__card-wrapper--featured': project.featured,
            'projects__card-wrapper--hovered': hoveredProject === project.id
          }"
          :style="{ '--stagger-index': index }"
          @mouseenter="handleProjectHover(project.id)"
          @mouseleave="handleProjectHover(null)"
        >
          <div class="projects__card">
            <div class="projects__card-image">
              <img :src="project.imageUrl" :alt="project.title" />
              <div class="projects__card-overlay">
                <div class="projects__card-status" :class="`projects__card-status--${project.status.toLowerCase().replace(' ', '-')}`">
                  {{ project.status }}
                </div>
                <div class="projects__card-actions">
                  <button class="projects__card-action">
                    <span>👁️</span> Ver Proyecto
                  </button>
                  <button class="projects__card-action">
                    <span>🔗</span> Código
                  </button>
                </div>
              </div>
            </div>
            
            <div class="projects__card-content">
              <div class="projects__card-header">
                <h3 class="projects__card-title">{{ project.title }}</h3>
                <span class="projects__card-category">{{ project.category }}</span>
              </div>
              
              <p class="projects__card-description">{{ project.description }}</p>
              
              <div class="projects__card-technologies">
                <span 
                  v-for="tech in project.technologies"
                  :key="tech"
                  class="projects__card-tech"
                >
                  {{ tech }}
                </span>
              </div>
            </div>
            

          </div>
        </div>
      </div>
      
      <!-- Call to action -->
      <div class="projects__cta">
        <p class="projects__cta-text">
          ¿Tienes un proyecto en mente? ¡Hablemos!
        </p>
        <button class="projects__cta-button">
          <span class="projects__cta-button-text">Contactar</span>
          <span class="projects__cta-button-icon">→</span>
        </button>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

// Animaciones esenciales
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes gradient-shift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

// Sección principal
.projects {
  position: relative;
  min-height: 100vh;
  padding: 120px 0;
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
  overflow: hidden;



  // Contenedor principal
  &__container {
    position: relative;
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 20px;
    z-index: 2;
  }

  // Header
  &__header {
    text-align: center;
    margin-bottom: 80px;
    opacity: 0;
    animation: fade-in-up 1s ease-out 0.2s forwards;
  }

  &__header-content {
    margin-bottom: 60px;
  }

  &__badge {
    display: inline-block;
    padding: 8px 20px;
    background: rgba(79, 172, 254, 0.1);
    border: 1px solid rgba(79, 172, 254, 0.3);
    border-radius: 25px;
    color: #4facfe;
    font-size: 0.9rem;
    font-weight: 500;
    margin-bottom: 20px;
    backdrop-filter: blur(10px);
  }

  &__title {
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    margin-bottom: 20px;
    line-height: 1.1;
  }

  &__title-main {
    color: #ffffff;
    display: block;
  }

  &__title-accent {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-size: 200% 200%;
    animation: gradient-shift 3s ease infinite;
    display: block;
  }

  &__subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.85);
    max-width: 600px;
    margin: 0 auto;
    line-height: 1.6;
  }

  &__subtitle-break {
    display: none;
  }

  // Estadísticas simplificadas
  &__stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    max-width: 800px;
    margin: 0 auto;
  }

  &__stat {
    display: flex;
    align-items: center;
    gap: 15px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-5px);
      background: rgba(255, 255, 255, 0.08);
    }
  }

  &__stat-icon {
    font-size: 1.5rem;
  }

  &__stat-value {
    font-size: 1.5rem;
    font-weight: 700;
    color: #4facfe;
    line-height: 1;
  }

  &__stat-label {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.7);
    margin-top: 2px;
  }

  // Filtros simplificados
  &__filters {
    display: flex;
    justify-content: center;
    gap: 15px;
    margin-bottom: 60px;
    flex-wrap: wrap;
  }

  &__filter {
    padding: 12px 24px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 25px;
    color: rgba(255, 255, 255, 0.8);
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);

    &:hover {
      background: rgba(255, 255, 255, 0.08);
      color: #4facfe;
      transform: translateY(-2px);
    }

    &--active {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      border-color: transparent;
      color: #ffffff;
      font-weight: 600;
    }
  }

  // Grilla de proyectos
  &__grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 30px;
    margin-bottom: 80px;
    opacity: 0;
    transform: translateY(50px);
    transition: all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);

    &--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // Wrapper de tarjetas simplificado
  &__card-wrapper {
    transition: all 0.3s ease;

    &--featured {
      .projects__card {
        border: 2px solid rgba(79, 172, 254, 0.3);
      }
    }

    &--hovered {
      transform: translateY(-10px);
      z-index: 10;
    }
  }

  // Tarjetas de proyecto simplificadas
  &__card {
    position: relative;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    overflow: hidden;
    backdrop-filter: blur(20px);
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;

    &:hover {
      border-color: rgba(79, 172, 254, 0.3);
      transform: translateY(-5px);
      
      .projects__card-image img {
        transform: scale(1.05);
      }
      
      .projects__card-overlay {
        opacity: 1;
      }
    }
  }

  &__card-image {
    position: relative;
    height: 250px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
  }

  &__card-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      to bottom,
      rgba(34, 34, 59, 0.1) 0%,
      rgba(34, 34, 59, 0.8) 100%
    );
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 2;
  }

  &__card-status {
    align-self: flex-start;
    padding: 6px 12px;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    
    &--completado {
      background: rgba(79, 172, 254, 0.2);
      color: #4facfe;
      border: 1px solid rgba(79, 172, 254, 0.3);
    }
    
    &--en-desarrollo {
      background: rgba(255, 107, 107, 0.2);
      color: #ff6b6b;
      border: 1px solid rgba(255, 107, 107, 0.3);
    }
  }

  &__card-actions {
    display: flex;
    gap: 10px;
    align-self: flex-end;
  }

  &__card-action {
    padding: 10px 15px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: #f2e9e4;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(79, 172, 254, 0.2);
      border-color: rgba(79, 172, 254, 0.4);
      transform: translateY(-2px);
    }
  }

  &__card-content {
    padding: 25px;
    flex: 1;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 2;
  }

  &__card-header {
    margin-bottom: 15px;
  }

  &__card-title {
    font-size: 1.4rem;
    font-weight: 700;
    color: #f2e9e4;
    margin-bottom: 8px;
    line-height: 1.3;
  }

  &__card-category {
    display: inline-block;
    padding: 4px 12px;
    background: rgba(102, 217, 165, 0.1);
    border: 1px solid rgba(102, 217, 165, 0.2);
    border-radius: 12px;
    color: #66d9a5;
    font-size: 0.8rem;
    font-weight: 500;
  }

  &__card-description {
    color: rgba(242, 233, 228, 0.8);
    line-height: 1.6;
    margin-bottom: 20px;
    flex: 1;
  }

  &__card-technologies {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  &__card-tech {
    padding: 6px 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 15px;
    color: rgba(242, 233, 228, 0.9);
    font-size: 0.8rem;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(79, 172, 254, 0.1);
      border-color: rgba(79, 172, 254, 0.3);
      color: #4facfe;
    }
  }



  // Call to action simplificado
  &__cta {
    text-align: center;
    padding: 60px 20px;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 20px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
  }

  &__cta-text {
    font-size: 1.3rem;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 30px;
    font-weight: 500;
  }

  &__cta-button {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 30px;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border: none;
    border-radius: 50px;
    color: #ffffff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    text-decoration: none;
    box-shadow: 0 4px 20px rgba(79, 172, 254, 0.3);

    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 8px 30px rgba(79, 172, 254, 0.4);
    }
  }

  &__cta-button-icon {
    font-size: 1.2rem;
    transition: transform 0.3s ease;
  }

  &__cta-button:hover &__cta-button-icon {
    transform: translateX(5px);
  }

  // Estados de visibilidad
  &--visible {
    .projects__header,
    .projects__filters,
    .projects__cta {
      animation-play-state: running;
    }
  }
}

// --- Lógica de la animación en cascada ---

// 6. Por defecto, las tarjetas están ocultas.
.project-card {
  opacity: 0;
}

// 7. Cuando el contenedor se hace visible...
.projects__grid.is-visible {
  .project-card {
    // ...aplicamos la animación a cada tarjeta.
    animation: fade-in-up 0.6s ease-out forwards;
    // 8. (LA MAGIA) Usamos la variable para calcular el retraso de cada tarjeta.
    animation-delay: calc(var(--stagger-index) * 120ms);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .projects {
    padding: 80px 0;
    
    &__container {
      padding: 0 15px;
    }
    
    &__title {
      font-size: clamp(2rem, 6vw, 3rem);
    }
    
    &__grid {
      grid-template-columns: 1fr;
      gap: 20px;
    }
    
    &__stats {
      grid-template-columns: repeat(2, 1fr);
    }
    
    &__filters {
      gap: 10px;
    }
  }
}

@media (max-width: 480px) {
  .projects {
    &__stats {
      grid-template-columns: 1fr;
    }
    
    &__filters {
      flex-direction: column;
      align-items: center;
    }
  }
}
</style>