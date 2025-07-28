<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useLanguage } from '@/composables/useLanguage';
import { useBlog } from '@/composables/useBlog';
import type { BlogPost } from '@/composables/useBlog';

interface Props {
  post: BlogPost;
  viewMode: 'grid' | 'list';
}

const props = defineProps<Props>();

const router = useRouter();
const { t } = useLanguage();
const { formatDate } = useBlog();

// Computed properties
const formattedDate = computed(() => {
  return formatDate(props.post.publishedAt);
});

const readingTimeText = computed(() => {
  return t('blog.card.readingTime', { minutes: props.post.readingTime });
});

const categoryText = computed(() => {
  return props.post.category.charAt(0).toUpperCase() + props.post.category.slice(1);
});

// Métodos
const navigateToPost = () => {
  router.push(`/blog/${props.post.slug}`);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    navigateToPost();
  }
};
</script>

<template>
  <article 
    class="blog-card"
    :class="{
      'blog-card--grid': viewMode === 'grid',
      'blog-card--list': viewMode === 'list',
      'blog-card--featured': post.featured
    }"
    tabindex="0"
    role="button"
    :aria-label="t('blog.card.readPost', { title: post.title })"
    @click="navigateToPost"
    @keydown="handleKeydown"
  >
    <!-- Imagen de portada -->
    <div class="blog-card__image">
      <img 
        :src="post.coverImage.url" 
        :alt="post.coverImage.alt"
        loading="lazy"
        class="cover-image"
      >
      
      <!-- Badge de featured -->
      <div v-if="post.featured" class="featured-badge">
        <svg class="featured-icon" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z" fill="currentColor"/>
        </svg>
        <span>{{ t('blog.card.featured') }}</span>
      </div>
      
      <!-- Overlay de hover -->
      <div class="image-overlay">
        <div class="overlay-content">
          <svg class="read-icon" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ t('blog.card.readMore') }}</span>
        </div>
      </div>
    </div>
    
    <!-- Contenido -->
    <div class="blog-card__content">
      <!-- Meta información -->
      <div class="blog-card__meta">
        <div class="meta-left">
          <span class="category-tag">
            {{ categoryText }}
          </span>
          <span class="meta-divider">•</span>
          <time :datetime="post.publishedAt" class="publish-date">
            {{ formattedDate }}
          </time>
        </div>
        <div class="meta-right">
          <div class="reading-time">
            <svg class="clock-icon" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2"/>
              <path d="M12 6V12L16 14" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span>{{ readingTimeText }}</span>
          </div>
        </div>
      </div>
      
      <!-- Título -->
      <h2 class="blog-card__title">
        {{ post.title }}
      </h2>
      
      <!-- Excerpt -->
      <p class="blog-card__excerpt">
        {{ post.excerpt }}
      </p>
      
      <!-- Tags -->
      <div class="blog-card__tags">
        <span 
          v-for="tag in post.tags.slice(0, 3)"
          :key="tag"
          class="tag"
        >
          #{{ tag }}
        </span>
        <span v-if="post.tags.length > 3" class="tag tag--more">
          +{{ post.tags.length - 3 }}
        </span>
      </div>
      
      <!-- Footer -->
      <div class="blog-card__footer">
        <div class="author-info">
          <img 
            :src="post.author.avatar" 
            :alt="post.author.name"
            class="author-avatar"
            loading="lazy"
          >
          <div class="author-details">
            <span class="author-name">{{ post.author.name }}</span>
            <span class="author-role">{{ t('blog.card.author') }}</span>
          </div>
        </div>
        
        <button class="read-more-btn" :aria-label="t('blog.card.readPost', { title: post.title })">
          <span>{{ t('blog.card.readMore') }}</span>
          <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
            <path d="M7 17L17 7M17 7H7M17 7V17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.blog-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
  position: relative;
  opacity: 0;
  transform: translateY(30px);
  animation: cardFadeIn 0.6s ease forwards;
  animation-delay: var(--animation-delay, 0s);
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(79, 172, 254, 0.3);
    
    .cover-image {
      transform: scale(1.05);
    }
    
    .image-overlay {
      opacity: 1;
    }
    
    .blog-card__title {
      color: #4facfe;
    }
    
    .read-more-btn {
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      color: white;
      
      .arrow-icon {
        transform: translate(2px, -2px);
      }
    }
  }
  
  &:focus {
    outline: 2px solid #4facfe;
    outline-offset: 2px;
  }
  
  // Vista Grid
  &--grid {
    display: flex;
    flex-direction: column;
    height: 100%;
    
    .blog-card__image {
      height: 240px;
    }
    
    .blog-card__content {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 1.5rem;
    }
    
    .blog-card__footer {
      margin-top: auto;
    }
  }
  
  // Vista List
  &--list {
    display: grid;
    grid-template-columns: 300px 1fr;
    align-items: center;
    
    .blog-card__image {
      height: 200px;
    }
    
    .blog-card__content {
      padding: 2rem;
    }
    
    .blog-card__title {
      font-size: 1.5rem;
    }
    
    .blog-card__excerpt {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  }
  
  // Featured post
  &--featured {
    border: 2px solid rgba(79, 172, 254, 0.3);
    background: linear-gradient(135deg, 
      rgba(79, 172, 254, 0.1) 0%, 
      rgba(0, 242, 254, 0.05) 100%
    );
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    }
  }
}

