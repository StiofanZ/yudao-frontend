<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="消息标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入消息标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select
          v-model="queryParams.messageType"
          placeholder="请选择消息类型"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in messageTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="消息状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择消息状态"
          clearable
          class="!w-240px"
        >
          <el-option
            v-for="item in statusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['lghjft:xxzx-xxtx:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="danger"
          plain
          :disabled="checkedIds.length === 0"
          @click="handleDeleteBatch"
          v-hasPermi="['lghjft:xxzx-xxtx:delete']"
        >
          <Icon icon="ep:delete" class="mr-5px" /> 批量删除
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" @selection-change="handleRowCheckboxChange">
      <el-table-column type="selection" width="55" />
      <el-table-column label="消息编号" align="center" prop="id" />
      <el-table-column label="消息标题" align="center" prop="title" />
      <el-table-column label="消息类型" align="center" prop="messageType">
        <template #default="scope">
          <el-tag :type="scope.row.messageType === 0 ? 'primary' : 'success'">
            {{ getMessageTypeLabel(scope.row.messageType) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.status)">
            {{ getStatusLabel(scope.row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="发送时间"
        align="center"
        prop="sendTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            :disabled="![0].includes(+scope.row.status)" 
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
          <el-button
            link
            type="success"
            @click="handleSend(scope.row)"
            :disabled="![0, 2].includes(+scope.row.status)"
          >
            发送
          </el-button>
          <el-button
            link
            type="warning"
            @click="handleRecall(scope.row.id)"
            v-hasPermi="['lghjft:xxzx-xxtx:update']"
            :disabled="+scope.row.status !== 1"
          >
            撤回
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
  <XxtxForm ref="formRef" @success="getList" />
</template>
<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import * as XxtxApi from '@/api/lghjft/xxzx/xxtx/index'
import XxtxForm from './XxtxForm.vue'

defineOptions({ name: 'XxzxXxtx' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  title: '',
  messageType: undefined,
  status: undefined
})
const queryFormRef = ref() // 搜索的表单

const messageTypeOptions = [
  { value: 0, label: '系统消息' },
  { value: 1, label: '业务消息' }
]

const statusOptions = [
  { value: 0, label: '草稿' },
  { value: 1, label: '已发送' },
  { value: 2, label: '已撤回' }
]

const getMessageTypeLabel = (type: number) => {
  const found = messageTypeOptions.find((item) => item.value === type)
  return found ? found.label : '未知'
}

const getStatusLabel = (status: number) => {
  const found = statusOptions.find((item) => item.value === status)
  return found ? found.label : '未知'
}

const getStatusType = (status: number) => {
  switch (status) {
    case 0:
      return 'info'
    case 1:
      return 'success'
    case 2:
      return 'warning'
    default:
      return 'info'
  }
}

/** 查询消息列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await XxtxApi.getXxtxPage(queryParams)
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
    await XxtxApi.deleteXxtx(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 批量删除按钮操作 */
const checkedIds = ref<number[]>([])
const handleRowCheckboxChange = (rows: XxtxApi.XxtxVO[]) => {
  checkedIds.value = rows.map((row) => row.id)
}

const handleDeleteBatch = async () => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起批量删除
    await XxtxApi.deleteXxtxList(checkedIds.value)
    checkedIds.value = []
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 发送按钮操作 */
const handleSend = async (row: XxtxApi.XxtxVO) => {
  try {
    // 发送的二次确认
    await message.confirm('是否确认发送消息？')
    // 发起发送
    await XxtxApi.sendXxtx({ messageId: row.id })
    message.success('发送成功')
    await getList()
  } catch {}
}

/** 撤回按钮操作 */
const handleRecall = async (id: number) => {
  try {
    // 撤回的二次确认
    await message.confirm('是否确认撤回消息？')
    // 发起撤回
    await XxtxApi.recallXxtx(id)
    message.success('撤回成功')
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
