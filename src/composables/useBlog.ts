import { ref, computed, reactive } from 'vue';
import type { Ref, ComputedRef } from 'vue';

// Tipos TypeScript para el sistema de blog
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatar: string;
    bio: string;
  };
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  category: string;
  tags: string[];
  featured: boolean;
  coverImage: {
    url: string;
    alt: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

export interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  count: number;
}

export interface BlogFilters {
  category: string;
  search: string;
  tags: string[];
  featured: boolean;
}

// Estado global del blog (singleton pattern)
const blogState = reactive({
  posts: [] as BlogPost[],
  categories: [] as BlogCategory[],
  loading: false,
  error: null as string | null,
  initialized: false
});

// Filtros reactivos
const filters = reactive<BlogFilters>({
  category: '',
  search: '',
  tags: [],
  featured: false
});

// Mock data para desarrollo (en producción vendría de una API)
const mockPosts: BlogPost[] = [
  {
    id: '1',
    title: 'Construyendo Aplicaciones Escalables con Vue 3 y TypeScript',
    slug: 'vue3-typescript-aplicaciones-escalables',
    excerpt: 'Descubre las mejores prácticas para crear aplicaciones Vue 3 robustas y mantenibles usando TypeScript, Composition API y arquitectura limpia.',
    content: `
      <h2>Introducción</h2>
      <p>Vue 3 junto con TypeScript representa una combinación poderosa para el desarrollo frontend moderno...</p>
      
      <h2>Composition API: El Nuevo Paradigma</h2>
      <p>La Composition API nos permite organizar mejor la lógica de nuestros componentes...</p>
      
      <h2>Arquitectura Escalable</h2>
      <p>Para proyectos grandes, es crucial establecer una arquitectura sólida desde el inicio...</p>
      
      <h2>Conclusiones</h2>
      <p>Vue 3 con TypeScript nos proporciona las herramientas necesarias para construir aplicaciones robustas...</p>
    `,
    author: {
      name: 'Diego Reyes',
      avatar: '/images/avatar.jpg',
      bio: 'Frontend Developer especializado en Vue.js y arquitectura de software'
    },
    publishedAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    readingTime: 8,
    category: 'desarrollo',
    tags: ['Vue.js', 'TypeScript', 'Frontend', 'Arquitectura'],
    featured: true,
    coverImage: {
      url: '/images/blog/vue3-typescript.jpg',
      alt: 'Vue 3 y TypeScript código en pantalla'
    },
    seo: {
      metaTitle: 'Vue 3 + TypeScript: Guía Completa para Aplicaciones Escalables',
      metaDescription: 'Aprende a construir aplicaciones Vue 3 escalables con TypeScript. Guía completa con mejores prácticas y ejemplos reales.',
      keywords: ['Vue 3', 'TypeScript', 'Frontend', 'Desarrollo Web', 'JavaScript']
    }
  },
  {
    id: '2',
    title: 'Optimización de Performance en Aplicaciones Web Modernas',
    slug: 'optimizacion-performance-web-modernas',
    excerpt: 'Técnicas avanzadas para mejorar el rendimiento de tus aplicaciones web: lazy loading, code splitting, y optimización de assets.',
    content: `
      <h2>Core Web Vitals</h2>
      <p>Los Core Web Vitals son métricas esenciales para medir la experiencia del usuario...</p>
      
      <h2>Lazy Loading y Code Splitting</h2>
      <p>Estas técnicas nos permiten cargar solo el código necesario cuando se necesita...</p>
      
      <h2>Optimización de Assets</h2>
      <p>Las imágenes y otros recursos pueden impactar significativamente el rendimiento...</p>
    `,
    author: {
      name: 'Diego Reyes',
      avatar: '/images/avatar.jpg',
      bio: 'Frontend Developer especializado en Vue.js y arquitectura de software'
    },
    publishedAt: '2024-01-10T14:30:00Z',
    updatedAt: '2024-01-10T14:30:00Z',
    readingTime: 12,
    category: 'performance',
    tags: ['Performance', 'Optimización', 'Web Vitals', 'UX'],
    featured: false,
    coverImage: {
      url: '/images/blog/performance-optimization.jpg',
      alt: 'Gráficos de performance y métricas web'
    },
    seo: {
      metaTitle: 'Optimización de Performance Web: Guía Completa 2024',
      metaDescription: 'Mejora el rendimiento de tu web con técnicas avanzadas de optimización. Lazy loading, code splitting y más.',
      keywords: ['Performance', 'Optimización Web', 'Core Web Vitals', 'UX']
    }
  },
  {
    id: '3',
    title: 'Design Systems: Creando Consistencia en Equipos de Desarrollo',
    slug: 'design-systems-consistencia-equipos',
    excerpt: 'Cómo implementar un design system efectivo que mejore la colaboración entre diseñadores y desarrolladores.',
    content: `
      <h2>¿Qué es un Design System?</h2>
      <p>Un design system es mucho más que una librería de componentes...</p>
      
      <h2>Beneficios para el Equipo</h2>
      <p>La implementación de un design system trae múltiples beneficios...</p>
      
      <h2>Implementación Práctica</h2>
      <p>Veamos cómo implementar un design system desde cero...</p>
    `,
    author: {
      name: 'Diego Reyes',
      avatar: '/images/avatar.jpg',
      bio: 'Frontend Developer especializado en Vue.js y arquitectura de software'
    },
    publishedAt: '2024-01-05T09:15:00Z',
    updatedAt: '2024-01-05T09:15:00Z',
    readingTime: 10,
    category: 'design',
    tags: ['Design System', 'UI/UX', 'Componentes', 'Colaboración'],
    featured: true,
    coverImage: {
      url: '/images/blog/design-systems.jpg',
      alt: 'Componentes de design system organizados'
    },
    seo: {
      metaTitle: 'Design Systems: Guía Completa para Equipos de Desarrollo',
      metaDescription: 'Aprende a crear y mantener design systems efectivos. Mejora la consistencia y colaboración en tu equipo.',
      keywords: ['Design System', 'UI', 'UX', 'Componentes', 'Frontend']
    }
  }
];