// Imagen
.blog-card__image {
  position: relative;
  overflow: hidden;
  
  .cover-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }
  
  .featured-badge {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    align-items: center;
    gap: 0.25rem;
    padding: 0.5rem 0.75rem;
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-radius: 20px;
    color: white;
    font-size: 0.75rem;
    font-weight: 600;
    z-index: 2;
    
    .featured-icon {
      width: 14px;
      height: 14px;
    }
  }
  
  .image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(79, 172, 254, 0.8) 0%, 
      rgba(0, 242, 254, 0.6) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    
    .overlay-content {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: white;
      font-weight: 600;
      font-size: 1rem;
      
      .read-icon {
        width: 20px;
        height: 20px;
      }
    }
  }
}

// Contenido
.blog-card__content {
  color: white;
}

.blog-card__meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 0.875rem;
  
  .meta-left {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .category-tag {
    background: rgba(79, 172, 254, 0.2);
    color: #4facfe;
    padding: 0.25rem 0.75rem;
    border-radius: 12px;
    font-weight: 600;
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  
  .meta-divider {
    color: rgba(255, 255, 255, 0.3);
  }
  
  .publish-date {
    color: rgba(255, 255, 255, 0.7);
  }
  
  .reading-time {
    display: flex;
    align-items: center;
    gap: 0.25rem;
    color: rgba(255, 255, 255, 0.6);
    
    .clock-icon {
      width: 14px;
      height: 14px;
    }
  }
}

.blog-card__title {
  font-size: 1.25rem;
  font-weight: 700;
  line-height: 1.3;
  margin-bottom: 0.75rem;
  color: white;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__excerpt {
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-card__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  .tag {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
    padding: 0.25rem 0.5rem;
    border-radius: 8px;
    font-size: 0.75rem;
    font-weight: 500;
    
    &--more {
      background: rgba(79, 172, 254, 0.2);
      color: #4facfe;
      font-weight: 600;
    }
  }
}

.blog-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  .author-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  
  .author-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid rgba(255, 255, 255, 0.2);
  }
  
  .author-details {
    display: flex;
    flex-direction: column;
    
    .author-name {
      font-weight: 600;
      color: white;
      font-size: 0.875rem;
    }
    
    .author-role {
      font-size: 0.75rem;
      color: rgba(255, 255, 255, 0.6);
    }
  }
  
  .read-more-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 10px;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
    font-size: 0.875rem;
    
    .arrow-icon {
      width: 16px;
      height: 16px;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      transform: translateY(-1px);
    }
  }
}

// Animaciones
@keyframes cardFadeIn {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsive Design
@media (max-width: 1024px) {
  .blog-card {
    &--list {
      grid-template-columns: 250px 1fr;
      
      .blog-card__image {
        height: 180px;
      }
      
      .blog-card__content {
        padding: 1.5rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .blog-card {
    &--list {
      grid-template-columns: 1fr;
      
      .blog-card__image {
        height: 200px;
      }
      
      .blog-card__content {
        padding: 1.5rem;
      }
    }
    
    &--grid {
      .blog-card__image {
        height: 200px;
      }
      
      .blog-card__content {
        padding: 1.25rem;
      }
    }
  }
  
  .blog-card__footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
    
    .read-more-btn {
      align-self: stretch;
      justify-content: center;
    }
  }
}

@media (max-width: 480px) {
  .blog-card {
    &--grid {
      .blog-card__content {
        padding: 1rem;
      }
    }
  }
  
  .blog-card__meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .blog-card__tags {
    .tag {
      font-size: 0.7rem;
    }
  }
}
</style>