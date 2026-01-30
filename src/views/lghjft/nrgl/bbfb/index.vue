<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="68px"
    >
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          class="!w-240px"
          clearable
          placeholder="请输入标题"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="版本号" prop="version">
        <el-input
          v-model="queryParams.version"
          class="!w-240px"
          clearable
          placeholder="请输入版本号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select v-model="queryParams.status" class="!w-240px" clearable placeholder="请选择状态">
          <el-option :value="0" label="草稿" />
          <el-option :value="1" label="已发布" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon class="mr-5px" icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon class="mr-5px" icon="ep:refresh" /> 重置</el-button>
        <el-button plain type="primary" @click="openForm('create')">
          <Icon class="mr-5px" icon="ep:plus" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column align="center" label="版本号" prop="version" />
      <el-table-column align="center" label="标题" prop="title" />
      <el-table-column align="center" label="状态" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="info">草稿</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">已发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="发布时间"
        prop="fbsj"
        width="180"
      />
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" fixed="right" label="操作" width="200">
        <template #default="scope">
          <el-button
            :disabled="scope.row.status === 1"
            link
            type="success"
            @click="handlePublish(scope.row.id)"
          >
            发布
          </el-button>
          <el-button
            :disabled="scope.row.status === 1"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            修改
          </el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)"> 删除 </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 表单弹窗 -->
  <BbfbForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { deleteBbfb, getBbfbList, publishBbfb } from '@/api/lghjft/nrgl/bbfb'
import BbfbForm from './BbfbForm.vue'
import { dateFormatter } from '@/utils/formatTime'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(true)
const list = ref([])
const queryParams = ref({
  title: undefined,
  version: undefined,
  status: undefined
})
const queryFormRef = ref()
const formRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getBbfbList(queryParams.value)
    list.value = data
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('是否确认删除编号为"' + id + '"的数据项?')
    await deleteBbfb(id)
    await getList()
    ElMessage.success('删除成功')
  } catch {}
}

/** 发布按钮操作 */
const handlePublish = async (id: number) => {
  try {
    await ElMessageBox.confirm('是否确认发布编号为"' + id + '"的版本?')
    await publishBbfb(id)
    await getList()
    ElMessage.success('发布成功')
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
