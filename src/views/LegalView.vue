<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useRoute } from 'vue-router'
import { EMAIL, INSTAGRAM, WHATSAPP } from '@/data/links'

const route = useRoute()
const esTerminos = computed(() => route.name === 'terminos')
const ACTUALIZADO = '25 de octubre de 2026'
const X = 'https://x.com/yeyodev'
const LINKEDIN = 'https://www.linkedin.com/in/yeyodev1'

watchEffect(() => {
  document.title = esTerminos.value ? 'Términos y condiciones · yeyo.dev' : 'Aviso legal · yeyo.dev'
})
</script>

<template>
  <div class="legal">
    <nav class="legal__nav">
      <RouterLink to="/" class="legal__marca">yeyo.dev</RouterLink>
      <div class="legal__tabs">
        <RouterLink to="/terminos" :class="{ 'is-on': esTerminos }">Términos</RouterLink>
        <RouterLink to="/aviso-legal" :class="{ 'is-on': !esTerminos }">Aviso legal</RouterLink>
      </div>
    </nav>

    <article v-if="esTerminos" class="legal__doc">
      <p class="legal__kicker">Documento legal</p>
      <h1>Términos y condiciones</h1>
      <p class="legal__fecha">Última actualización: {{ ACTUALIZADO }}</p>

      <div class="legal__alerta">
        <h2>Lee esto primero: no vendo resultados de ventas</h2>
        <p>
          Hago páginas web, tiendas online, pasarelas de pago y automatizaciones. Son
          <strong>herramientas</strong>. Que tu negocio venda depende de muchas cosas que no controlo:
          tu producto, tu precio, la demanda, tu marketing y publicidad, tu atención al cliente, tu
          logística, tu reputación, la competencia, la economía y los algoritmos de cada plataforma.
        </p>
        <p>
          <strong>
            Una tienda increíble no garantiza ventas. No garantizo ventas, ingresos, clientes, leads,
            seguidores, posiciones en Google o en asistentes de IA, ni retorno de tu inversión.
          </strong>
          Los casos, cifras y testimonios que muestro son ejemplos reales de otros negocios, no una
          promesa de lo que pasará con el tuyo.
        </p>
      </div>

      <h2>1. Quién soy</h2>
      <p>
        Estos términos rigen los servicios que presta <strong>Diego Alberto Reyes Lema</strong>
        ("yo", "yeyo.dev"), desarrollador independiente, persona natural, con domicilio en Guayaquil,
        Ecuador. Trabajo con negocios de Ecuador y del resto de Latinoamérica.
      </p>
      <ul>
        <li>Correo: <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></li>
        <li>WhatsApp: <a :href="WHATSAPP" target="_blank" rel="noopener">+593 96 368 1303</a></li>
        <li>Instagram: <a :href="INSTAGRAM" target="_blank" rel="noopener">@yeyo.dev</a></li>
        <li>X (Twitter): <a :href="X" target="_blank" rel="noopener">@yeyodev</a></li>
        <li>LinkedIn: <a :href="LINKEDIN" target="_blank" rel="noopener">Diego Reyes</a></li>
      </ul>

      <h2>2. Aceptación</h2>
      <p>
        Al pedirme una cotización, aceptar una propuesta, hacer un pago o usar este sitio, aceptas
        estos términos. Si una propuesta o contrato firmado dice algo distinto, manda lo que diga ese
        documento.
      </p>

      <h2>3. Qué hago</h2>
      <p>
        Desarrollo de páginas web, tiendas online, integración de pasarelas de pago, automatizaciones,
        aplicaciones, dashboards e integraciones con inteligencia artificial. El alcance exacto de cada
        proyecto (qué incluye, plazos y precio) queda por escrito en su propuesta. Lo que no esté en
        la propuesta no está incluido y se cotiza aparte.
      </p>

      <h2>4. Yo decido con quién trabajo</h2>
      <p>
        Me reservo el derecho de <strong>aceptar o rechazar cualquier proyecto o cliente</strong>, a
        mi sola discreción y sin obligación de explicar el motivo, por ejemplo cuando el proyecto no
        encaja con lo que hago, con mi agenda, con el presupuesto o con mi forma de trabajar.
        Nunca rechazo a alguien por motivos discriminatorios prohibidos por la ley.
      </p>
      <p>
        También puedo terminar una relación de trabajo si hay faltas de respeto, pagos atrasados,
        incumplimientos de la propuesta, o si el proyecto se usa para actividades ilícitas, engañosas
        o que dañen a terceros. Una conversación, una cotización o una respuesta automática no me
        obligan a aceptar un proyecto.
      </p>

      <h2>5. Precios y pagos</h2>
      <ul>
        <li>Los precios están en dólares de Estados Unidos (USD). Los montos "desde" son referenciales.</li>
        <li>Para reservar un proyecto se paga un anticipo. El trabajo empieza cuando el anticipo se acredita.</li>
        <li>Si un pago se atrasa, el trabajo se pausa y los plazos se mueven en la misma medida.</li>
        <li>
          Una vez que el trabajo empezó, el anticipo no es reembolsable, salvo que la propuesta diga
          otra cosa o que la ley aplicable lo exija.
        </li>
        <li>Las comisiones bancarias, de pasarela o de transferencia internacional corren por cuenta del cliente.</li>
      </ul>

      <h2>6. Lo que te toca a ti</h2>
      <ul>
        <li>Darme a tiempo la información, los textos, las fotos, los accesos y las aprobaciones que hagan falta.</li>
        <li>Tener los derechos sobre todo lo que me entregas (logos, fotos, textos, marcas, productos).</li>
        <li>Revisar y aprobar los entregables. Si tardas en responder, el plazo de entrega se mueve.</li>
        <li>
          Cumplir tus propias obligaciones legales y tributarias: facturación, impuestos (en Ecuador,
          ante el SRI), permisos de tu actividad y las reglas de defensa del consumidor frente a tus
          clientes.
        </li>
      </ul>

      <h2>7. Servicios de terceros y pasarelas de pago</h2>
      <p>
        Mis proyectos usan servicios de terceros: hosting, dominios, pasarelas de pago (PayPhone,
        Stripe, PayPal u otras), Meta (Instagram, Facebook, WhatsApp), Google, proveedores de IA y otras
        plataformas. Cada uno tiene sus propios términos, precios, comisiones y políticas.
      </p>
      <p>
        <strong>No respondo por</strong> caídas, cambios de precio, cambios de reglas, bloqueos,
        suspensiones de cuentas o rechazos que vengan de esos terceros. En particular, que una pasarela
        de pago apruebe tu comercio, la verificación de tu identidad, los contracargos, los fraudes y
        las retenciones de fondos dependen del proveedor y de ti, no de mí.
      </p>

      <h2>8. Automatizaciones e inteligencia artificial</h2>
      <p>
        Las automatizaciones y los asistentes con IA pueden equivocarse, malinterpretar mensajes o
        dejar de funcionar cuando una plataforma cambia. Debes supervisarlos y revisar lo que
        responden en tu nombre. No reemplazan asesoría legal, contable, médica ni financiera.
      </p>

      <h2>9. Entregas, revisiones y garantía técnica</h2>
      <ul>
        <li>Cada propuesta indica cuántas rondas de cambios incluye. Los cambios extra se cotizan aparte.</li>
        <li>
          Salvo que la propuesta diga otra cosa, corrijo sin costo los errores de programación que
          aparezcan en los 30 días siguientes a la entrega.
        </li>
        <li>
          Esa garantía no cubre cambios hechos por ti o por terceros, actualizaciones de plataformas
          externas, contenido que tú cargaste, ni funciones nuevas.
        </li>
      </ul>

      <h2>10. Propiedad del trabajo</h2>
      <p>
        Cuando el proyecto está pagado por completo, eres dueño del entregable final hecho para ti.
        Conservo la propiedad de mis herramientas, plantillas, componentes reutilizables y código
        genérico. Puedo mostrar el proyecto en mi portafolio y redes, salvo que acordemos
        confidencialidad por escrito.
      </p>

      <h2>11. Confidencialidad</h2>
      <p>
        Trato como confidencial la información de tu negocio que me compartas para el proyecto y no la
        comparto con terceros, salvo con los proveedores necesarios para hacer el trabajo o cuando la
        ley lo exija.
      </p>

      <h2>12. Límite de responsabilidad</h2>
      <p>
        En la medida que la ley lo permita, mi responsabilidad total por un proyecto no supera lo que
        pagaste por ese proyecto. No respondo por daños indirectos, como lucro cesante, ventas
        perdidas, pérdida de datos causada por terceros o daños a tu reputación.
      </p>

      <h2>13. Cancelación</h2>
      <p>
        Cualquiera de los dos puede cancelar un proyecto avisando por escrito. Se paga el trabajo hecho
        hasta ese momento y se entrega lo avanzado que esté pagado.
      </p>

      <h2>14. Datos personales</h2>
      <p>
        Trato tus datos según la Ley Orgánica de Protección de Datos Personales del Ecuador. El detalle
        está en el <RouterLink to="/aviso-legal">aviso legal</RouterLink>.
      </p>

      <h2>15. Ley aplicable y disputas</h2>
      <p>
        Estos términos se rigen por las leyes de la República del Ecuador, también si eres de otro país
        de Latinoamérica. Ante cualquier desacuerdo intentaremos primero resolverlo de buena fe
        conversando. Si no se puede, iremos a mediación en Guayaquil. Si tampoco funciona, serán
        competentes los jueces de Guayaquil, Ecuador.
      </p>

      <h2>16. Cambios</h2>
      <p>
        Puedo actualizar estos términos. La versión vigente es siempre la publicada en esta página.
        Los proyectos ya contratados siguen con los términos que aceptaste al contratarlos.
      </p>
    </article>

    <article v-else class="legal__doc">
      <p class="legal__kicker">Documento legal</p>
      <h1>Aviso legal</h1>
      <p class="legal__fecha">Última actualización: {{ ACTUALIZADO }}</p>

      <h2>1. Titular del sitio</h2>
      <p>
        El sitio <strong>yeyo.dev</strong> y las cuentas @yeyo.dev pertenecen a
        <strong>Diego Alberto Reyes Lema</strong>, desarrollador independiente, persona natural, con
        domicilio en Guayaquil, Ecuador.
      </p>
      <ul>
        <li>Correo: <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a></li>
        <li>WhatsApp: <a :href="WHATSAPP" target="_blank" rel="noopener">+593 96 368 1303</a></li>
        <li>Instagram: <a :href="INSTAGRAM" target="_blank" rel="noopener">@yeyo.dev</a></li>
        <li>X (Twitter): <a :href="X" target="_blank" rel="noopener">@yeyodev</a></li>
        <li>LinkedIn: <a :href="LINKEDIN" target="_blank" rel="noopener">Diego Reyes</a></li>
      </ul>

      <h2>2. Para qué es este sitio</h2>
      <p>
        Mostrar mi trabajo y recibir solicitudes de proyectos. Contratar un servicio se rige por los
        <RouterLink to="/terminos">términos y condiciones</RouterLink>.
      </p>

      <div class="legal__alerta">
        <h2>Descargo de responsabilidad</h2>
        <p>
          Todo lo que publico aquí y en mis redes (posts, reels, hilos, casos, cifras, consejos y
          herramientas) es <strong>informativo y educativo</strong>. Son mis opiniones y experiencias, no
          asesoría legal, contable, tributaria ni financiera.
        </p>
        <p>
          <strong>
            Los resultados que muestro de otros negocios no son una promesa ni una garantía de que tú
            vas a obtener lo mismo.
          </strong>
          Cada negocio es distinto. Antes de tomar decisiones importantes, consulta con un profesional.
        </p>
      </div>

      <h2>3. Propiedad intelectual</h2>
      <p>
        Los textos, el diseño, el código, las imágenes y la marca yeyo.dev son míos o los uso con
        permiso. Puedes compartir enlaces a este sitio, pero no copiar ni reutilizar su contenido sin
        mi autorización por escrito. Los logos y capturas de proyectos de clientes pertenecen a sus
        dueños y se muestran solo como portafolio.
      </p>

      <h2>4. Enlaces a terceros</h2>
      <p>
        Este sitio enlaza a redes sociales, proyectos de clientes y otras páginas. No controlo esos
        sitios ni respondo por su contenido, disponibilidad o políticas.
      </p>

      <h2>5. Disponibilidad</h2>
      <p>
        Hago lo posible para que el sitio funcione siempre, pero puede tener caídas, errores o cambios
        sin aviso. No respondo por daños que vengan de no poder usarlo.
      </p>

      <h2>6. Datos personales</h2>
      <p>
        Trato tus datos según la <strong>Ley Orgánica de Protección de Datos Personales del Ecuador</strong>.
      </p>
      <ul>
        <li>
          <strong>Qué datos:</strong> los que me das en el formulario o por mensaje (nombre, correo,
          WhatsApp, nombre y tipo de negocio, lo que necesitas y tu presupuesto) y tu usuario y mensajes
          si me escribes por Instagram.
        </li>
        <li>
          <strong>Para qué:</strong> responderte, cotizar, darle seguimiento a tu solicitud y, si
          trabajamos juntos, ejecutar el proyecto. No vendo tus datos.
        </li>
        <li>
          <strong>Asistente automático:</strong> los mensajes directos de Instagram los responde primero
          un asistente con inteligencia artificial que hace algunas preguntas para entender tu proyecto.
          Yo reviso las conversaciones y puedes pedir hablar conmigo en cualquier momento.
        </li>
        <li>
          <strong>Con quién se comparten:</strong> con los proveedores que necesito para operar
          (hosting, base de datos, correo, mensajería, proveedores de IA) y con el CRM de Bakano, la
          agencia con la que trabajo, donde se registran las solicitudes para darles seguimiento. Algunos
          de estos proveedores están fuera del Ecuador.
        </li>
        <li>
          <strong>Tus derechos:</strong> puedes pedir acceso, corrección, eliminación, oposición o
          portabilidad de tus datos escribiendo a <a :href="`mailto:${EMAIL}`">{{ EMAIL }}</a>.
          Respondo dentro de los plazos de la ley.
        </li>
      </ul>

      <h2>7. Ley aplicable</h2>
      <p>
        Este aviso se rige por las leyes de la República del Ecuador. Cualquier disputa se resolverá
        ante los jueces de Guayaquil, Ecuador.
      </p>
    </article>

    <footer class="legal__pie">
      <p>© 2026 Diego Alberto Reyes Lema · Guayaquil, Ecuador</p>
      <p>
        <RouterLink to="/terminos">Términos y condiciones</RouterLink>
        ·
        <RouterLink to="/aviso-legal">Aviso legal</RouterLink>
        ·
        <RouterLink to="/">Volver al inicio</RouterLink>
      </p>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
