<template>
  <ContentWrap>
    <el-skeleton :loading="loading" animated>
      <div v-if="detail">
        <div class="text-2xl font-bold text-center mb-4">{{ detail.title }}</div>
        <div class="text-gray-500 text-center mb-6 text-sm">
          <span class="mr-4">发布人：{{ detail.creator }}</span>
          <span class="mr-4"
            >发布时间：{{ formatTime(detail.createTime, 'yyyy-MM-dd HH:mm') }}</span
          >
          <el-tag :type="getTypeTag(detail.type)" size="small">{{
            getTypeLabel(detail.type)
          }}</el-tag>
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
import { getTzgg } from '@/api/lghjft/xxzx/tzgg'
import { formatTime } from '@/utils'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'

defineOptions({ name: 'TzggDetail' })

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const detail = ref<any>(null)

const getTypeLabel = (type: number) => {
  const dict = getDictOptions(DICT_TYPE.INFRA_BOOLEAN_STRING).find((d: any) => d.value == type) // 假设type字典
  // 实际项目中应根据 type 对应的字典来获取
  // 这里暂时直接返回 type
  return type === 1 ? '通知' : '公告'
}

const getTypeTag = (type: number) => {
  return type === 1 ? 'primary' : 'warning'
}

const getDetail = async () => {
  const id = route.query.id
  if (!id) {
    loading.value = false
    return
  }
  try {
    loading.value = true
    const res = await getTzgg(Number(id))
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
