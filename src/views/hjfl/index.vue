<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <!-- <el-form-item label="工会机构代码" prop="deptId">
        <el-input v-model="queryParams.deptId" placeholder="请输入工会机构代码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="备注" prop="bz">
        <el-select v-model="queryParams.bz" placeholder="请选择备注" clearable class="!w-240px">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.SYS_HJFL_GH)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="户籍分类代码" prop="hjflDm">
        <el-input v-model="queryParams.hjflDm" placeholder="请输入户籍分类代码" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="户籍分类名称" prop="hjflmc">
        <el-input v-model="queryParams.hjflmc" placeholder="请输入户籍分类名称" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="顺序号" prop="sxh">
        <el-input v-model="queryParams.sxh" placeholder="请输入顺序号" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item>
      <el-form-item label="户籍分类id" prop="hjflid">
        <el-input v-model="queryParams.hjflid" placeholder="请输入户籍分类id" clearable @keyup.enter="handleQuery"
          class="!w-240px" />
      </el-form-item> -->
      <el-form-item>
        <!-- <el-button @click="handleQuery">
          <Icon icon="ep:search" class="mr-5px" /> 搜索
        </el-button> -->
        <!-- <el-button @click="resetQuery">
          <Icon icon="ep:refresh" class="mr-5px" /> 重置
        </el-button> -->
        <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['dm:hjfl:create']">
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button type="success" plain @click="handleExport" :loading="exportLoading" v-hasPermi="['dm:hjfl:export']">
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
        <el-button type="danger" plain :disabled="isEmpty(checkedIds)" @click="handleDeleteBatch"
          v-hasPermi="['dm:hjfl:delete']">
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table row-key="hjflid" v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true"
      @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="工会机构代码" align="center" prop="deptId" />
      <el-table-column label="大类标识" align="center" prop="bz">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYS_HJFL_GH" :value="scope.row.bz" class="reset-dict-tag" />
        </template>
      </el-table-column>
      <el-table-column label="户籍分类代码" align="center" prop="hjflDm" />
      <el-table-column label="户籍分类名称" align="center" prop="hjflmc" />
      <el-table-column label="顺序号" align="center" prop="sxh" />
      <!-- <el-table-column label="户籍分类id" align="center" prop="hjflid" /> -->
      <el-table-column label="操作" align="center" min-width="120px">
        <template #default="scope">
          <el-button link type="primary" @click="openForm('update', scope.row.hjflid)" v-hasPermi="['dm:hjfl:update']">
            编辑
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.hjflid)" v-hasPermi="['dm:hjfl:delete']">
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
  <HjflForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { isEmpty } from '@/utils/is'
import download from '@/utils/download'
import { HjflApi, Hjfl } from '@/api/dm/hjfl'
import HjflForm from './HjflForm.vue'

/** 户籍分类 列表 */
defineOptions({ name: 'Hjfl' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<Hjfl[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  deptId: undefined,
  bz: undefined,
  hjflDm: undefined,
  hjflmc: undefined,
  sxh: undefined,
  hjflid: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await HjflApi.getHjflPage(queryParams)
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
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await HjflApi.deleteHjfl(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch { }
}

/** 批量删除户籍分类 */
const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    await HjflApi.deleteHjflList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch { }
}

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: Hjfl[]) => {
  checkedIds.value = records.map((item) => item.hjflid!);
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await HjflApi.exportHjfl(queryParams)
    download.excel(data, '户籍分类.xls')
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