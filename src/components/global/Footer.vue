<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<template>
  <footer class="footer">
    <div class="footer__container">
      <p class="footer__copy">
        &copy; {{ currentYear }} Yeyodev. Todos los derechos reservados.
      </p>
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

  @media (min-width: 768px) {
    .footer__container {
      flex-direction: row;
      justify-content: space-between;
    }
  }
}
</style>