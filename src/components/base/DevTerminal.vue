<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

interface TerminalLine {
  type: 'command' | 'output' | 'error' | 'info';
  content: string;
  timestamp?: string;
}

const isOpen = ref(false);
const currentCommand = ref('');
const terminalLines = ref<TerminalLine[]>([]);
const terminalContent = ref<HTMLElement | null>(null);
const commandInput = ref<HTMLInputElement | null>(null);
const isTyping = ref(false);

// Comandos disponibles y sus respuestas
const commands = {
  help: {
    description: 'Muestra todos los comandos disponibles',
    output: [
      'Comandos disponibles:',
      '',
      '  about        - Información personal de Diego',
      '  skills       - Lista de tecnologías y habilidades',
      '  projects     - Proyectos destacados',
      '  experience   - Experiencia profesional',
      '  contact      - Información de contacto',
      '  achievements - Logros y estadísticas',
      '  tech-stack   - Stack tecnológico actual',
      '  clear        - Limpia la terminal',
      '  exit         - Cierra la terminal',
      '',
      'Tip: Usa TAB para autocompletar comandos'
    ]
  },
  about: {
    description: 'Información personal',
    output: [
      '👨‍💻 Diego Reyes - Full Stack Developer',
      '',
      'Desarrollador apasionado por la arquitectura de software',
      'y la creación de experiencias de usuario memorables.',
      '',
      'Especializado en:',
      '• Desarrollo Frontend con Vue.js y TypeScript',
      '• Arquitectura de aplicaciones escalables',
      '• Clean Code y mejores prácticas',
      '• Optimización de performance',
      '',
      'Ubicación: México 🇲🇽',
      'Años de experiencia: 3+'
    ]
  },
  skills: {
    description: 'Tecnologías y habilidades',
    output: [
      '🛠️  STACK TECNOLÓGICO',
      '',
      'Frontend:',
      '├── Vue.js 3 (Composition API) ████████████ 95%',
      '├── TypeScript              ████████████ 90%',
      '├── JavaScript (ES6+)       ████████████ 95%',
      '├── HTML5 & CSS3            ████████████ 98%',
      '├── SCSS/Sass               ████████████ 90%',
      '└── Responsive Design       ████████████ 95%',
      '',
      'Tools & Others:',
      '├── Git & GitHub            ████████████ 90%',
      '├── Vite                    ████████████ 85%',
      '├── Node.js                 ████████████ 80%',
      '├── REST APIs               ████████████ 85%',
      '└── Testing (Vitest)        ████████████ 75%'
    ]
  },
  projects: {
    description: 'Proyectos destacados',
    output: [
      '🚀 PROYECTOS DESTACADOS',
      '',
      '1. Portfolio Personal',
      '   ├── Tecnologías: Vue 3, TypeScript, SCSS',
      '   ├── Características: Responsive, Animaciones, PWA',
      '   └── Estado: ✅ Completado',
      '',
      '2. Sistema de Gestión Empresarial',
      '   ├── Tecnologías: Vue 3, Pinia, TypeScript',
      '   ├── Características: Dashboard, CRUD, Reportes',
      '   └── Estado: ✅ En producción',
      '',
      '3. E-commerce Platform',
      '   ├── Tecnologías: Vue 3, Node.js, MongoDB',
      '   ├── Características: Carrito, Pagos, Admin Panel',
      '   └── Estado: 🔄 En desarrollo',
      '',
      'Total de proyectos completados: 50+'
    ]
  },
  experience: {
    description: 'Experiencia profesional',
    output: [
      '💼 EXPERIENCIA PROFESIONAL',
      '',
      '2021 - Presente | Full Stack Developer',
      '├── Desarrollo de aplicaciones web escalables',
      '├── Implementación de arquitecturas limpias',
      '├── Liderazgo técnico en proyectos',
      '└── Mentoring a desarrolladores junior',
      '',
      '2020 - 2021 | Frontend Developer',
      '├── Desarrollo de interfaces de usuario',
      '├── Optimización de performance',
      '├── Implementación de diseños responsive',
      '└── Colaboración con equipos de diseño',
      '',
      'Metodologías: Agile, Scrum, Kanban',
      'Soft Skills: Liderazgo, Comunicación, Resolución de problemas'
    ]
  },
  contact: {
    description: 'Información de contacto',
    output: [
      '📧 INFORMACIÓN DE CONTACTO',
      '',
      'Email: diego@yeyodev.com',
      'GitHub: https://github.com/yeyodev1',
      'LinkedIn: https://linkedin.com/in/yeyodev1',
      'Portfolio: https://yeyodev.com',
      '',
      '🌍 Disponible para:',
      '• Proyectos freelance',
      '• Colaboraciones',
      '• Oportunidades laborales',
      '• Consultoría técnica',
      '',
      'Horario: Lun-Vie 9:00-18:00 (GMT-6)'
    ]
  },
  achievements: {
    description: 'Logros y estadísticas',
    output: [
      '🏆 LOGROS Y ESTADÍSTICAS',
      '',
      'Proyectos completados:     50+',
      'Años de experiencia:       3+',
      'Tecnologías dominadas:     15+',
      'Líneas de código:          100,000+',
      'Commits en GitHub:         1,500+',
      'Bugs resueltos:            500+',
      'Cafés consumidos:          ∞',
      '',
      '📈 Métricas de calidad:',
      '├── Code coverage:         85%+',
      '├── Performance score:     95%+',
      '├── Accessibility:         98%+',
      '└── SEO score:             100%'
    ]
  },
  'tech-stack': {
    description: 'Stack tecnológico actual',
    output: [
      '⚡ STACK TECNOLÓGICO ACTUAL',
      '',
      'Frontend Framework:',
      '└── Vue.js 3 (Composition API + <script setup>)',
      '',
      'Lenguajes:',
      '├── TypeScript (Tipado estricto)',
      '├── JavaScript ES2022+',
      '└── HTML5 & CSS3',
      '',
      'Preprocesadores:',
      '└── SCSS con arquitectura modular',
      '',
      'Build Tools:',
      '├── Vite (Ultra-fast HMR)',
      '└── ESLint + Prettier',
      '',
      'Testing:',
      '├── Vitest (Unit testing)',
      '└── Cypress (E2E testing)',
      '',
      'Deployment:',
      '└── Netlify con CI/CD automático'
    ]
  }
};

