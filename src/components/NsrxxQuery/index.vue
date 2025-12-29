<template>
  <div class="nsrxx-query">
    <el-form :inline="true" @submit.prevent>
      <el-form-item label="纳税人识别号">
        <el-input
          v-model="queryParams.nsrsbh"
          class="!w-[300px]"
          clearable
          placeholder="请输入纳税人识别号"
          @keyup.enter="handleQuery"
        >
          <template #append>
            <el-button :loading="loading" @click="handleQuery">
              <Icon icon="ep:search" />
            </el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>

    <div v-if="nsrxx.nsrmc" class="mt-4">
      <el-descriptions :column="1" border>
        <el-descriptions-item label="纳税人识别号">{{ nsrxx.nsrsbh }}</el-descriptions-item>
        <el-descriptions-item label="纳税人名称">{{ nsrxx.nsrmc }}</el-descriptions-item>
      </el-descriptions>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { NsrxxApi } from '@/api/lghjft/nsrxx'

defineOptions({ name: 'NsrxxQuery' })

const queryParams = reactive({
  nsrsbh: ''
})

const loading = ref(false)
const nsrxx = reactive({
  nsrsbh: '',
  nsrmc: '',
  djxh: undefined as string | undefined
})

const emit = defineEmits(['success'])

const handleQuery = async () => {
  if (!queryParams.nsrsbh) {
    ElMessage.warning('请输入纳税人识别号')
    return
  }

  // 清空原有的查询信息
  nsrxx.nsrsbh = ''
  nsrxx.nsrmc = ''
  nsrxx.djxh = undefined

  loading.value = true
  try {
    const data = await NsrxxApi.getNsrxxByNsrsbh(queryParams.nsrsbh)
    if (data) {
      nsrxx.nsrsbh = data.nsrsbh
      nsrxx.nsrmc = data.nsrmc
      nsrxx.djxh = data.djxh
      emit('success', data)
    } else {
      nsrxx.nsrsbh = ''
      nsrxx.nsrmc = ''
      nsrxx.djxh = undefined
      ElMessage.info('未查询到相关纳税人信息')
    }
  } catch (error) {
    // 异常由 request 拦截器处理，这里清空数据
    nsrxx.nsrsbh = ''
    nsrxx.nsrmc = ''
    nsrxx.djxh = undefined
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.nsrxx-query {
  padding: 10px;
}
</style>
