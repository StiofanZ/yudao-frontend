<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
      style="padding: 20px 0"
    >
      <el-form-item label="税务机关名称" prop="swjgmc">
        <el-input
          v-model="queryParams.swjgmc"
          placeholder="请输入税务机关名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item label="手续费账号" prop="sxfzh">
        <el-input
          v-model="queryParams.sxfzh"
          placeholder="请输入手续费账号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>

      <el-form-item>
        <el-button @click="handleQuery" type="primary"
          ><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button
        >
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button type="danger" plain @click="toggleExpandAll">
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :stripe="false"
      :show-overflow-tooltip="false"
      row-key="swjgDm"
      :default-expand-all="isExpandAll"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      v-if="refreshTable"
      :cell-style="{ fontSize: '14px', padding: '4px 0' }"
    >
      <el-table-column label="税务机关代码" prop="swjgDm" min-width="120px" />
      <el-table-column label="税务机关简称" align="center" prop="swjgjc" />
      <el-table-column label="手续费账号" align="center" prop="sxfzh" />
      <el-table-column label="户名" align="center" prop="sxfhm" />
      <el-table-column label="行号" align="center" prop="sxfhh" />
      <el-table-column label="银行" align="center" prop="sxfyh" />
      <el-table-column label="上级税务机关代码" align="center" prop="sjswjgDm" />
      <el-table-column label="稽查局标记" align="center" prop="jcjbj" width="100">
        <template #default="{ row }">
          {{ row.jcjbj === 'Y' ? '是' : row.jcjbj === 'N' ? '否' : row.jcjbj || '-' }}
        </template>
      </el-table-column>

      <el-table-column label="工会机构代码" align="center" prop="ghjgDm" />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.swjgDm)"
            v-hasPermi="['dm:swjg:update']"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <SwjgForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { handleTree } from '@/utils/tree'
import download from '@/utils/download'
import { SwjgApi, Swjg } from '@/api/dm/swjg'
import SwjgForm from './SwjgForm.vue'
import { log } from 'console'

/** 税务机关 列表 */
defineOptions({ name: 'Swjg' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化
const total = ref(0)
const loading = ref(true) // 列表的加载中
const list = ref<Swjg[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  swjgmc: undefined,
  swjgjc: undefined,
  dz: undefined,
  yzbm: undefined,
  lxr: undefined,
  lxdh: undefined,
  sxfzh: undefined,
  sxfhm: undefined,
  sxfhh: undefined,
  sxfyh: undefined,
  sjswjgDm: undefined,
  jcjbj: undefined,
  ghjgDm: undefined,
  sxh: undefined,
  jym: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  console.log(list)

  loading.value = true
  try {
    const data = await SwjgApi.getSwjgList(queryParams)
    list.value = handleTree(data, 'swjgDm', 'sjswjgDm')
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

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, swjgDm?: string) => {
  // 修改：id? -> swjgDm?
  formRef.value.open(type, swjgDm) // 修改：id -> swjgDm
}

/** 删除按钮操作 */
const handleDelete = async (swjgDm: string) => {
  // 修改：id -> swjgDm
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await SwjgApi.deleteSwjg(swjgDm) // 修改：id -> swjgDm
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
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
:deep(.el-table__row) {
  height: 60px !important;
}

:deep(.el-table__body tr td) {
  background-color: var(--el-bg-color) !important;
}
/* 使用框架的背景色变量 */
:deep(.el-table__body tr:hover td) {
  background-color: var(--el-color-primary-light-7) !important;
}
</style>
