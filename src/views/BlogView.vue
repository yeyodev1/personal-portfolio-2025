<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useLanguage } from '@/composables/useLanguage';
import { useBlog } from '@/composables/useBlog';
import BlogCard from '@/components/blog/BlogCard.vue';
import BlogFilters from '@/components/blog/BlogFilters.vue';
import BlogHero from '@/components/blog/BlogHero.vue';

const { t } = useLanguage();
const {
  posts,
  loading,
  error,
  categories,
  selectedCategory,
  searchQuery,
  filteredPosts,
  fetchPosts
} = useBlog();

// Estados locales para la vista
const isVisible = ref(false);
const viewMode = ref<'grid' | 'list'>('grid');

// Computed properties
const postsToShow = computed(() => {
  return filteredPosts.value;
});

const hasResults = computed(() => {
  return postsToShow.value.length > 0;
});

// Lifecycle
onMounted(async () => {
  await fetchPosts();
  isVisible.value = true;
});

// Métodos
const handleCategoryChange = (category: string) => {
  selectedCategory.value = category;
};

const handleSearchChange = (query: string) => {
  searchQuery.value = query;
};

const toggleViewMode = () => {
  viewMode.value = viewMode.value === 'grid' ? 'list' : 'grid';
};
</script>

<template>
  <div class="blog-view">
    <BlogHero />
    
    <main class="blog-main">
      <div class="blog-container">
        <BlogFilters
          :categories="categories"
          :selected-category="selectedCategory"
          :search-query="searchQuery"
          :view-mode="viewMode"
          @category-change="handleCategoryChange"
          @search-change="handleSearchChange"
          @view-mode-change="toggleViewMode"
        />
        
        <div v-if="loading" class="blog-loading">
          <div class="loading-spinner"></div>
          <p>{{ t('blog.loading') }}</p>
        </div>
        
        <!-- Error State -->
        <div v-else-if="error" class="blog-error">
          <div class="error-icon">⚠️</div>
          <h3>{{ t('blog.error.title') }}</h3>
          <p>{{ t('blog.error.message') }}</p>
          <button @click="fetchPosts" class="retry-btn">
            {{ t('blog.error.retry') }}
          </button>
        </div>
        
        <!-- No Results -->
        <div v-else-if="!hasResults" class="blog-empty">
          <div class="empty-icon">📝</div>
          <h3>{{ t('blog.empty.title') }}</h3>
          <p>{{ t('blog.empty.message') }}</p>
        </div>
        
        <!-- Posts Grid/List -->
        <div 
          v-else 
          class="blog-posts"
          :class="{
            'blog-posts--grid': viewMode === 'grid',
            'blog-posts--list': viewMode === 'list',
            'blog-posts--visible': isVisible
          }"
        >
          <BlogCard
            v-for="(post, index) in postsToShow"
            :key="post.id"
            :post="post"
            :view-mode="viewMode"
            :style="{ '--animation-delay': `${index * 0.1}s` }"
          />
        </div>
        <div v-if="hasResults" class="blog-load-more">
          <button class="load-more-btn" disabled>
            {{ t('blog.loadMore') }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.blog-view {
  min-height: 100vh;
  background: linear-gradient(135deg,
      $YEYO-VIOLET 0%,
      rgba(26, 26, 46, 0.95) 20%,
      rgba(22, 33, 62, 0.9) 100%);
}

.blog-main {
  padding: 2rem 0 4rem;
}

.blog-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

// Loading State
.blog-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);

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

// Error State
.blog-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.9);

  .error-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
    color: #ff6b6b;
  }

  p {
    margin-bottom: 2rem;
    opacity: 0.8;
  }

  .retry-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border: none;
    border-radius: 8px;
    color: white;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 25px rgba(79, 172, 254, 0.3);
    }
  }
}

// Empty State
.blog-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);

  .empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
    opacity: 0.6;
  }

  h3 {
    font-size: 1.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    opacity: 0.7;
  }
}

// Posts Layout
.blog-posts {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;

  &--visible {
    opacity: 1;
    transform: translateY(0);
  }

  &--grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 2rem;
  }

  &--list {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
}

// Load More
.blog-load-more {
  display: flex;
  justify-content: center;
  margin-top: 3rem;

  .load-more-btn {
    padding: 1rem 2rem;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(79, 172, 254, 0.3);
    border-radius: 12px;
    color: rgba(255, 255, 255, 0.6);
    font-weight: 600;
    cursor: not-allowed;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    &:not(:disabled) {
      cursor: pointer;
      color: white;
      border-color: #4facfe;

      &:hover {
        background: rgba(79, 172, 254, 0.2);
        transform: translateY(-2px);
      }
    }
  }
}

// Animations
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

// Responsive Design
@media (max-width: 768px) {
  .blog-container {
    padding: 0 1rem;
  }

  .blog-posts {
    &--grid {
      grid-template-columns: 1fr;
      gap: 1.5rem;
    }
  }

  .blog-loading,
  .blog-error,
  .blog-empty {
    padding: 3rem 1rem;
  }
}

@media (max-width: 480px) {
  .blog-posts {
    &--grid {
      gap: 1rem;
    }
  }
}
</style>