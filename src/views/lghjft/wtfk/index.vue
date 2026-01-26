<template>
  <ContentWrap>
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      label-width="100px"
    >
      <el-row :gutter="20">
        <el-col :span="8">
          <el-form-item label="反馈类型" prop="type">
            <el-select
              v-model="queryParams.type"
              placeholder="请选择反馈类型"
              clearable
              class="w-100%"
            >
              <el-option label="功能建议" value="1" />
              <el-option label="操作问题" value="2" />
              <el-option label="系统问题" value="3" />
              <el-option label="其他问题" value="4" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8">
          <el-form-item label="处理状态" prop="status">
            <el-select
              v-model="queryParams.status"
              placeholder="请选择状态"
              clearable
              class="w-100%"
            >
              <el-option label="未处理" value="1" />
              <el-option label="跟进中" value="2" />
              <el-option label="已处理" value="3" />
            </el-select>
          </el-form-item>
        </el-col>

        <el-col :span="8" class="flex items-center justify-start mb-18px">
          <el-button @click="handleQuery">
            <Icon icon="ep:search" class="mr-5px" /> 搜索
          </el-button>
          <el-button @click="resetQuery">
            <Icon icon="ep:refresh" class="mr-5px" /> 重置
          </el-button>
        </el-col>
      </el-row>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <div class="mb-10px">
      <el-button
        type="primary"
        plain
        @click="openForm('create')"
        v-hasPermi="['lghjft:wtfk:create']"
      >
        <Icon icon="ep:plus" class="mr-5px" /> 新增
      </el-button>
      <el-button
        type="success"
        plain
        @click="handleExport"
        :loading="exportLoading"
        v-hasPermi="['lghjft:wtfk:export']"
      >
        <Icon icon="ep:download" class="mr-5px" /> 导出
      </el-button>
    </div>

    <el-table
      row-key="id"
      v-loading="loading"
      :data="list"
      :stripe="true"
      :show-overflow-tooltip="true"
    >
      <el-table-column label="ID" align="center" prop="id" width="80" />
      <el-table-column label="反馈单号" align="center" prop="feedbackId" width="180" />
      <el-table-column label="用户ID" align="center" prop="userId" />
      <el-table-column label="用户名" align="center" prop="userName" />
      <el-table-column label="反馈类型" align="center" prop="type">
        <template #default="scope">
          <el-tag v-if="scope.row.type === '1'">功能建议</el-tag>
          <el-tag v-else-if="scope.row.type === '2'" type="success">操作问题</el-tag>
          <el-tag v-else-if="scope.row.type === '3'" type="warning">系统问题</el-tag>
          <el-tag v-else-if="scope.row.type === '4'" type="danger">其他问题</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="平台名称" align="center" prop="platformName" />
      <el-table-column label="反馈内容" align="center" prop="content">
        <template #default="scope">
          <div v-html="scope.row.content" style="max-height: 100px; overflow: hidden; text-overflow: ellipsis;"></div>
        </template>
      </el-table-column>

      <el-table-column label="处理状态" align="center" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0 || scope.row.status === 1" type="info">待处理</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="warning">跟进中</el-tag>
      <!--        4状态码为，管理员端进行删除后，防止普通用户也不显示，做了一个区别-->
          <el-tag v-else-if="scope.row.status === 3 || scope.row.status === 4" type="success">已处理</el-tag>
          <el-tag v-else type="info">未知</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="处理备注"
        align="center"
        prop="processNotes"
        :show-overflow-tooltip="true"
      />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column
        label="处理时间"
        align="center"
        prop="processTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="处理人" align="center" prop="processorName" width="120px">
        <template #default="scope">
          <el-tag v-if="scope.row.processorName" effect="light" type="info">
            {{ scope.row.processorName }}
          </el-tag>
          <span v-else>-</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" fixed="right" width="150px">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleDetail(scope.row.id)"
          >
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <WtfkForm ref="formRef" @success="getList" />
  <WtfkProcessForm ref="processFormRef" @success="getList" />
</template>

<script setup lang="ts">

import { onMounted, onActivated } from 'vue'

import WtfkProcessForm from './process/WtfkProcessForm.vue'

import { useRouter } from 'vue-router'

import { dateFormatter } from '@/utils/formatTime'

import download from '@/utils/download'
// @ts-ignore
import { WtfkApi, Wtfk } from '@/api/lghjft/wtfk'
import WtfkForm from './WtfkForm_.vue'

/** 工会经费通-问题反馈 列表 */
defineOptions({ name: 'Wtfk' })
onMounted(() => {
  getList()
})
//当用户通过左侧菜单或标签页切回当前页面时，强制刷新数据
onActivated(() => {
  getList()
})

const processFormRef = ref()

const { push } = useRouter() // 获取跳转方法
/** 跳转到详情页面 */
const handleDetail = (id: number) => {
  getList()
  push({
    path: '/lghjft/wtfk/detail', // 对应你路由配置的路径
    query: { id }                // 将反馈 ID 作为参数传递
  })
}

const message = useMessage() // 消息弹窗

//const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中

const list = ref<Wtfk[]>([]) // 列表的数据

const total = ref(0) // 列表的总页数

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  userId: undefined,
  userName: undefined,
  type: undefined,
  status: undefined,
  contactPhone: undefined,
  isAdminView: false,
  createTime: []
})

const queryFormRef = ref() // 搜索的表单

const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await WtfkApi.getWtfkPage(queryParams)
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
  queryParams.isAdminView = false
  handleQuery()
}

/** 添加/修改操作 */
// @ts-ignore
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}



/** 导出按钮操作 */
const handleExport = async () => {
  try {
    await message.exportConfirm()
    exportLoading.value = true
    const data = await WtfkApi.exportWtfk(queryParams)
    download.excel(data, '工会经费通-问题反馈.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}


</script>

<style scoped>
/* 强制让日期选择器充满 col 容器 */
:deep(.el-date-editor--daterange.el-input__inner) {
  width: 100% !important;
}
</style>