const mockCategories: BlogCategory[] = [
  { id: '1', name: 'Desarrollo', slug: 'desarrollo', description: 'Artículos sobre desarrollo frontend y backend', count: 1 },
  { id: '2', name: 'Performance', slug: 'performance', description: 'Optimización y rendimiento web', count: 1 },
  { id: '3', name: 'Design', slug: 'design', description: 'Design systems y UI/UX', count: 1 },
  { id: '4', name: 'Arquitectura', slug: 'arquitectura', description: 'Patrones y arquitectura de software', count: 0 }
];

/**
 * Composable principal para el manejo del blog
 * Implementa el patrón de estado global con reactividad de Vue 3
 */
export function useBlog() {
  // Referencias reactivas para la interfaz
  const selectedCategory: Ref<string> = ref(filters.category);
  const searchQuery: Ref<string> = ref(filters.search);
  const selectedTags: Ref<string[]> = ref([...filters.tags]);
  const showFeaturedOnly: Ref<boolean> = ref(filters.featured);

  // Computed properties para filtrado inteligente
  const filteredPosts: ComputedRef<BlogPost[]> = computed(() => {
    let result = [...blogState.posts];

    // Filtro por categoría
    if (selectedCategory.value && selectedCategory.value !== 'all') {
      result = result.filter(post => post.category === selectedCategory.value);
    }

    // Filtro por búsqueda (título, excerpt, tags)
    if (searchQuery.value.trim()) {
      const query = searchQuery.value.toLowerCase().trim();
      result = result.filter(post => 
        post.title.toLowerCase().includes(query) ||
        post.excerpt.toLowerCase().includes(query) ||
        post.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Filtro por tags
    if (selectedTags.value.length > 0) {
      result = result.filter(post => 
        selectedTags.value.some(tag => post.tags.includes(tag))
      );
    }

    // Filtro por featured
    if (showFeaturedOnly.value) {
      result = result.filter(post => post.featured);
    }

    // Ordenar por fecha de publicación (más recientes primero)
    return result.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });

  const featuredPosts: ComputedRef<BlogPost[]> = computed(() => 
    blogState.posts.filter(post => post.featured)
  );

  const recentPosts: ComputedRef<BlogPost[]> = computed(() => 
    [...blogState.posts]
      .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, 5)
  );

  const allTags: ComputedRef<string[]> = computed(() => {
    const tags = new Set<string>();
    blogState.posts.forEach(post => {
      post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
  });

  // Métodos para gestión de datos
  const fetchPosts = async (): Promise<void> => {
    if (blogState.initialized) return;
    
    try {
      blogState.loading = true;
      blogState.error = null;
      
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      blogState.posts = mockPosts;
      blogState.categories = mockCategories;
      blogState.initialized = true;
    } catch (error) {
      blogState.error = error instanceof Error ? error.message : 'Error desconocido';
    } finally {
      blogState.loading = false;
    }
  };

  const getPostBySlug = async (slug: string): Promise<BlogPost | null> => {
    if (!blogState.initialized) {
      await fetchPosts();
    }
    
    return blogState.posts.find(post => post.slug === slug) || null;
  };

  const getPostsByCategory = (categorySlug: string): BlogPost[] => {
    return blogState.posts.filter(post => post.category === categorySlug);
  };

  const getRelatedPosts = (currentPost: BlogPost, limit: number = 3): BlogPost[] => {
    return blogState.posts
      .filter(post => 
        post.id !== currentPost.id && 
        (post.category === currentPost.category || 
         post.tags.some(tag => currentPost.tags.includes(tag)))
      )
      .slice(0, limit);
  };

  // Métodos para actualizar filtros
  const updateFilters = (newFilters: Partial<BlogFilters>): void => {
    Object.assign(filters, newFilters);
    
    if (newFilters.category !== undefined) selectedCategory.value = newFilters.category;
    if (newFilters.search !== undefined) searchQuery.value = newFilters.search;
    if (newFilters.tags !== undefined) selectedTags.value = [...newFilters.tags];
    if (newFilters.featured !== undefined) showFeaturedOnly.value = newFilters.featured;
  };

  const clearFilters = (): void => {
    updateFilters({
      category: '',
      search: '',
      tags: [],
      featured: false
    });
  };

  // Utilidades
  const formatDate = (dateString: string, locale: string = 'es-ES'): string => {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  // API pública del composable
  return {
    // Estado
    posts: computed(() => blogState.posts),
    categories: computed(() => blogState.categories),
    loading: computed(() => blogState.loading),
    error: computed(() => blogState.error),
    
    // Filtros
    selectedCategory,
    searchQuery,
    selectedTags,
    showFeaturedOnly,
    
    // Computed
    filteredPosts,
    featuredPosts,
    recentPosts,
    allTags,
    
    // Métodos
    fetchPosts,
    getPostBySlug,
    getPostsByCategory,
    getRelatedPosts,
    updateFilters,
    clearFilters,
    formatDate,
    calculateReadingTime
  };
}

// Composable específico para un post individual
export function useBlogPost(slug: string) {
  const post: Ref<BlogPost | null> = ref(null);
  const loading: Ref<boolean> = ref(false);
  const error: Ref<string | null> = ref(null);
  const relatedPosts: Ref<BlogPost[]> = ref([]);
  
  const { getPostBySlug, getRelatedPosts } = useBlog();
  
  const fetchPost = async (): Promise<void> => {
    try {
      loading.value = true;
      error.value = null;
      
      const foundPost = await getPostBySlug(slug);
      
      if (!foundPost) {
        error.value = 'Post no encontrado';
        return;
      }
      
      post.value = foundPost;
      relatedPosts.value = getRelatedPosts(foundPost);
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error desconocido';
    } finally {
      loading.value = false;
    }
  };
  
  return {
    post,
    loading,
    error,
    relatedPosts,
    fetchPost
  };
}