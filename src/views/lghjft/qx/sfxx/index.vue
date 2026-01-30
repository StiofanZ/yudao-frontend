<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="80px"
    >
      <el-form-item label="账号ID" prop="dlzhId">
        <el-input
          v-model="queryParams.dlzhId"
          class="!w-240px"
          clearable
          placeholder="请输入登录账号ID"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登记序号" prop="djxh">
        <el-input
          v-model="queryParams.djxh"
          class="!w-240px"
          clearable
          placeholder="请输入登记序号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份类型" prop="sflx">
        <el-select
          v-model="queryParams.sflx"
          class="!w-240px"
          clearable
          placeholder="请选择身份类型"
        >
          <el-option label="基层工会" value="01" />
          <el-option label="缴费单位" value="02" />
          <el-option label="联合工会" value="03" />
          <el-option label="集团工会" value="04" />
          <el-option label="产业系统工会" value="05" />
          <el-option label="县区总工会" value="06" />
          <el-option label="市总工会" value="07" />
          <el-option label="省总工会" value="08" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限类型" prop="qxlx">
        <el-select
          v-model="queryParams.qxlx"
          class="!w-240px"
          clearable
          placeholder="请选择权限类型"
        >
          <el-option label="管理员" value="01" />
          <el-option label="一般人" value="02" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择状态">
          <el-option :value="0" label="待审核" />
          <el-option :value="1" label="已审核" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon class="mr-5px" icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon class="mr-5px" icon="ep:refresh" /> 重置</el-button>
        <el-button
          v-hasPermi="['lghjft:qx-sfxx:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" /> 新增
        </el-button>
        <el-button
          v-hasPermi="['lghjft:qx-sfxx:delete']"
          :disabled="checkedIds.length === 0"
          plain
          type="danger"
          @click="handleDeleteBatch"
        >
          <Icon class="mr-5px" icon="ep:delete" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      :stripe="true"
      row-key="id"
      @selection-change="handleRowCheckboxChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column align="center" label="ID" prop="id" width="80" />
      <el-table-column align="center" label="账号ID" prop="dlzhId" width="100" />
      <el-table-column align="center" label="登记序号" prop="djxh" width="160" />
      <el-table-column align="center" label="身份类型" prop="sflx" width="120">
        <template #default="scope">
          <span v-if="scope.row.sflx === '01'">基层工会</span>
          <span v-else-if="scope.row.sflx === '02'">缴费单位</span>
          <span v-else-if="scope.row.sflx === '03'">联合工会</span>
          <span v-else-if="scope.row.sflx === '04'">集团工会</span>
          <span v-else-if="scope.row.sflx === '05'">产业系统工会</span>
          <span v-else-if="scope.row.sflx === '06'">县区总工会</span>
          <span v-else-if="scope.row.sflx === '07'">市总工会</span>
          <span v-else-if="scope.row.sflx === '08'">省总工会</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限类型" prop="qxlx" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.qxlx === '01'" type="success">管理员</el-tag>
          <el-tag v-else-if="scope.row.qxlx === '02'" type="info">一般人</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" min-width="140" prop="deptName" />
      <el-table-column align="center" label="状态" prop="status" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">待审核</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">已审核</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" fixed="right" label="操作" width="240">
        <template #default="scope">
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:audit']"
            :disabled="scope.row.status === 1"
            link
            type="success"
            @click="handleAudit(scope.row.id, 1)"
          >
            审核
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:audit']"
            :disabled="scope.row.status === 0"
            link
            type="warning"
            @click="handleAudit(scope.row.id, 0)"
          >
            反审
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <SfxxForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { type Sfxx, SfxxApi } from '@/api/lghjft/qx/sfxx'
import SfxxForm from './SfxxForm.vue'

defineOptions({ name: 'LghjftQxSfxx' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<Sfxx[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  dlzhId: undefined as number | undefined,
  djxh: undefined as string | undefined,
  sflx: undefined as string | undefined,
  qxlx: undefined as string | undefined,
  status: undefined as number | undefined
})
const queryFormRef = ref()

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: Sfxx[]) => {
  checkedIds.value = records.map((item) => item.id!) as number[]
}

const getList = async () => {
  loading.value = true
  try {
    const data = await SfxxApi.getSfxxPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await SfxxApi.deleteSfxx(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    await SfxxApi.deleteSfxxList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleAudit = async (id: number, status: number) => {
  try {
    await message.confirm(status === 1 ? '确认审核通过？' : '确认反审（回到待审核）？')
    await SfxxApi.auditSfxx(id, status)
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
