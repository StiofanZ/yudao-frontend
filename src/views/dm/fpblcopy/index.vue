<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="描述" prop="ms">
        <el-input v-model="queryParams.ms" placeholder="请输入描述" clearable @keyup.enter="handleQuery" class="!w-210px" />
      </el-form-item>
      <el-form-item label="有效期起" prop="yxqq">
        <el-date-picker v-model="queryParams.yxqq" value-format="YYYY-MM-DD" type="date" placeholder="选择有效期起" clearable
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="有效期止" prop="yxqz">
        <el-date-picker v-model="queryParams.yxqz" value-format="YYYY-MM-DD" type="date" placeholder="选择有效期止" clearable
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="有效标志" prop="xybz">
        <el-select v-model="queryParams.xybz" placeholder="请选择有效标志" clearable class="!w-210px">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.SYS_FPBL_GH)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="基层比例" prop="jcghbl">
        <el-input v-model="queryParams.jcghbl" placeholder="请输入基层工会比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="行业比例" prop="hyghbl">
        <el-input v-model="queryParams.hyghbl" placeholder="请输入行业工会比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="属地比例" prop="sdghbl">
        <el-input v-model="queryParams.sdghbl" placeholder="请输入属地工会比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="县级比例" prop="xjghbl">
        <el-input v-model="queryParams.xjghbl" placeholder="请输入县级工会比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="市级比例" prop="sjghbl">
        <el-input v-model="queryParams.sjghbl" placeholder="请输入市级工会比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="省总比例" prop="szghbl">
        <el-input v-model="queryParams.szghbl" placeholder="请输入省总工会比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="全总比例" prop="qgzghbl">
        <el-input v-model="queryParams.qgzghbl" placeholder="请输入全总工会比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="省稽查局比例" prop="sjcjbl">
        <el-input v-model="queryParams.sjcjbl" placeholder="请输入省稽查局比例" clearable @keyup.enter="handleQuery"
          class="!w-210px" />
      </el-form-item>
      <el-form-item label="省税局比例" prop="sdsjbl">
        <el-input v-model="queryParams.sdsjbl" placeholder="请输入省税局比例" clearable @keyup.enter="handleQuery"
          class="!w-220px" />
      </el-form-item>
      <el-form-item label="主管税务机关比例" prop="swjgbl">
        <el-input v-model="queryParams.swjgbl" placeholder="请输入主管税务机关比例" clearable @keyup.enter="handleQuery"
          class="!w-220px" />
      </el-form-item>
      <div class="button-actions"><el-form-item>
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" /> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" /> 重置
          </el-button>
          <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['dm:fpbl-copy:create']">
            <Icon icon="ep:plus" class="mr-5px" /> 新增
          </el-button>
          <el-button type="success" plain @click="handleExport" :loading="exportLoading"
            v-hasPermi="['dm:fpbl-copy:export']">
            <Icon icon="ep:download" class="mr-5px" /> 导出
          </el-button>
          <el-button type="danger" plain :disabled="isEmpty(checkedIds)" @click="handleDeleteBatch"
            v-hasPermi="['dm:fpbl-copy:delete']">
            <Icon icon="ep:delete" class="mr-5px" /> 批量删除
          </el-button>
        </el-form-item></div>

    </el-form>
  </ContentWrap>

  <!-- 列表 - 修改表格部分 -->
  <ContentWrap>
    <el-table row-key="blId" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="false"
      @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="45" />
      <!-- 描述列放宽，左对齐 -->
      <el-table-column label="描述" align="center" prop="ms" min-width="350" :show-overflow-tooltip="false" />
      <!-- 有效期起/止列缩小，只显示日期 -->
      <el-table-column label="有效期起" align="center" prop="yxqq" width="110" :formatter="formatDateOnly" />
      <el-table-column label="有效期止" align="center" prop="yxqz" width="110" :formatter="formatDateOnly" />
      <!-- 其他列缩小 -->
      <el-table-column label="有效标志" align="center" prop="xybz" width="85">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYS_FPBL_GH" :value="scope.row.xybz" />
        </template>
      </el-table-column>
      <el-table-column label="优先级" align="center" prop="yxj" width="80" />
      <!-- 操作列固定右侧 -->
      <el-table-column label="操作" align="center" width="120" fixed="right">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.blId)"
            v-hasPermi="['dm:fpbl-copy:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.blId)" v-hasPermi="['dm:fpbl-copy:delete']">
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
  <FpblCopyForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { FpblCopyApi, FpblCopy } from '@/api/dm/fpblcopy'
import FpblCopyForm from './FpblCopyForm.vue'

/** 分配比例 列表 */
defineOptions({ name: 'FpblCopy' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<FpblCopy[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  lx: undefined,
  ms: undefined,
  yxqq: undefined,
  yxqz: undefined,
  xybz: undefined,
  jcghbl: undefined,
  hyghbl: undefined,
  sdghbl: undefined,
  xjghbl: undefined,
  sjghbl: undefined,
  szghbl: undefined,
  qgzghbl: undefined,
  sjcjbl: undefined,
  sdsjbl: undefined,
  swjgbl: undefined,
  yxj: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 只显示日期的格式化函数 */
const formatDateOnly = (row: any, column: any, cellValue: any) => {
  if (!cellValue) return '';
  // 如果已经有 dateFormatter 函数，先使用它
  const formatted = dateFormatter(row, column, cellValue);
  // 然后只取日期部分（去掉时间）
  if (formatted && typeof formatted === 'string') {
    // 处理常见日期格式
    if (formatted.includes(' ')) {
      // 格式如 "2024-01-01 00:00:00" -> 取前10位
      return formatted.substring(0, 10);
    }
    // 如果已经是纯日期格式，直接返回
    if (formatted.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return formatted;
    }
  }
  // 如果上述都不匹配，返回原值的前10个字符
  return cellValue.toString().substring(0, 10);
}

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FpblCopyApi.getFpblCopyPage(queryParams)
    console.log(list);

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
const openForm = (type: string, blId?: number) => {
  console.log();

  formRef.value.open(type, blId)
}

/** 删除按钮操作 */
const handleDelete = async (blId: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await FpblCopyApi.deleteFpblCopy(blId)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 批量删除分配比例 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await FpblCopyApi.deleteFpblCopyList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch { }
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: FpblCopy[]) => {
  checkedIds.value = records.map((item) => item.blId!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await FpblCopyApi.exportFpblCopy(queryParams)
    download.excel(data, '分配比例.xls')
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

.button-actions {
  width: 100%;
  margin-top: 20px;
  text-align: left;
}
</style>