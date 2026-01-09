<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="任务类型	" prop="rwlx">
        <el-select v-model="queryParams.rwlx" placeholder="请选择任务类型	" clearable class="!w-240px">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.SYS_RWLX)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="年度" prop="nd">
        <el-select v-model="queryParams.nd" placeholder="请选择年度" clearable class="!w-240px">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.SYS_ND)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="单位代码" prop="dwdm">
        <el-input v-model="queryParams.dwdm" placeholder="请输入单位代码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="单位名称" prop="dwmc">
        <el-input v-model="queryParams.dwmc" placeholder="请输入单位名称" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="任务数" prop="rws">
        <el-input v-model="queryParams.rws" placeholder="请输入任务数" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="完成数" prop="wcs">
        <el-input v-model="queryParams.wcs" placeholder="请输入完成数" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button>
        <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button>
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['lghjft:rws:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading"
          v-hasPermi="['lghjft:rws:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="danger" plain :disabled="isEmpty(checkedIds)" @click="handleDeleteBatch"
          v-hasPermi="['lghjft:rws:delete']">
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table row-key="rwid" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
      @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="任务id" align="center" prop="rwid" />
      <el-table-column label="任务类型	" align="center" prop="rwlx">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYS_RWLX" :value="scope.row.rwlx" class="reset-dict-tag" />
        </template>
      </el-table-column>
      <el-table-column label="年度" align="center" prop="nd">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYS_ND" :value="scope.row.nd" class="reset-dict-tag" />
        </template>
      </el-table-column>
      <el-table-column label="单位代码" align="center" prop="dwdm" />
      <el-table-column label="单位名称" align="center" prop="dwmc" />
      <el-table-column label="任务数" align="center" prop="rws" />
      <el-table-column label="完成数" align="center" prop="wcs" />
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.rwid)" v-hasPermi="['lghjft:rws:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.rwid)" v-hasPermi="['lghjft:rws:delete']">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <RwsForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { isEmpty } from '@/utils/is'
import download from '@/utils/download'
import { RwsApi, Rws } from '@/api/lghjft/rws'
import RwsForm from './RwsForm.vue'

/** 年度任务 列表 */
defineOptions({ name: 'Rws' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<Rws[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  rwlx: undefined,
  nd: undefined,
  dwdm: undefined,
  dwmc: undefined,
  rws: undefined,
  wcs: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await RwsApi.getRwsPage(queryParams)
    list.value = data.list
    total.value = data.total
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await RwsApi.deleteRws(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 批量删除年度任务 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await RwsApi.deleteRwsList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch { }
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: Rws[]) => {
  checkedIds.value = records.map((item) => item.rwid!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await RwsApi.exportRws(queryParams)
    download.excel(data, '年度任务.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
<style scoped>
.reset-dict-tag:deep(.el-tag) {
  all: unset !important;
  display: inline !important;
  font-size: inherit !important;
  color: inherit !important;
  line-height: inherit !important;
}
</style>