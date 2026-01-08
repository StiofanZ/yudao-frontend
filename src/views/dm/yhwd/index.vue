<template>
  <ContentWrap>
    <el-row :gutter="20" class="mb-4">
      <!-- 左侧部门树区域（仅修改搜索框样式） -->
      <el-col :span="4">
        <div class="dept-tree-container"
          style="border: 1px solid #ebeef5; border-radius: 4px; padding: 10px; height: 680px; overflow-y: auto;">
          <!-- 核心修改：搜索框宽度设为240px，和右侧输入框一致 -->
          <el-input v-model="treeSearchValue" placeholder="搜索部门" class="mb-2" style="width: 240px;"
            @input="filterTree" />
          <el-tree ref="deptTreeRef" :data="deptTreeData" :props="treeProps" :filter-node-method="filterNode"
            style="margin-top: 10px;" highlight-current node-key="id" default-expand-all
            @node-click="handleTreeNodeClick" />
        </div>
      </el-col>
      <!-- 右侧：完全保留原有样式，不做任何修改 -->
      <el-col :span="20">
        <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="银行行别代码" prop="yhhbDm">
            <el-select v-model="queryParams.yhhbDm" placeholder="请选择银行行别代码" clearable class="!w-240px">
              <el-option v-for="dict in getStrDictOptions(DICT_TYPE.SYS_BANK_CODE)" :key="dict.value"
                :label="dict.label" :value="dict.value" />
            </el-select>
          </el-form-item>
          <el-form-item label="网点代码" prop="yhwdDm">
            <el-input v-model="queryParams.yhwdDm" placeholder="请输入网点代码" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="网点名称" prop="yhwdmc">
            <el-input v-model="queryParams.yhwdmc" placeholder="请输入网点名称" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="网点简称" prop="yhwdjc">
            <el-input v-model="queryParams.yhwdjc" placeholder="请输入网点简称" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="网点行号" prop="wdhh">
            <el-input v-model="queryParams.wdhh" placeholder="请输入网点行号" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="清算行号" prop="qshh">
            <el-input v-model="queryParams.qshh" placeholder="请输入清算行号" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="行政区划代码" prop="xzqhDm">
            <el-input v-model="queryParams.xzqhDm" placeholder="请输入行政区划代码" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="顺序号" prop="sxh">
            <el-input v-model="queryParams.sxh" placeholder="请输入顺序号" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="有效期止" prop="yxqz">
            <el-date-picker v-model="queryParams.yxqz" value-format="YYYY-MM-DD" type="date" placeholder="选择有效期止"
              clearable class="!w-240px" />
          </el-form-item>
          <el-form-item label="网点地址" prop="wddz">
            <el-input v-model="queryParams.wddz" placeholder="请输入网点地址" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item label="网点电话" prop="wddh">
            <el-input v-model="queryParams.wddh" placeholder="请输入网点电话" clearable @keyup.enter="handleQuery"
              class="!w-240px" />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleQuery">
              <Icon icon="ep:search" class="mr-5px" /> 搜索
            </el-button>
            <el-button @click="resetQuery">
              <Icon icon="ep:refresh" class="mr-5px" /> 重置
            </el-button>
            <el-button type="primary" plain @click="openForm('create')" v-hasPermi="['dm:yhwd:create']">
              <Icon icon="ep:plus" class="mr-5px" /> 新增
            </el-button>
            <el-button type="success" plain @click="handleExport" :loading="exportLoading"
              v-hasPermi="['dm:yhwd:export']">
              <Icon icon="ep:download" class="mr-5px" /> 导出
            </el-button>
            <el-button type="danger" plain :disabled="isEmpty(checkedIds)" @click="handleDeleteBatch"
              v-hasPermi="['dm:yhwd:delete']">
              <Icon icon="ep:delete" class="mr-5px" /> 批量删除
            </el-button>
          </el-form-item>
        </el-form>

        <!-- 列表：保留原有固定height:400px -->
        <div style="margin-top: 20px;">
          <el-table row-key="yhhbId" v-loading="loading" :data="list" :stripe="true" height="400"
            @selection-change="handleRowCheckboxChange">
            <el-table-column type="selection" width="55" />
            <el-table-column label="银行行别代码" align="center" prop="yhhbDm" width="85">
              <template #default="{ row }">
                <dict-tag :type="DICT_TYPE.SYS_BANK_CODE" :value="row.yhhbDm" class="reset-dict-tag" />
              </template>
            </el-table-column>
            <el-table-column label="网点代码" align="center" prop="yhwdDm" />
            <el-table-column label="网点名称" align="center" prop="yhwdmc" />
            <el-table-column label="网点简称" align="center" prop="yhwdjc" />
            <el-table-column label="网点行号" align="center" prop="wdhh" />
            <el-table-column label="清算行号" align="center" prop="qshh" />
            <el-table-column label="行政区划代码" align="center" prop="xzqhDm" />
            <el-table-column label="顺序号" align="center" prop="sxh" />
            <el-table-column label="有效期止" align="center" prop="yxqz" width="110" :formatter="dateFormatter" />
            <el-table-column label="网点地址" align="center" prop="wddz" />
            <el-table-column label="网点电话" align="center" prop="wddh" />
            <el-table-column label="银行行别ID" align="center" prop="yhhbId" />
            <el-table-column label="操作" align="center" min-width="120px">
              <template #default="scope">
                <el-button link type="primary" @click="openForm('update', scope.row.yhhbId)"
                  v-hasPermi="['dm:yhwd:update']">
                  编辑
                </el-button>
                <el-button link type="danger" @click="handleDelete(scope.row.yhhbId)" v-hasPermi="['dm:yhwd:delete']">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
          <!-- 分页：保留原有样式 -->
          <Pagination :total="total" v-model:page="queryParams.pageNo" v-model:limit="queryParams.pageSize"
            @pagination="getList" />
        </div>
      </el-col>
    </el-row>
  </ContentWrap>

  <YhwdForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { isEmpty } from '@/utils/is'
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { YhwdApi, Yhwd } from '@/api/dm/yhwd'
import YhwdForm from './YhwdForm.vue'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { getDeptList } from '@/api/system/dept'
import { handleTree } from '@/utils/tree'
import type { ElTree } from 'element-plus'

