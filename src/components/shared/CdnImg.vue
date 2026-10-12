<script setup lang="ts">
import { computed, ref } from 'vue'
import { cdn, cdnSrcset } from '@/data/cdn'

const props = defineProps<{ src: string; width: number; alt?: string; eager?: boolean }>()
const emit = defineEmits<{ failed: [] }>()

// First Cloudinary, then the copy shipped in /public, then give up and let the parent show a placeholder.
const stage = ref<'cdn' | 'local'>('cdn')
const current = computed(() => (stage.value === 'cdn' ? cdn(props.src, props.width) : props.src))
const srcset = computed(() => (stage.value === 'cdn' ? cdnSrcset(props.src, props.width) : undefined))

const onError = () => {
  if (stage.value === 'cdn') stage.value = 'local'
  else emit('failed')
}
</script>

<template>
  <img :src="current" :srcset="srcset" :alt="alt ?? ''" :loading="eager ? 'eager' : 'lazy'" decoding="async" @error="onError" />
</template>
