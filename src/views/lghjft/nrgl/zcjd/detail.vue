<template>
  <ContentWrap>
    <el-skeleton :loading="loading" animated>
      <div v-if="detail">
        <div class="text-2xl font-bold text-center mb-4">{{ detail.title }}</div>
        <div class="text-gray-500 text-center mb-6 text-sm">
          <span class="mr-4">发布部门：{{ detail.deptName }}</span>
          <span class="mr-4">发布时间：{{ formatTime(detail.createTime, 'yyyy-MM-dd') }}</span>
          <span v-if="detail.jdbm">解读部门：{{ detail.jdbm }}</span>
        </div>

        <el-descriptions v-if="detail.fjlj" :column="1" border class="mb-6">
          <el-descriptions-item label="附件下载">
            <a :href="detail.fjlj" class="text-blue-500 hover:underline" target="_blank"
              >点击下载</a
            >
          </el-descriptions-item>
        </el-descriptions>

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
import { getZcjd } from '@/api/lghjft/nrgl/zcjd'
import { formatTime } from '@/utils'

defineOptions({ name: 'ZcjdDetail' })

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
    const res = await getZcjd(Number(id))
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
