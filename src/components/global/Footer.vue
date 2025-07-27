<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__copy">
        &copy; {{ currentYear }} Yeyodev. Todos los derechos reservados.
      </p>
      <!-- Botón especial para reclutadores -->
      <div class="footer__recruiter">
        <a href="https://www.self.so/yeyodev" target="_blank" rel="noopener noreferrer" class="footer__recruiter-btn">
          <span class="footer__recruiter-icon">👀</span>
          <span class="footer__recruiter-text">
            <strong>¿Eres reclutador y solo quieres ver qué he hecho?</strong>
            <small>Presiona aquí para mi perfil completo</small>
          </span>
          <span class="footer__recruiter-arrow">→</span>
        </a>
      </div>

      <div class="footer__socials">
        <a href="https://github.com/yeyodev1" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a href="https://www.linkedin.com/in/yeyodev1" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.footer {
  background: linear-gradient(135deg, 
    $YEYO-VIOLET 0%, 
    rgba(26, 26, 46, 0.95) 50%, 
    rgba(34, 34, 59, 0.9) 100%
  );
  backdrop-filter: blur(20px);
  border-top: 1px solid rgba(79, 172, 254, 0.2);
  color: rgba(255, 255, 255, 0.9);
  padding: 3rem 1rem;
  text-align: center;

  &__container {
    max-width: 1200px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  &__copy {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.8);
  }

  &__recruiter {
    margin: 1rem 0;
    
    &-btn {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1.2rem 2rem;
      background: linear-gradient(135deg, 
        rgba(255, 107, 107, 0.9) 0%, 
        rgba(255, 142, 83, 0.9) 25%,
        rgba(255, 193, 7, 0.9) 50%,
        rgba(76, 175, 80, 0.9) 75%,
        rgba(79, 172, 254, 0.9) 100%
      );
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-radius: 16px;
      color: white;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(10px);
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, 
          transparent, 
          rgba(255, 255, 255, 0.4), 
          transparent
        );
        transition: left 0.6s ease;
      }
      
      &:hover {
        transform: translateY(-4px) scale(1.02);
        box-shadow: 0 12px 40px rgba(79, 172, 254, 0.4);
        border-color: rgba(255, 255, 255, 0.6);
        
        &::before {
          left: 100%;
        }
        
        .footer__recruiter-arrow {
          transform: translateX(8px);
        }
        
        .footer__recruiter-icon {
          animation: bounce 0.6s ease;
        }
      }
    }
    
    &-icon {
      font-size: 1.5rem;
      transition: all 0.3s ease;
    }
    
    &-text {
      display: flex;
      flex-direction: column;
      text-align: left;
      
      strong {
        font-size: 1rem;
        margin-bottom: 0.2rem;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
      }
      
      small {
        font-size: 0.8rem;
        opacity: 0.9;
        font-weight: 400;
      }
    }
    
    &-arrow {
      font-size: 1.2rem;
      font-weight: bold;
      transition: transform 0.3s ease;
    }
  }

  &__socials {
    display: flex;
    gap: 1.5rem;

    a {
      color: rgba(255, 255, 255, 0.85);
      font-weight: 500;
      transition: all 0.3s ease;
      position: relative;
      padding: 0.5rem 1rem;
      border-radius: 8px;
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);

      &:hover {
        color: #4facfe;
        background: rgba(79, 172, 254, 0.1);
        border-color: rgba(79, 172, 254, 0.3);
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(79, 172, 254, 0.2);
      }
    }
  }

  @keyframes bounce {
    0%, 20%, 60%, 100% {
      transform: translateY(0);
    }
    40% {
      transform: translateY(-8px);
    }
    80% {
      transform: translateY(-4px);
    }
  }

  @media (max-width: 767px) {
    .footer__recruiter {
      &-btn {
        flex-direction: column;
        text-align: center;
        gap: 0.8rem;
        padding: 1rem 1.5rem;
        
        .footer__recruiter-text {
          text-align: center;
          
          strong {
            font-size: 0.9rem;
          }
          
          small {
            font-size: 0.75rem;
          }
        }
        
        .footer__recruiter-arrow {
          display: none;
        }
      }
    }
  }

  @media (min-width: 768px) {
    .footer__container {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-end;
    }
    
    .footer__recruiter {
      order: -1;
      margin-right: auto;
      margin-left: auto;
      margin-bottom: 1rem;
    }
  }

  @media (min-width: 1024px) {
    .footer__container {
      align-items: center;
    }
    
    .footer__recruiter {
      margin-bottom: 0;
    }
  }
}
</style>