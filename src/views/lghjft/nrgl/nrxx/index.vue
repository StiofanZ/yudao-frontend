<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form class="-mb-15px" :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
      <el-form-item label="标题" prop="title">
        <el-input
          v-model="queryParams.title"
          placeholder="请输入标题"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="内容类型" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="请选择内容类型"
          clearable
          class="!w-240px"
        >
          <el-option label="办事指南" value="guide" />
          <el-option label="常见问题" value="faq" />
          <el-option label="专题讲解" value="topic" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option label="启用" :value="1" />
          <el-option label="禁用" :value="0" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="info"
          plain
          @click="handleExpand"
        >
          <Icon icon="ep:sort" class="mr-5px" /> 展开/折叠
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      row-key="id"
      :default-expand-all="isExpandAll"
      v-if="refreshTable"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
    >
      <el-table-column label="标题" align="left" prop="title" />
      <el-table-column label="内容类型" align="center" prop="type">
        <template #default="scope">
          <el-tag v-if="scope.row.type === 'guide'">办事指南</el-tag>
          <el-tag v-else-if="scope.row.type === 'faq'" type="success">常见问题</el-tag>
          <el-tag v-else-if="scope.row.type === 'topic'" type="warning">专题讲解</el-tag>
          <el-tag v-else type="info">{{ scope.row.type }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 1" type="success">启用</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            修改
          </el-button>
          <el-button
            link
            type="primary"
            @click="openForm('create', undefined, scope.row.id)"
          >
            新增
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 表单弹窗 -->
  <NrxxForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { getNrxxfbList, deleteNrxx } from '@/api/lghjft/nrgl/nrxx'
import NrxxForm from './NrxxForm.vue'
import { handleTree } from '@/utils/tree'
import { dateFormatter } from '@/utils/formatTime'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(true)
const list = ref([])
const queryParams = ref({
  title: undefined,
  type: undefined,
  status: undefined
})
const queryFormRef = ref()
const isExpandAll = ref(false)
const refreshTable = ref(true)

const formRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getNrxxfbList(queryParams.value)
    list.value = handleTree(data)
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

/** 展开/折叠操作 */
const handleExpand = () => {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

/** 添加/修改操作 */
const openForm = (type: string, id?: number, parentId?: number) => {
  formRef.value.open(type, id, parentId)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    await ElMessageBox.confirm('是否确认删除编号为"' + id + '"的数据项?')
    await deleteNrxx(id)
    await getList()
    ElMessage.success('删除成功')
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
