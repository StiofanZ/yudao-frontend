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

      <el-form-item label="可见范围" prop="kjfw">
        <el-select
          v-model="queryParams.kjfw"
          placeholder="请选择可见范围"
          clearable
          class="!w-240px"
        >
          <el-option label="完全可见" :value="1" />
          <el-option label="下级可见" :value="2" />
          <el-option label="本级可见" :value="3" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态" prop="status">
        <el-select
          v-model="queryParams.status"
          placeholder="请选择状态"
          clearable
          class="!w-240px"
        >
          <el-option label="草稿" :value="0" />
          <el-option label="已发布" :value="1" />
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
      <el-table-column label="发布部门" align="center" prop="fbbm">
        <template #default="scope">
          <span v-if="scope.row.fbbm === 0">全总</span>
          <span v-else-if="scope.row.fbbm === 1">省总</span>
          <span v-else-if="scope.row.fbbm === 2">市州</span>
        </template>
      </el-table-column>
      <el-table-column label="发布日期" align="center" prop="fbrq" width="180" :formatter="dateFormatter" />
      <el-table-column label="发布部门" align="center" prop="deptName" />
      <el-table-column label="可见范围" align="center" prop="kjfw">
        <template #default="scope">
          <el-tag v-if="scope.row.kjfw === 1" type="success">完全可见</el-tag>
          <el-tag v-else-if="scope.row.kjfw === 2" type="warning">下级可见</el-tag>
          <el-tag v-else-if="scope.row.kjfw === 3" type="info">本级可见</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="排序" align="center" prop="sort" />
      <el-table-column label="状态" align="center" prop="status">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="info">未审核</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="primary">已审核</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="success">已发布</el-tag>
          <el-tag v-else-if="scope.row.status === 3" type="warning">已过期</el-tag>
          <el-tag v-else-if="scope.row.status === 4" type="danger">已下架</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="180" :formatter="dateFormatter" />
      <el-table-column label="操作" align="center" width="250" fixed="right">
        <template #default="scope">
          <!-- 只有本部门的草稿可以发布 -->
          <el-button
            link
            type="success"
            :disabled="!(scope.row.status === 0 && scope.row.deptId === userStore.getUser.deptId)"
            @click="handlePublish(scope.row.id)"
          >
            发布
          </el-button>
          <!-- 只有本部门的内容可以修改 -->
          <el-button
            link
            type="primary"
            :disabled="!(scope.row.status === 0 && scope.row.deptId === userStore.getUser.deptId)"
            @click="openForm('update', scope.row.id)"
          >
            修改
          </el-button>
          <!-- 只有本部门的内容可以新增子项（或者都允许？通常允许） -->
          <el-button
            link
            type="primary"
            @click="openForm('create', undefined, scope.row.id)"
          >
            新增
          </el-button>
          <!-- 只有本部门的内容可以删除 -->
          <el-button
            link
            type="danger"
            :disabled="scope.row.deptId !== userStore.getUser.deptId"
            @click="handleDelete(scope.row.id)"
          >
            删除
          </el-button>
          <!-- 下架按钮 -->
          <el-button
            link
            type="danger"
            :disabled="!(scope.row.status === 2 || scope.row.status === 3)"
            @click="handleOffShelf(scope.row)"
          >
            下架
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </ContentWrap>

  <!-- 表单弹窗 -->
  <ZcjdForm ref="formRef" @success="getList" />

  <!-- 下架原因弹窗 -->
  <el-dialog v-model="offShelfVisible" title="下架原因" width="30%">
    <el-form :model="offShelfForm" label-width="80px">
      <el-form-item label="原因">
        <el-select v-model="offShelfForm.reason" placeholder="请选择下架原因" style="width: 100%">
          <el-option label="已失效政策" value="1" />
          <el-option label="新政策替代" value="2" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="offShelfVisible = false">取消</el-button>
      <el-button type="primary" @click="submitOffShelf">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { getZcjdfbList, deleteZcjd, publishZcjd, offShelfZcjd } from '@/api/lghjft/nrgl/zcjd'
import ZcjdForm from './ZcjdForm.vue'
import { handleTree } from '@/utils/tree'
import { dateFormatter } from '@/utils/formatTime'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'

const userStore = useUserStore()
const loading = ref(true)
const list = ref<any[]>([])
const queryParams = ref({
  title: undefined,
  
  status: undefined,
  kjfw: undefined
})
const queryFormRef = ref()
const isExpandAll = ref(false)
const refreshTable = ref(true)

const formRef = ref()

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getZcjdfbList(queryParams.value)
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
    await deleteZcjd(id)
    await getList()
    ElMessage.success('删除成功')
  } catch {}
}

/** 发布按钮操作 */
const handlePublish = async (id: number) => {
  try {
    await ElMessageBox.confirm('是否确认发布编号为"' + id + '"的数据项? 发布后下级部门可见。')
    await publishZcjd(id)
    await getList()
    ElMessage.success('发布成功')
  } catch {}
}

const offShelfVisible = ref(false)
const offShelfForm = ref({
  id: undefined,
  reason: undefined
})

const handleOffShelf = (row: any) => {
  offShelfForm.value.id = row.id
  offShelfForm.value.reason = undefined
  offShelfVisible.value = true
}

const submitOffShelf = async () => {
  if (!offShelfForm.value.reason) {
    ElMessage.error('请选择下架原因')
    return
  }
  try {
    await offShelfZcjd(offShelfForm.value.id, offShelfForm.value.reason)
    ElMessage.success('下架成功')
    offShelfVisible.value = false
    getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
