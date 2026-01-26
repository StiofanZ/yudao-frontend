<template>
  <ContentWrap>
    <el-form :model="queryParams" ref="queryFormRef" :inline="true" @submit.prevent>
      <el-form-item label="反馈单号" prop="feedbackId">
        <el-input
          v-model="queryParams.feedbackId"
          placeholder="请输入单号ID"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select style="width: 150px" v-model="queryParams.status" placeholder="请选择状态" clearable>
          <el-option label="待处理" :value="1" />
          <el-option label="跟进中" :value="2" />
          <el-option label="已处理" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" />查询</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" />重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list">
      <el-table-column label="反馈单号" align="center" prop="feedbackId" />
      <el-table-column label="反馈内容" align="center" prop="content">
        <template #default="scope">
          <div
            v-html="scope.row.content"
            style="max-height: 50px; overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;"
          ></div>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1 || scope.row.status === 0" type="info">待处理</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="warning">跟进中</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="success">已处理</el-tag>
          <span v-else>{{ scope.row.status }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="反馈时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button link type="primary" @click="openForm(scope.row.id)"> 处理 </el-button>
          <el-button
            v-if="scope.row.status === 3"
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
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <WtfkProcessForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { useMessage } from '@/hooks/web/useMessage'
import { dateFormatter } from '@/utils/formatTime'
import { onActivated, onMounted, reactive, ref } from 'vue' // 确保引用完整
import { WtfkApi } from '@/api/lghjft/wtfk'
import WtfkProcessForm from './WtfkProcessForm.vue'

const loading = ref(true)
const list = ref([])
const total = ref(0)
const formRef = ref()
const message = useMessage()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  feedbackId: null,
  isAdminView: true, // 管理端
  status: null
})
const handleDelete = async (id: number) => {
  try {
    // 强制等待用户点击“确定”
    await message.confirm('确定要删除这条记录吗？')

    // 执行到这里说明用户点的是“确定”
    loading.value = true // 开始加载状态
    await WtfkApi.deleteWtfk(id) // 调用接口

    message.success('删除成功')
    await getList() // 刷新列表
  } catch (e) {
    // 只有用户点“取消”或者接口报错才会进这里
    if (e === 'cancel') {
      console.log('用户点击了取消')
    } else {
      console.error('删除过程发生错误：', e)
    }
  } finally {
    loading.value = false
  }
}

/** 获取列表数据 */
const getList = async () => {
  loading.value = true
  try {
    // 调试：请查看控制台是否打印出带有 feedbackId 的对象
    console.log('请求参数检查：', queryParams)
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
  queryParams.feedbackId = null
  queryParams.status = null
  queryParams.isAdminView = true
  handleQuery()
}

const openForm = (id: number) => {
  formRef.value.open(id)
}

onMounted(() => {
  getList()
})

onActivated(() => {
  getList()
})
</script>
