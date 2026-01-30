<template>
  <ContentWrap>
    <el-skeleton :loading="loading" animated>
      <div v-if="detail">
        <div class="text-2xl font-bold text-center mb-4">{{ detail.title }}</div>
        <div class="text-gray-500 text-center mb-6 text-sm">
          <el-tag class="mr-4" size="small">{{ detail.version }}</el-tag>
          <span class="mr-4"
            >发布时间：{{ formatTime(detail.fbsj || detail.createTime, 'yyyy-MM-dd') }}</span
          >
        </div>

        <div class="prose max-w-none" v-html="detail.content"></div>

        <div class="mt-8 text-center">
          <el-button @click="router.back()">返回</el-button>
        </div>
      </div>
      <el-empty v-else description="未找到相关数据" />
    </el-skeleton>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getBbfb } from '@/api/lghjft/nrgl/bbfb'
import { formatTime } from '@/utils'

defineOptions({ name: 'BbfbDetail' })

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const detail = ref<any>(null)

const getDetail = async () => {
  const id = route.query.id
  if (!id) {
    loading.value = false
    return
  }
  try {
    loading.value = true
    const res = await getBbfb(Number(id))
    detail.value = res
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  getDetail()
})
</script>

<style scoped>
.prose {
  line-height: 1.6;
  color: #374151;
}
.prose :deep(img) {
  max-width: 100%;
}
</style>
