<template>
  <ContentWrap>
    <el-form :inline="true" :model="queryParams" class="-mb-4">
      <el-form-item label="标签名称">
        <el-input v-model="queryParams.bqMc" clearable placeholder="请输入标签名称"
                  @keyup.enter="handleQuery"/>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery">
          <Icon class="mr-1" icon="ep:search"/>
          查询
        </el-button>
        <el-button @click="resetQuery">
          <Icon class="mr-1" icon="ep:refresh"/>
          重置
        </el-button>
        <el-button type="primary" @click="handleAdd">
          <Icon class="mr-1" icon="ep:plus"/>
          新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table :data="list" :show-overflow-tooltip="true" :stripe="true" v-loading="loading">
      <el-table-column align="center" label="编号" prop="id"/>
      <el-table-column align="center" label="标签名称" prop="bqMc" />
      <el-table-column align="center" label="创建时间" prop="createTime" width="180">
        <template #default="scope">
          <span>{{ formatDate(scope.row.createTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-button link type="primary" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button link type="primary" @click="handleHjxx(scope.row)">户籍信息</el-button>
          <el-button link type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 flex justify-end">
      <el-pagination
        v-model:current-page="queryParams.pageNo"
        v-model:page-size="queryParams.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="getList"
        @current-change="getList"
      />
    </div>

    <!-- Create/Update Dialog -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="500px">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <el-form-item label="标签名称" prop="bqMc">
          <el-input v-model="formData.bqMc" placeholder="请输入标签名称" maxlength="20" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submitForm" :loading="formLoading">确 定</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 户籍信息弹窗 -->
    <el-dialog v-model="hjxxDialogVisible" title="户籍信息" width="1000px" style="max-height: 800px">
      <div class="mb-4 flex justify-between items-center">
        <el-form :inline="true" :model="hjxxQueryParams" class="-mb-4">
          <el-form-item label="纳税人名称">
            <el-input
              v-model="hjxxQueryParams.nsrmc"
              placeholder="请输入纳税人名称"
              clearable
              @keyup.enter="handleHjxxQuery"
              class="!w-240px"
            />
          </el-form-item>
          <el-form-item>
            <el-button @click="handleHjxxQuery">
              <Icon icon="ep:search" class="mr-1" />
              查询
            </el-button>
            <el-button @click="resetHjxxQuery">
              <Icon icon="ep:refresh" class="mr-1" />
              重置
            </el-button>
          </el-form-item>
        </el-form>
        <div class="flex gap-2">
          <el-button type="primary" @click="handleSaveHjxx(false)" :disabled="selectedHjxx.length === 0">确定标记</el-button>
          <el-button type="danger" @click="handleSaveHjxx(true)" :disabled="selectedHjxx.length === 0">取消标记</el-button>
        </div>
      </div>
      <el-table
        ref="hjxxTableRef"
        :data="hjxxList"
        :show-overflow-tooltip="true"
        :stripe="true"
        v-loading="hjxxLoading"
        height="500"
        @selection-change="handleSelectionChange"
        size="small"
      >
        <el-table-column type="selection" width="55" />
        <el-table-column align="center" label="登记序号" prop="djxh" />
        <el-table-column align="center" label="社会信用代码" prop="shxydm" />
        <el-table-column align="center" label="纳税人名称" prop="nsrmc" />
        <el-table-column align="center" label="标签状态" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.bqId ? 'success' : 'info'">
              {{ scope.row.bqId ? '已标记' : '未标记' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <div class="mt-4 flex justify-end">
        <el-pagination
          v-model:current-page="hjxxQueryParams.pageNo"
          v-model:page-size="hjxxQueryParams.pageSize"
          :total="hjxxTotal"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="getHjxxList"
          @current-change="getHjxxList"
        />
      </div>
    </el-dialog>
  </ContentWrap>
</template>

<script setup lang="ts">
import {onMounted, reactive, ref} from 'vue'
import {BqglApi, BqglHjxxRespVO, BqglRespVO} from '@/api/lghjft/hjgl/bqgl'
import {ElMessage, ElMessageBox, ElTable} from 'element-plus'
import {formatDate} from '@/utils/formatTime'

defineOptions({ name: 'Bqgl' })

const loading = ref(true)
const list = ref<BqglRespVO[]>([])
const total = ref(0)
const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formRef = ref()

const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  bqMc: ''
})

const formData = reactive({
  id: '',
  bqMc: ''
})

const formRules = {
  bqMc: [{required: true, message: '请输入标签名称', trigger: 'blur'}]
}

// 户籍信息相关
const hjxxDialogVisible = ref(false)
const hjxxLoading = ref(false)
const hjxxList = ref<BqglHjxxRespVO[]>([])
const hjxxTotal = ref(0)
const hjxxTableRef = ref<InstanceType<typeof ElTable>>()
const selectedHjxx = ref<BqglHjxxRespVO[]>([])
const hjxxQueryParams = reactive({
  pageNo: 1,
  pageSize: 50,
  bqId: '',
  nsrmc: ''
})

const getList = async () => {
  loading.value = true
  try {
    const data = await BqglApi.listBqdm(queryParams)
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
  queryParams.bqMc = ''
  handleQuery()
}

const handleAdd = () => {
  dialogTitle.value = '新增标签'
  formData.id = ''
  formData.bqMc = ''
  dialogVisible.value = true
}

const handleEdit = (row: BqglRespVO) => {
  dialogTitle.value = '修改标签'
  formData.id = row.id
  formData.bqMc = row.bqMc
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('是否确认删除该标签？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await BqglApi.deleteBqdm(id)
    ElMessage.success('删除成功')
    await getList()
  } catch {}
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    formLoading.value = true
    try {
      if (formData.id) {
        await BqglApi.updateBqdm(formData)
        ElMessage.success('修改成功')
      } else {
        await BqglApi.createBqdm(formData)
        ElMessage.success('新增成功')
      }
      dialogVisible.value = false
      await getList()
    } finally {
      formLoading.value = false
    }
  })
}

// 户籍信息逻辑
const getHjxxList = async () => {
  hjxxLoading.value = true
  try {
    const data = await BqglApi.listHjxx(hjxxQueryParams)
    hjxxList.value = data.list
    hjxxTotal.value = data.total
  } finally {
    hjxxLoading.value = false
  }
}

const handleHjxx = (row: BqglRespVO) => {
  hjxxQueryParams.bqId = row.id
  hjxxQueryParams.pageNo = 1
  selectedHjxx.value = [] 
  hjxxDialogVisible.value = true
  getHjxxList()
}

const handleSelectionChange = (selection: BqglHjxxRespVO[]) => {
  selectedHjxx.value = selection
}

const handleHjxxQuery = () => {
  hjxxQueryParams.pageNo = 1
  getHjxxList()
}

const resetHjxxQuery = () => {
  hjxxQueryParams.nsrmc = ''
  handleHjxxQuery()
}

const handleSaveHjxx = async (isDelete: boolean) => {
  if (selectedHjxx.value.length === 0) return
  try {
    await BqglApi.saveHjxx({
      bqDm: hjxxQueryParams.bqId,
      djxhList: selectedHjxx.value.map(item => item.djxh),
      deleted: isDelete
    })
    ElMessage.success(isDelete ? '取消标记成功' : '标记成功')
    getHjxxList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