.legal {
  min-height: 100vh;
  background: $bg-deep;
  color: $text-secondary;
  font-family: $font-body;
  padding: 0 16px 64px;

  a {
    color: $accent-light;
    text-decoration: underline;
    text-underline-offset: 3px;
    overflow-wrap: anywhere;
  }

  &__nav {
    max-width: 760px;
    margin: 0 auto;
    padding: 24px 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  &__marca {
    font-family: $font-mono;
    color: $text-primary !important;
    text-decoration: none !important;
    font-size: 18px;
  }

  &__tabs {
    display: flex;
    gap: 8px;

    a {
      text-decoration: none;
      color: $text-secondary;
      font-size: 14px;
      padding: 8px 14px;
      border: 1px solid $border-white;
      border-radius: 999px;

      &.is-on {
        color: $text-primary;
        background: $bg-elevated;
        border-color: $border-violet;
      }
    }
  }

  &__doc {
    max-width: 760px;
    margin: 0 auto;
    font-size: 16px;
    line-height: 1.7;

    h1 {
      font-family: $font-display;
      color: $text-primary;
      font-size: clamp(36px, 8vw, 56px);
      line-height: 1.05;
      margin: 0 0 8px;
    }

    h2 {
      color: $text-primary;
      font-size: 20px;
      line-height: 1.3;
      margin: 40px 0 12px;
    }

    p {
      margin: 0 0 14px;
    }

    ul {
      margin: 0 0 14px;
      padding-left: 20px;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    strong {
      color: $text-primary;
    }
  }

  &__kicker {
    font-family: $font-mono;
    color: $accent-cyan;
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-size: 12px;
    margin: 24px 0 12px !important;
  }

  &__fecha {
    font-size: 14px;
    color: $text-muted;
  }

  &__alerta {
    margin: 32px 0;
    padding: 20px;
    border-radius: 16px;
    border: 2px solid $accent-gold;
    background: $accent-gold-glow;

    h2 {
      margin-top: 0 !important;
      color: $accent-gold !important;
    }

    p:last-child {
      margin-bottom: 0;
    }

    @media (min-width: 768px) {
      padding: 28px 32px;
    }
  }

  &__pie {
    max-width: 760px;
    margin: 56px auto 0;
    padding-top: 24px;
    border-top: 1px solid $border-subtle;
    font-size: 14px;
    color: $text-muted;

    p {
      margin: 0 0 8px;
    }
  }
}
</style>