defineOptions({ name: 'Yhwd' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<Yhwd[]>([])
const total = ref(0)

// 部门数据TS接口
interface DeptVO {
  id: number
  name: string
  parentId: number
  status: number
  sort: number
  leaderUserId: number
  phone: string
  email: string
  createTime: Date
  children?: DeptVO[]
}

// 部门树相关变量
const deptTreeRef = ref<any>()
const deptTreeData = ref<DeptVO[]>([])
const allDeptList = ref<DeptVO[]>([])
const treeSearchValue = ref('')
const treeProps = ref({
  children: 'children',
  label: 'name'
})

// 查询参数
interface QueryParams {
  pageNo: number
  pageSize: number
  yhhbDm?: string | number | undefined
  yhwdDm?: string | number | undefined
  yhwdmc?: string | undefined
  yhwdjc?: string | undefined
  wdhh?: string | number | undefined
  qshh?: string | number | undefined
  xzqhDm?: string | number | undefined
  sxh?: string | number | undefined
  yxqz?: string | undefined
  wddz?: string | undefined
  wddh?: string | undefined
  deptId?: number | undefined
}

const queryParams = reactive<QueryParams>({
  pageNo: 1,
  pageSize: 10,
  yhhbDm: undefined,
  yhwdDm: undefined,
  yhwdmc: undefined,
  yhwdjc: undefined,
  wdhh: undefined,
  qshh: undefined,
  xzqhDm: undefined,
  sxh: undefined,
  yxqz: undefined,
  wddz: undefined,
  wddh: undefined,
  deptId: undefined
})

const queryFormRef = ref()
const exportLoading = ref(false)
const checkedIds = ref<number[]>([])

// 加载部门树
const loadDeptTree = async () => {
  try {
    const res = await getDeptList({}) as DeptVO[]
    allDeptList.value = res
    const root: DeptVO & { children: DeptVO[] } = {
      id: 0,
      name: '全国总工会',
      parentId: -1,
      status: 0,
      sort: 0,
      leaderUserId: 0,
      phone: '',
      email: '',
      createTime: new Date(),
      children: []
    }
    root.children = handleTree(res, 'id', 'parentId') as DeptVO[]
    deptTreeData.value = [root]
  } catch (error) {
    message.error('加载部门树失败')
    console.error('部门树加载失败：', error)
  }
}

// 部门树筛选
const filterNode = (value: string, data: DeptVO) => {
  if (!value) return true
  return data.name.includes(value)
}

const filterTree = () => {
  if (deptTreeRef.value) {
    deptTreeRef.value.filter(treeSearchValue.value)
  }
}

// 部门树点击
const handleTreeNodeClick = (data: DeptVO) => {
  queryParams.deptId = data.id === 0 ? undefined : data.id
  queryParams.pageNo = 1
  getList()
}

// 查询列表
const getList = async () => {
  loading.value = true
  try {
    const data = await YhwdApi.getYhwdPage(queryParams)
    list.value = data.list
    total.value = data.total
  } catch (error) {
    message.error('查询网点列表失败')
    console.error('列表查询失败：', error)
  } finally {
    loading.value = false
  }
}

// 搜索
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

// 重置
const resetQuery = () => {
  queryFormRef.value?.resetFields()
  queryParams.deptId = undefined
  treeSearchValue.value = ''
  if (deptTreeRef.value) {
    deptTreeRef.value.setCurrentKey(null)
  }
  handleQuery()
}

// 新增/编辑
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

// 删除
const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await YhwdApi.deleteYhwd(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch { }
}

// 批量删除
const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    await YhwdApi.deleteYhwdList(checkedIds.value);
    checkedIds.value = [];
    message.success(t('common.delSuccess'))
    await getList();
  } catch { }
}

// 复选框多选
const handleRowCheckboxChange = (records: Yhwd[]) => {
  checkedIds.value = records.map((item) => item.yhhbId!);
}

// 导出
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await YhwdApi.exportYhwd(queryParams)
    download.excel(data, '银行网点.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

// 初始化
onMounted(async () => {
  await loadDeptTree()
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

.dept-tree-container:deep(.el-tree) {
  --el-tree-node-content-hover-bg-color: #f5f7fa;
}

.dept-tree-container {
  background: #fff;
}

.mt-2 {
  margin-top: 10px;
}

.mt-4 {
  margin-top: 20px;
}

.text-right {
  text-align: right;
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