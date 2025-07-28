<script setup lang="ts">
import { ref, computed } from 'vue';
import { useLanguage } from '@/composables/useLanguage';
import type { BlogCategory } from '@/composables/useBlog';

interface Props {
  categories: BlogCategory[];
  selectedCategory: string;
  searchQuery: string;
  viewMode: 'grid' | 'list';
}

interface Emits {
  categoryChange: [category: string];
  searchChange: [query: string];
  viewModeChange: [mode: 'grid' | 'list'];
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

const { t } = useLanguage();

// Estados locales
const isSearchFocused = ref(false);
const showMobileFilters = ref(false);

// Computed properties
const allCategories = computed(() => [
  { id: 'all', name: t('blog.filters.allCategories'), slug: 'all', description: '', count: 0 },
  ...props.categories
]);

const hasActiveFilters = computed(() => {
  return props.selectedCategory !== '' || props.searchQuery.trim() !== '';
});

// Métodos
const handleCategoryClick = (categorySlug: string) => {
  const category = categorySlug === 'all' ? '' : categorySlug;
  emit('categoryChange', category);
  showMobileFilters.value = false;
};

const handleSearchInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('searchChange', target.value);
};

const handleViewModeToggle = () => {
  const newMode = props.viewMode === 'grid' ? 'list' : 'grid';
  emit('viewModeChange', newMode);
};

const clearAllFilters = () => {
  emit('categoryChange', '');
  emit('searchChange', '');
};

const toggleMobileFilters = () => {
  showMobileFilters.value = !showMobileFilters.value;
};
</script>

<template>
  <div class="blog-filters">
    <!-- Barra principal de filtros -->
    <div class="blog-filters__main">
      <!-- Búsqueda -->
      <div 
        class="search-container"
        :class="{ 'search-container--focused': isSearchFocused }"
      >
        <div class="search-input-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none">
            <path d="M21 21L16.514 16.506L21 21ZM19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <input
            type="text"
            :value="searchQuery"
            :placeholder="t('blog.filters.searchPlaceholder')"
            class="search-input"
            @input="handleSearchInput"
            @focus="isSearchFocused = true"
            @blur="isSearchFocused = false"
          >
          <button 
            v-if="searchQuery"
            @click="() => emit('searchChange', '')"
            class="search-clear"
            :aria-label="t('blog.filters.clearSearch')"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Controles de vista (desktop) -->
      <div class="view-controls">
        <!-- Botón de vista -->
        <button 
          @click="handleViewModeToggle"
          class="view-toggle"
          :aria-label="t('blog.filters.toggleView')"
        >
          <svg v-if="viewMode === 'grid'" class="view-icon" viewBox="0 0 24 24" fill="none">
            <path d="M8 6H21M8 12H21M8 18H21M3 6H3.01M3 12H3.01M3 18H3.01" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else class="view-icon" viewBox="0 0 24 24" fill="none">
            <path d="M3 3H10V10H3V3ZM14 3H21V10H14V3ZM14 14H21V21H14V14ZM3 14H10V21H3V14Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
        
        <!-- Botón de filtros móvil -->
        <button 
          @click="toggleMobileFilters"
          class="mobile-filters-toggle"
          :class="{ 'mobile-filters-toggle--active': showMobileFilters }"
        >
          <svg class="filter-icon" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ t('blog.filters.filters') }}</span>
          <span v-if="hasActiveFilters" class="active-indicator"></span>
        </button>
      </div>
    </div>
    
    <!-- Categorías (desktop) -->
    <div class="blog-filters__categories">
      <div class="categories-container">
        <button
          v-for="category in allCategories"
          :key="category.id"
          @click="handleCategoryClick(category.slug)"
          class="category-button"
          :class="{
            'category-button--active': 
              (category.slug === 'all' && selectedCategory === '') ||
              (category.slug === selectedCategory)
          }"
        >
          <span class="category-name">{{ category.name }}</span>
          <span v-if="category.count > 0" class="category-count">
            {{ category.count }}
          </span>
        </button>
      </div>
      
      <!-- Limpiar filtros -->
      <button 
        v-if="hasActiveFilters"
        @click="clearAllFilters"
        class="clear-filters"
      >
        <svg class="clear-icon" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span>{{ t('blog.filters.clearAll') }}</span>
      </button>
    </div>
    
    <!-- Panel de filtros móvil -->
    <div 
      class="mobile-filters-panel"
      :class="{ 'mobile-filters-panel--open': showMobileFilters }"
    >
      <div class="mobile-filters-content">
        <div class="mobile-filters-header">
          <h3>{{ t('blog.filters.categories') }}</h3>
          <button 
            @click="toggleMobileFilters"
            class="mobile-filters-close"
          >
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div class="mobile-categories">
          <button
            v-for="category in allCategories"
            :key="category.id"
            @click="handleCategoryClick(category.slug)"
            class="mobile-category-button"
            :class="{
              'mobile-category-button--active': 
                (category.slug === 'all' && selectedCategory === '') ||
                (category.slug === selectedCategory)
            }"
          >
            <span class="category-name">{{ category.name }}</span>
            <span v-if="category.count > 0" class="category-count">
              {{ category.count }}
            </span>
          </button>
        </div>
        
        <div v-if="hasActiveFilters" class="mobile-filters-actions">
          <button @click="clearAllFilters" class="mobile-clear-button">
            {{ t('blog.filters.clearAll') }}
          </button>
        </div>
      </div>
    </div>
    
    <!-- Overlay para móvil -->
    <div 
      v-if="showMobileFilters"
      class="mobile-filters-overlay"
      @click="toggleMobileFilters"
    ></div>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.blog-filters {
  position: sticky;
  top: 80px;
  z-index: 10;
  background: rgba(26, 26, 46, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  margin-bottom: 2rem;
  
  &__main {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  
  &__categories {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1.5rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
}

// Búsqueda
.search-container {
  flex: 1;
  max-width: 400px;
  
  &--focused {
    .search-input-wrapper {
      border-color: #4facfe;
      box-shadow: 0 0 0 3px rgba(79, 172, 254, 0.1);
    }
  }
}

.search-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 0 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.search-icon {
  width: 20px;
  height: 20px;
  color: rgba(255, 255, 255, 0.5);
  margin-right: 0.75rem;
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  padding: 1rem 0;
  outline: none;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.5);
  }
}

.search-clear {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0.25rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
}

// Controles de vista
.view-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.view-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  
  .view-icon {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
}

.mobile-filters-toggle {
  display: none;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  .filter-icon {
    width: 18px;
    height: 18px;
  }
  
  .active-indicator {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 8px;
    height: 8px;
    background: #4facfe;
    border-radius: 50%;
    border: 2px solid rgba(26, 26, 46, 0.95);
  }
  
  &:hover,
  &--active {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
}

// Categorías
.categories-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.category-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 25px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  white-space: nowrap;
  
  .category-name {
    text-transform: capitalize;
  }
  
  .category-count {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.125rem 0.375rem;
    border-radius: 10px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
    transform: translateY(-1px);
  }
  
  &--active {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-color: transparent;
    color: white;
    
    .category-count {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.clear-filters {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid rgba(255, 107, 107, 0.2);
  border-radius: 8px;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.875rem;
  font-weight: 500;
  
  .clear-icon {
    width: 16px;
    height: 16px;
  }
  
  &:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.4);
  }
}

// Panel móvil
.mobile-filters-panel {
  position: fixed;
  top: 0;
  right: -100%;
  width: 300px;
  height: 100vh;
  background: rgba(26, 26, 46, 0.98);
  backdrop-filter: blur(20px);
  border-left: 1px solid rgba(255, 255, 255, 0.1);
  z-index: 1000;
  transition: right 0.3s ease;
  
  &--open {
    right: 0;
  }
}

.mobile-filters-content {
  padding: 2rem 1.5rem;
  height: 100%;
  overflow-y: auto;
}

.mobile-filters-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 2rem;
  
  h3 {
    color: white;
    font-size: 1.25rem;
    font-weight: 600;
    margin: 0;
  }
}

.mobile-filters-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  
  svg {
    width: 20px;
    height: 20px;
  }
  
  &:hover {
    color: white;
    background: rgba(255, 255, 255, 0.1);
  }
}

