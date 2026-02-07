<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="80px"
    >
      <el-form-item label="用户账号" prop="yhzh">
        <el-input
          v-model="queryParams.yhzh"
          class="!w-240px"
          clearable
          placeholder="请输入用户账号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户姓名" prop="yhxm">
        <el-input
          v-model="queryParams.yhxm"
          class="!w-240px"
          clearable
          placeholder="请输入用户姓名"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="联系电话" prop="lxdh">
        <el-input
          v-model="queryParams.lxdh"
          class="!w-240px"
          clearable
          placeholder="请输入联系电话"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="yhyx">
        <el-input
          v-model="queryParams.yhyx"
          class="!w-240px"
          clearable
          placeholder="请输入用户邮箱"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="信用代码" prop="shxydm">
        <el-input
          v-model="queryParams.shxydm"
          class="!w-240px"
          clearable
          placeholder="请输入社会信用代码"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择状态">
          <el-option :value="0" label="正常" />
          <el-option :value="1" label="停用" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon class="mr-5px" icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon class="mr-5px" icon="ep:refresh" /> 重置</el-button>
        <el-button
          v-hasPermi="['lghjft:qx-dlzh:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" /> 新增
        </el-button>
        <el-button
          v-hasPermi="['lghjft:qx-dlzh:delete']"
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
      <el-table-column align="center" label="用户账号" min-width="140" prop="yhzh" />
      <el-table-column align="center" label="用户姓名" min-width="120" prop="yhxm" />
      <el-table-column align="center" label="联系电话" prop="lxdh" width="140" />
      <el-table-column align="center" label="用户邮箱" min-width="180" prop="yhyx" />
      <el-table-column align="center" label="社会信用代码" min-width="180" prop="shxydm" />
      <el-table-column align="center" label="状态" prop="status" width="90">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="success">正常</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="info">停用</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="最后登录时间"
        prop="loginDate"
        width="180"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleOpenSfxx(scope.row)"
          >
            添加身份
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-dlzh:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-dlzh:reset-password']"
            link
            type="warning"
            @click="handleResetPwd(scope.row)"
          >
            重置密码
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-dlzh:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
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

  <DlzhForm ref="formRef" @success="getList" />
  <SfxxForm ref="sfxxFormRef" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { type Dlzh, DlzhApi } from '@/api/lghjft/qx/dlzh'
import DlzhForm from './DlzhForm.vue'
import SfxxForm from '@/views/lghjft/qx/sfxx/SfxxForm.vue'

defineOptions({ name: 'LghjftQxDlzh' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<Dlzh[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  yhzh: undefined as string | undefined,
  yhxm: undefined as string | undefined,
  lxdh: undefined as string | undefined,
  yhyx: undefined as string | undefined,
  shxydm: undefined as string | undefined,
  status: undefined as number | undefined
})
const queryFormRef = ref()

const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (records: Dlzh[]) => {
  checkedIds.value = records.map((item) => item.id!) as number[]
}

const getList = async () => {
  loading.value = true
  try {
    const data = await DlzhApi.getDlzhPage(queryParams)
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

const sfxxFormRef = ref()
const handleOpenSfxx = (row: Dlzh) => {
  sfxxFormRef.value.open('create', undefined, row.id, row)
}

const handleDelete = async (id: number) => {
  try {
    await message.delConfirm()
    await DlzhApi.deleteDlzh(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleDeleteBatch = async () => {
  try {
    await message.delConfirm()
    await DlzhApi.deleteDlzhList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

const handleResetPwd = async (row: Dlzh) => {
  try {
    const result = await message.prompt('请输入新密码', t('common.reminder'))
    const password = result.value
    await DlzhApi.resetPassword(row.id!, password)
    message.success('修改成功，新密码是：' + password)
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
