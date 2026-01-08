<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="行政区划名称" prop="xzqhmc">
        <el-input v-model="queryParams.xzqhmc" placeholder="请输入行政区划名称" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="上级行政区划代码" prop="sjxzqhDm">
        <el-input v-model="queryParams.sjxzqhDm" placeholder="请输入上级行政区划代码" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="行政区划代码" prop="xzqhDm">
        <el-input v-model="queryParams.xzqhDm" placeholder="请输入行政区划代码" clearable @keyup.enter="handleQuery"
          class="!w-210px" :maxlength="6" />
      </el-form-item>
      <el-form-item label="行政区划级别" prop="xzqhjb">
        <el-select v-model="queryParams.xzqhjb" placeholder="请选择行政区划级别" clearable class="!w-210px">
          <el-option v-for="item in levelOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item style="margin-top: 20px">
        <el-button type="primary" @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>

        <el-button type="danger" plain @click="toggleExpandAll">
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true" row-key="xzqhDm"
      :default-expand-all="isExpandAll" v-if="refreshTable">
      <el-table-column label="行政区划名称" align="center" prop="xzqhmc" />
      <el-table-column label="行政区划代码" align="center" prop="xzqhDm" />
      <el-table-column label="上级行政区划代码" align="center" prop="sjxzqhDm" />
      <el-table-column label="行政区划级别" align="center" prop="xzqhjb" />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default=""> </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <XzqhForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { handleTree } from '@/utils/tree'
import { XzqhApi, Xzqh } from '@/api/dm/xzqh'
import XzqhForm from './XzqhForm.vue'

/** 行政区划 列表 */
defineOptions({ name: 'Xzqh' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const total = ref(0)
const loading = ref(true) // 列表的加载中
const list = ref<Xzqh[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  xzqhmc: undefined,
  sjxzqhDm: undefined,
  xzqhjb: undefined,
  xzqhDm: undefined
})
const levelOptions = ref([
  { value: '1', label: '省级' },
  { value: '2', label: '市级' },
  { value: '3', label: '区县级' },
  { value: '4', label: '乡镇/街道级' },
  { value: '5', label: '村/社区级' }
])
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await XzqhApi.getXzqhList(queryParams)
    list.value = handleTree(data, 'xzqhDm', 'sjxzqhDm')
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}


/** 展开/折叠操作 */
const isExpandAll = ref(true) // 是否展开，默认全部展开
const refreshTable = ref(true) // 重新渲染表格状态
const toggleExpandAll = async () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  await nextTick()
  refreshTable.value = true
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped>
/* 隐藏区县级节点的展开箭头 */
:deep(.el-table__row) {
  --el-table-row-hover-bg-color: var(--el-fill-color-light);
}

/* 判断是否是区县级节点并隐藏箭头 */
:deep(.el-table__row) .el-table__expand-icon {
  display: inline-block;
}

/* 通过CSS选择器判断：当行数据的行政区划级别为3时隐藏箭头 */
:deep(.el-table__row) .el-table__expand-icon[style*="padding-left: 16px;"]+.el-table__expand-icon {
  display: none;
}

:deep(.el-table__body tr td) {
  background-color: var(--el-bg-color) !important;
}

/* 使用框架的背景色变量 */
:deep(.el-table__body tr:hover td) {
  background-color: var(--el-color-primary-light-7) !important;
}

:deep(.word-break-all .cell) {
  word-break: break-all !important;
}
</style>