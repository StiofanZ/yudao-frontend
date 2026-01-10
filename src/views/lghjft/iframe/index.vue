<template>
  <IFrame :src="url" />
</template>
<script lang="ts" setup>
import { IFrame } from '@/components/IFrame'
import { useRoute } from 'vue-router'
import { computed } from 'vue'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { getAccessToken } from '@/utils/auth'

defineOptions({ name: 'LghjftIFrame' })

const route = useRoute()
const tagsViewStore = useTagsViewStore()
const url = computed(() => {
  let u = route.query.url as string
  const token = getAccessToken()
  if (token) {
    if (u.indexOf('?') === -1) {
      u += '?token=' + token
    } else {
      u += '&token=' + token
    }
  }
  return u
})
const title = computed(() => route.query.title as string)

if (title.value) {
  route.meta.title = title.value
  tagsViewStore.updateVisitedView(route)
}
</script>
