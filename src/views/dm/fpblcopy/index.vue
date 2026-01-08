<template>
  <ContentWrap>

    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="auto">

      <el-form-item label="类型" prop="lx">
        <el-input v-model="queryParams.lx" placeholder="请输入类型" clearable @keyup.enter="handleQuery" class="!w-180px" />
      </el-form-item>
      <el-form-item label="描述" prop="ms">
        <el-input v-model="queryParams.ms" placeholder="请输入描述" clearable @keyup.enter="handleQuery" class="!w-180px" />
      </el-form-item>
      <el-form-item label="有效期起" prop="yxqq">
        <el-date-picker v-model="queryParams.yxqq" value-format="YYYY-MM-DD" type="date" placeholder="选择有效期起" clearable
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="有效期止" prop="yxqz">
        <el-date-picker v-model="queryParams.yxqz" value-format="YYYY-MM-DD" type="date" placeholder="选择有效期止" clearable
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="有效标志" prop="xybz">
        <el-input v-model="queryParams.xybz" placeholder="请输入有效标志" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="基层比例" prop="jcghbl">
        <el-input v-model="queryParams.jcghbl" placeholder="请输入基层比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="行业比例" prop="hyghbl">
        <el-input v-model="queryParams.hyghbl" placeholder="请输入行业工会比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="属地比例" prop="sdghbl">
        <el-input v-model="queryParams.sdghbl" placeholder="请输入属地工会比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="县级比例" prop="xjghbl">
        <el-input v-model="queryParams.xjghbl" placeholder="请输入县级工会比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="市级比例" prop="sjghbl">
        <el-input v-model="queryParams.sjghbl" placeholder="请输入市级比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="省总比例" prop="szghbl">
        <el-input v-model="queryParams.szghbl" placeholder="请输入省总工会比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="全总比例" prop="qgzghbl">
        <el-input v-model="queryParams.qgzghbl" placeholder="请输入全总比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="省稽查局比例" prop="sjcjbl">
        <el-input v-model="queryParams.sjcjbl" placeholder="请输入省稽查局比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="省税局比例" prop="sdsjbl">
        <el-input v-model="queryParams.sdsjbl" placeholder="请输入省税局比例" clearable @keyup.enter="handleQuery"
          class="!w-180px" />
      </el-form-item>
      <el-form-item label="主管税务机关比例" prop="swjgbl">
        <el-input v-model="queryParams.swjgbl" placeholder="请输入主管税务机关比例" clearable @keyup.enter="handleQuery"
          class="!w-200180pxpx" />
      </el-form-item>
      <el-form-item>
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
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <div style="width: 100%; overflow-x: auto;">
      <el-table row-key="blId" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
        max-height="500px" style="width: 100%" @selection-change="handleRowCheckboxChange">
        <el-table-column type="selection" width="55" />

        <!-- 描述列：宽度适中，内容超出自动换行 -->
        <el-table-column label="描述" align="center" prop="ms" min-width="250" :show-overflow-tooltip="false">
          <template #default="{ row }">
            <div style=" word-break: break-word; white-space: normal; line-height: 1.5; padding: 8px 4px;">
              {{ row.ms || '--' }}
            </div>
          </template>
        </el-table-column>

        <!-- 日期列：显示标准日期格式 -->
        <el-table-column label="有效期起" align="center" prop="yxqq" width="115">
          <template #default="{ row }">
            <span>{{ formatStandardDate(row.yxqq) }}</span>
          </template>
        </el-table-column>

        <el-table-column label="有效期止" align="center" prop="yxqz" width="115">
          <template #default="{ row }">
            <span>{{ formatStandardDate(row.yxqz) }}</span>
          </template>
        </el-table-column>

        <!-- 有效标志：Y显示"是"，N显示"否" -->
        <el-table-column label="有效标志" align="center" prop="xybz" width="90">
          <template #default="{ row }">
            <el-tag :type="row.xybz === 'Y' ? 'success' : row.xybz === 'N' ? 'danger' : 'info'" size="small"
              effect="plain">
              {{ row.xybz === 'Y' ? '是' : row.xybz === 'N' ? '否' : row.xybz || '--' }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- YXJ列 -->
        <el-table-column label="YXJ" align="center" prop="yxj" width="90">
          <template #default="{ row }">
            <span>{{ row.yxj || '--' }}</span>
          </template>
        </el-table-column>

        <!-- 操作列 -->
        <el-table-column label="操作" align="center" width="130" fixed="right">
          <template #default="scope">
            <el-button link type="primary" size="small" @click="openForm('update', scope.row.blId)"
              v-hasPermi="['dm:fpbl-copy:update']">
              编辑
            </el-button>
            <el-button link type="danger" size="small" @click="handleDelete(scope.row.blId)"
              v-hasPermi="['dm:fpbl-copy:delete']">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
      @pagination="getList" />

    <!-- 表单弹窗：添加/修改 -->
    <FpblCopyForm ref="formRef" @success="getList" />
  </ContentWrap>
</template>

<script setup lang="ts">
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
  bluuid: undefined,
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
  tj: undefined,
  yxj: undefined,
  mrbz: undefined,
  jym: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中
import { ref, reactive, onMounted } from 'vue'



/**
 * 格式化标准日期（YYYY-MM-DD）
 */
const formatStandardDate = (dateValue: any): string => {
  if (!dateValue) return '--'

  try {
    let date: Date

    if (typeof dateValue === 'string') {
      // 处理各种可能的日期字符串格式
      if (dateValue.includes('T')) {
        // ISO格式：2023-12-25T08:30:00.000Z
        date = new Date(dateValue)
      } else if (dateValue.includes(' ')) {
        // 空格分隔格式：2023-12-25 08:30:00
        date = new Date(dateValue.replace(' ', 'T'))
      } else if (dateValue.includes('/')) {
        // 斜杠格式：2023/12/25
        date = new Date(dateValue.replace(/\//g, '-'))
      } else {
        // 可能是纯数字时间戳或YYYYMMDD格式
        if (/^\d{8}$/.test(dateValue)) {
          // YYYYMMDD格式
          const year = dateValue.substring(0, 4)
          const month = dateValue.substring(4, 6)
          const day = dateValue.substring(6, 8)
          date = new Date(`${year}-${month}-${day}`)
        } else {
          date = new Date(dateValue)
        }
      }
    } else if (typeof dateValue === 'number') {
      // 时间戳
      date = new Date(dateValue)
    } else if (dateValue instanceof Date) {
      // Date对象
      date = dateValue
    } else {
      return '--'
    }

    // 检查日期是否有效
    if (isNaN(date.getTime())) {
      return '--'
    }

    // 格式化为 YYYY-MM-DD
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
  } catch (error) {
    console.error('日期格式化错误:', error, dateValue)
    return '--'
  }
}
/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await FpblCopyApi.getFpblCopyPage(queryParams)
    console.log(data);

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
  // console.log(blId);

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
</style>