.mobile-categories {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.mobile-category-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  width: 100%;
  
  .category-name {
    text-transform: capitalize;
    font-weight: 500;
  }
  
  .category-count {
    background: rgba(255, 255, 255, 0.1);
    padding: 0.25rem 0.5rem;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: 600;
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.2);
    color: white;
  }
  
  &--active {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-color: transparent;
    color: white;
    
    .category-count {
      background: rgba(255, 255, 255, 0.2);
    }
  }
}

.mobile-filters-actions {
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-clear-button {
  width: 100%;
  padding: 1rem;
  background: rgba(255, 107, 107, 0.1);
  border: 2px solid rgba(255, 107, 107, 0.2);
  border-radius: 12px;
  color: #ff6b6b;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  
  &:hover {
    background: rgba(255, 107, 107, 0.2);
    border-color: rgba(255, 107, 107, 0.4);
  }
}

.mobile-filters-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

// Responsive Design
@media (max-width: 1024px) {
  .blog-filters {
    &__categories {
      .categories-container {
        display: none;
      }
    }
  }
  
  .mobile-filters-toggle {
    display: flex;
  }
}

@media (max-width: 768px) {
  .blog-filters {
    &__main {
      padding: 0 1rem;
    }
    
    &__categories {
      padding: 0 1rem;
    }
  }
  
  .search-container {
    max-width: none;
  }
  
  .mobile-filters-panel {
    width: 280px;
  }
}

@media (max-width: 480px) {
  .mobile-filters-panel {
    width: 100%;
    right: -100%;
    
    &--open {
      right: 0;
    }
  }
}
</style>