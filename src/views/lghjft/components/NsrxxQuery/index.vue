<template>
  <div class="nsrxx-query-container">
    <el-dialog
      v-model="visible"
      :close-on-click-modal="false"
      append-to-body
      title="纳税人信息查询"
      width="900px"
    >
      <el-form :inline="true" :model="queryParams" class="demo-form-inline" @submit.prevent>
        <el-form-item label="搜索关键字">
          <el-input
            v-model="queryParams.keyword"
            clearable
            placeholder="纳税人识别号/名称/社会信用代码"
            style="width: 300px"
            @keyup.enter="handleQuery"
          >
            <template #append>
              <el-button :loading="loading" @click="handleQuery">
                <Icon icon="ep:search" /> 查询
              </el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>

      <el-table
        v-loading="loading"
        :data="list"
        border
        highlight-current-row
        style="width: 100%; height: 400px; overflow-y: auto"
        @current-change="handleSelectionChange"
      >
        <el-table-column label="纳税人识别号" prop="nsrsbh" width="180" />
        <el-table-column label="纳税人名称" min-width="200" prop="nsrmc" show-overflow-tooltip />
        <el-table-column label="社会信用代码" prop="shxydm" width="180" />
        <el-table-column label="法定代表人" prop="fddbrxm" width="120" />
      </el-table>

      <template #footer>
        <el-button @click="visible = false">取 消</el-button>
        <el-button :disabled="!selectedRow" type="primary" @click="handleConfirm">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { NsrxxRespVO, queryNsrxx } from '@/api/lghjft/hjgl/jcxx'

defineOptions({ name: 'NsrxxQuery' })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const queryParams = reactive({
  keyword: ''
})

const loading = ref(false)
const list = ref<NsrxxRespVO[]>([])
const selectedRow = ref<NsrxxRespVO | null>(null)

/** 查询逻辑 */
const handleQuery = async () => {
  if (!queryParams.keyword) {
    ElMessage.warning('请输入搜索关键字')
    return
  }
  loading.value = true
  list.value = []
  try {
    const data = await queryNsrxx(queryParams.keyword)
    list.value = data
    if (data.length === 0) {
      ElMessage.info('未查询到相关纳税人信息')
    }
  } catch (error) {
    console.error(error)
  } finally {
    loading.value = false
  }
}

/** 选中行 */
const handleSelectionChange = (val: NsrxxRespVO) => {
  selectedRow.value = val
}

/** 确定按钮 */
const handleConfirm = () => {
  if (!selectedRow.value) return
  emit('confirm', selectedRow.value)
  visible.value = false
}

/** 重置状态（供父组件调用） */
const reset = () => {
  queryParams.keyword = ''
  list.value = []
  selectedRow.value = null
}

defineExpose({ reset })
</script>

<style scoped>
.nsrxx-query-container :deep(.el-table__body-wrapper) {
  /* 优化表格滚动体验 */
}
</style>
