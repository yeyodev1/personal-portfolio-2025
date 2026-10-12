import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'

export type Need = 'app' | 'automatizacion' | 'web' | 'tienda' | 'dashboard' | 'ia' | 'integracion' | 'otro'

const API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8100'

/** State + submit for the lead form; `source` tells the backend which world it came from. */
export function useLead(source: string) {
  const { locale, t } = useI18n()
  const form = reactive({
    name: '',
    email: '',
    whatsapp: '',
    company: '',
    needs: [] as Need[],
    description: '',
    budget: '',
    timeline: '',
    acceptsMinimum: false,
    website: '', // honeypot
  })
  const status = ref<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const error = ref('')
  const sentName = ref('')

  const toggleNeed = (n: Need) => {
    const i = form.needs.indexOf(n)
    if (i >= 0) form.needs.splice(i, 1)
    else form.needs.push(n)
  }

  const submit = async () => {
    if (status.value === 'sending') return
    // Qualify before sending: projects start at $800.
    if (!form.budget || !form.acceptsMinimum) {
      error.value = t(!form.budget ? 'lead.budgetRequired' : 'lead.acceptRequired')
      status.value = 'error'
      return
    }
    status.value = 'sending'
    error.value = ''
    try {
      const res = await fetch(`${API_URL}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, businessType: form.company, company: '', source, lang: locale.value }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.message || t('lead.errorGeneric'))
      }
      sentName.value = form.name.split(/\s+/)[0] ?? ''
      status.value = 'sent'
    } catch (e) {
      error.value = e instanceof Error && e.message !== 'Failed to fetch' ? e.message : t('lead.errorGeneric')
      status.value = 'error'
    }
  }

  const reset = () => {
    Object.assign(form, { name: '', email: '', whatsapp: '', company: '', needs: [], description: '', budget: '', timeline: '', acceptsMinimum: false, website: '' })
    status.value = 'idle'
  }

  return { form, status, error, sentName, toggleNeed, submit, reset }
}
