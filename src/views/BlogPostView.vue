<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLanguage } from '@/composables/useLanguage';
import { useBlogPost } from '@/composables/useBlog';

const route = useRoute();
const { t } = useLanguage();
const slug = route.params.slug as string;
const { post, loading, error, fetchPost } = useBlogPost(slug);

// Estados para personalización
const fontSize = ref<'small' | 'medium' | 'large'>('medium');
const isDarkMode = ref(true);

// Computed para clases CSS
const containerClasses = computed(() => ({
  'post-view': true,
  'post-view--dark': isDarkMode.value,
  'post-view--light': !isDarkMode.value,
  [`post-view--${fontSize.value}`]: true
}));

// Lifecycle
onMounted(() => {
  fetchPost();
});

// Métodos
const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
};

const changeFontSize = (size: 'small' | 'medium' | 'large') => {
  fontSize.value = size;
};
</script>

<template>
  <div :class="containerClasses">
    <!-- Controles de personalización -->
    <div class="post-controls">
      <div class="font-controls">
        <button 
          v-for="size in ['small', 'medium', 'large']" 
          :key="size"
          @click="changeFontSize(size as any)"
          :class="{ active: fontSize === size }"
          class="font-btn"
        >
          {{ size === 'small' ? 'A' : size === 'medium' ? 'A' : 'A' }}
        </button>
      </div>
      
      <button @click="toggleTheme" class="theme-toggle">
        {{ isDarkMode ? '☀️' : '🌙' }}
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="post-loading">
      <div class="loading-spinner"></div>
      <p>Cargando artículo...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="post-error">
      <h2>❌ Error</h2>
      <p>{{ error }}</p>
    </div>

    <!-- Post Content -->
    <article v-else-if="post" class="post-content">
      <!-- Header -->
      <header class="post-header">
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span class="post-date">{{ new Date(post.publishedAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}</span>
          <span class="post-reading-time">{{ post.readingTime }} min de lectura</span>
          <span class="post-category">{{ post.category }}</span>
        </div>
      </header>

      <!-- Content -->
      <div class="post-body" v-html="post.content"></div>

      <!-- Tags -->
      <footer class="post-footer">
        <div class="post-tags">
          <span v-for="tag in post.tags" :key="tag" class="tag">
            #{{ tag }}
          </span>
        </div>
      </footer>
    </article>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.post-view {
  min-height: 100vh;
  padding: 2rem 1rem;
  transition: all 0.3s ease;
  
  // Modo oscuro (por defecto)
  &--dark {
    background: linear-gradient(135deg, 
      $YEYO-VIOLET 0%, 
      rgba(26, 26, 46, 0.95) 20%, 
      rgba(22, 33, 62, 0.9) 100%
    );
    color: rgba(255, 255, 255, 0.9);
  }
  
  // Modo claro
  &--light {
    background: linear-gradient(135deg, 
      #f8fafc 0%, 
      #e2e8f0 20%, 
      #cbd5e1 100%
    );
    color: #1a202c;
  }
  
  // Tamaños de fuente
  &--small {
    .post-body {
      font-size: 0.9rem;
      line-height: 1.6;
    }
    .post-title {
      font-size: 2rem;
    }
  }
  
  &--medium {
    .post-body {
      font-size: 1.1rem;
      line-height: 1.7;
    }
    .post-title {
      font-size: 2.5rem;
    }
  }
  
  &--large {
    .post-body {
      font-size: 1.3rem;
      line-height: 1.8;
    }
    .post-title {
      font-size: 3rem;
    }
  }
}

// Controles de personalización
.post-controls {
  position: fixed;
  top: 2rem;
  right: 2rem;
  display: flex;
  gap: 1rem;
  z-index: 100;
  
  .font-controls {
    display: flex;
    gap: 0.5rem;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    padding: 0.5rem;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }
  
  .font-btn {
    width: 40px;
    height: 40px;
    border: none;
    border-radius: 8px;
    background: transparent;
    color: inherit;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    
    &.active {
      background: rgba(79, 172, 254, 0.3);
      color: #4facfe;
    }
    
    &:nth-child(1) { font-size: 0.8rem; }
    &:nth-child(2) { font-size: 1rem; }
    &:nth-child(3) { font-size: 1.2rem; }
  }
  
  .theme-toggle {
    width: 50px;
    height: 50px;
    border: none;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    cursor: pointer;
    font-size: 1.5rem;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: scale(1.05);
    }
  }
}

// Estados de carga y error
.post-loading,
.post-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
  
  .loading-spinner {
    width: 40px;
    height: 40px;
    border: 3px solid rgba(79, 172, 254, 0.3);
    border-top: 3px solid #4facfe;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
  }
}

// Contenido del post
.post-content {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  
  .post-view--light & {
    background: rgba(255, 255, 255, 0.8);
    border: 1px solid rgba(0, 0, 0, 0.1);
  }
}

.post-header {
  margin-bottom: 3rem;
  text-align: center;
  
  .post-title {
    margin-bottom: 1.5rem;
    font-weight: 700;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1.2;
  }
  
  .post-meta {
    display: flex;
    justify-content: center;
    gap: 2rem;
    flex-wrap: wrap;
    opacity: 0.8;
    font-size: 0.9rem;
    
    span {
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 20px;
      
      .post-view--light & {
        background: rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.post-body {
  margin-bottom: 3rem;
  
  :deep(h2) {
    font-size: 1.8rem;
    margin: 2rem 0 1rem;
    color: #4facfe;
    font-weight: 600;
  }
  
  :deep(p) {
    margin-bottom: 1.5rem;
    text-align: justify;
  }
  
  :deep(code) {
    background: rgba(79, 172, 254, 0.2);
    padding: 0.2rem 0.5rem;
    border-radius: 4px;
    font-family: 'Fira Code', monospace;
  }
}

.post-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 2rem;
  
  .post-view--light & {
    border-top-color: rgba(0, 0, 0, 0.1);
  }
  
  .post-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .tag {
      padding: 0.5rem 1rem;
      background: rgba(79, 172, 254, 0.2);
      border-radius: 20px;
      font-size: 0.9rem;
      color: #4facfe;
      font-weight: 500;
    }
  }
}

// Animaciones
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// Responsive
@media (max-width: 768px) {
  .post-view {
    padding: 1rem 0.5rem;
    
    &--small .post-title { font-size: 1.5rem; }
    &--medium .post-title { font-size: 2rem; }
    &--large .post-title { font-size: 2.5rem; }
  }
  
  .post-controls {
    top: 1rem;
    right: 1rem;
    
    .font-controls {
      padding: 0.3rem;
    }
    
    .font-btn {
      width: 35px;
      height: 35px;
    }
    
    .theme-toggle {
      width: 45px;
      height: 45px;
    }
  }
  
  .post-content {
    padding: 2rem 1.5rem;
    margin: 0 0.5rem;
  }
  
  .post-header .post-meta {
    gap: 1rem;
    
    span {
      padding: 0.3rem 0.8rem;
      font-size: 0.8rem;
    }
  }
}

@media (max-width: 480px) {
  .post-content {
    padding: 1.5rem 1rem;
  }
  
  .post-header .post-meta {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>