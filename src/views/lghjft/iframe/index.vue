<template>
  <IFrame :src="url" />
</template>
<script lang="ts" setup>
import { IFrame } from '@/components/IFrame'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'

defineOptions({ name: 'LghjftIFrame' })

const route = useRoute()
const tagsViewStore = useTagsViewStore()
const url = computed(() => route.query.url as string)
const title = computed(() => route.query.title as string)

if (title.value) {
  route.meta.title = title.value
  tagsViewStore.updateVisitedView(route)
}
</script>