const addLine = (type: TerminalLine['type'], content: string) => {
  const timestamp = new Date().toLocaleTimeString('es-ES', { 
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
  
  terminalLines.value.push({
    type,
    content,
    timestamp
  });
  
  nextTick(() => {
    if (terminalContent.value) {
      terminalContent.value.scrollTop = terminalContent.value.scrollHeight;
    }
  });
};

const typeWriter = async (lines: string[], delay = 50) => {
  isTyping.value = true;
  
  for (const line of lines) {
    let currentText = '';
    for (const char of line) {
      currentText += char;
      // Simular typing effect
      await new Promise(resolve => setTimeout(resolve, delay));
    }
    addLine('output', line);
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  isTyping.value = false;
};

const executeCommand = async (cmd: string) => {
  const trimmedCmd = cmd.trim().toLowerCase();
  
  // Agregar comando a la terminal
  addLine('command', `$ ${cmd}`);
  
  if (!trimmedCmd) return;
  
  if (trimmedCmd === 'clear') {
    terminalLines.value = [];
    return;
  }
  
  if (trimmedCmd === 'exit') {
    isOpen.value = false;
    return;
  }
  
  const command = commands[trimmedCmd as keyof typeof commands];
  
  if (command) {
    await typeWriter(command.output, 30);
  } else {
    addLine('error', `Comando no encontrado: ${trimmedCmd}`);
    addLine('info', 'Escribe "help" para ver los comandos disponibles');
  }
};

const handleKeyPress = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !isTyping.value) {
    executeCommand(currentCommand.value);
    currentCommand.value = '';
  }
};

const openTerminal = () => {
  isOpen.value = true;
  
  if (terminalLines.value.length === 0) {
    // Mensaje de bienvenida
    setTimeout(() => {
      addLine('info', '🚀 Terminal de Diego Reyes - Portfolio Interactivo');
      addLine('info', 'Escribe "help" para ver los comandos disponibles');
      addLine('info', '');
    }, 500);
  }
  
  nextTick(() => {
    if (commandInput.value) {
      commandInput.value.focus();
    }
  });
};

const closeTerminal = () => {
  isOpen.value = false;
};

// Auto-focus en el input cuando se abre la terminal
const handleTerminalClick = () => {
  if (commandInput.value && !isTyping.value) {
    commandInput.value.focus();
  }
};

// Detectar si es desktop usando media query
const isDesktop = ref(false);

onMounted(() => {
  // Verificar si es desktop
  const checkIsDesktop = () => {
    isDesktop.value = window.innerWidth >= 1024;
  };
  
  checkIsDesktop();
  window.addEventListener('resize', checkIsDesktop);
  
  // Cleanup
  return () => {
    window.removeEventListener('resize', checkIsDesktop);
  };
});
</script>

<template>
  <!-- Botón sticky solo en desktop -->
  <div v-if="isDesktop" class="dev-terminal">
    <!-- Botón flotante -->
    <Transition name="slide-up">
      <button 
        v-if="!isOpen"
        @click="openTerminal"
        class="dev-terminal__trigger"
        title="¿Eres programador o un reclutador curioso? Abre la terminal"
      >
        <span class="dev-terminal__trigger-icon">💻</span>
        <span class="dev-terminal__trigger-text">¿Eres programador o un reclutador curioso?</span>
      </button>
    </Transition>

    <!-- Terminal modal -->
    <Transition name="terminal-slide">
      <div v-if="isOpen" class="dev-terminal__modal">
        <div class="dev-terminal__window">
          <!-- Header de la terminal -->
          <div class="dev-terminal__header">
            <div class="dev-terminal__controls">
              <button class="dev-terminal__control dev-terminal__control--close" @click="closeTerminal"></button>
              <button class="dev-terminal__control dev-terminal__control--minimize"></button>
              <button class="dev-terminal__control dev-terminal__control--maximize"></button>
            </div>
            <div class="dev-terminal__title">diego@portfolio:~$</div>
          </div>

          <!-- Contenido de la terminal -->
          <div 
            ref="terminalContent"
            class="dev-terminal__content"
            @click="handleTerminalClick"
          >
            <!-- Líneas de la terminal -->
            <div 
              v-for="(line, index) in terminalLines" 
              :key="index"
              class="dev-terminal__line"
              :class="`dev-terminal__line--${line.type}`"
            >
              <span v-if="line.type === 'command'" class="dev-terminal__prompt">{{ line.content }}</span>
              <span v-else>{{ line.content }}</span>
            </div>

            <!-- Input de comando -->
            <div class="dev-terminal__input-line">
              <span class="dev-terminal__prompt">$ </span>
              <input
                ref="commandInput"
                v-model="currentCommand"
                @keypress="handleKeyPress"
                class="dev-terminal__input"
                placeholder="Escribe un comando..."
                :disabled="isTyping"
                autocomplete="off"
                spellcheck="false"
              />
              <span v-if="isTyping" class="dev-terminal__cursor dev-terminal__cursor--typing">|</span>
              <span v-else class="dev-terminal__cursor">|</span>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
@use '@/styles/index.scss' as *;

.dev-terminal {
  position: fixed;
  bottom: 2rem;
  left: 2rem;
  z-index: 9999;

  @media (max-width: 1023px) {
    display: none;
  }
}

// Botón trigger
.dev-terminal__trigger {
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
  border: 1px solid rgba(79, 172, 254, 0.3);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  color: rgba(255, 255, 255, 0.9);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(20px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
    border-color: rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
    box-shadow: 0 12px 40px rgba(79, 172, 254, 0.4);
    color: white;
  }

  &:active {
    transform: translateY(0);
  }
}

.dev-terminal__trigger-icon {
  font-size: 1.25rem;
  animation: pulse 2s ease-in-out infinite;
}

.dev-terminal__trigger-text {
  white-space: nowrap;
}

// Modal de la terminal
.dev-terminal__modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.dev-terminal__window {
  background: #1a1a2e;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 600px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(79, 172, 254, 0.2);
  overflow: hidden;
}

// Header de la terminal
.dev-terminal__header {
  background: linear-gradient(135deg, #16213e 0%, #1a1a2e 100%);
  padding: 1rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(79, 172, 254, 0.2);
}

.dev-terminal__controls {
  display: flex;
  gap: 0.5rem;
}

.dev-terminal__control {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;

  &--close {
    background: #ff5f57;
    
    &:hover {
      background: #ff3b30;
    }
  }

  &--minimize {
    background: #ffbd2e;
    
    &:hover {
      background: #ff9500;
    }
  }

  &--maximize {
    background: #28ca42;
    
    &:hover {
      background: #00c851;
    }
  }
}

.dev-terminal__title {
  color: rgba(255, 255, 255, 0.8);
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  font-weight: 500;
}

// Contenido de la terminal
.dev-terminal__content {
  background: #0f0f23;
  padding: 1.5rem;
  height: 400px;
  overflow-y: auto;
  font-family: 'Fira Code', 'Consolas', monospace;
  font-size: 0.875rem;
  line-height: 1.6;
  cursor: text;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(79, 172, 254, 0.3);
    border-radius: 4px;
    
    &:hover {
      background: rgba(79, 172, 254, 0.5);
    }
  }
}

.dev-terminal__line {
  margin-bottom: 0.25rem;
  
  &--command {
    color: #4facfe;
    font-weight: 600;
  }
  
  &--output {
    color: rgba(255, 255, 255, 0.9);
  }
  
  &--error {
    color: #ff6b6b;
  }
  
  &--info {
    color: #51cf66;
  }
}

.dev-terminal__input-line {
  display: flex;
  align-items: center;
  margin-top: 1rem;
}

.dev-terminal__prompt {
  color: #4facfe;
  font-weight: 600;
  margin-right: 0.5rem;
}

.dev-terminal__input {
  background: transparent;
  border: none;
  outline: none;
  color: rgba(255, 255, 255, 0.9);
  font-family: inherit;
  font-size: inherit;
  flex: 1;
  
  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
  
  &:disabled {
    opacity: 0.6;
  }
}

.dev-terminal__cursor {
  color: #4facfe;
  animation: blink 1s step-end infinite;
  margin-left: 2px;
  
  &--typing {
    animation: none;
    opacity: 1;
  }
}

// Animaciones
@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

@keyframes blink {
  0%, 50% {
    opacity: 1;
  }
  51%, 100% {
    opacity: 0;
  }
}

// Transiciones
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-up-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.terminal-slide-enter-active,
.terminal-slide-leave-active {
  transition: all 0.4s ease;
}

.terminal-slide-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.terminal-slide-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>