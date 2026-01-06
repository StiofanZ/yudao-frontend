<template>
  <ContentWrap>
    <el-table :data="list" :show-overflow-tooltip="true" :stripe="true" v-loading="loading">
      <el-table-column align="center" label="标签代码" prop="bqDm" />
      <el-table-column align="center" label="标签名称" prop="bqMc" />
      <el-table-column align="center" label="部门名称" prop="deptMc" />
      <el-table-column align="center" label="操作" width="200">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="handleHjxx(scope.row.bqDm)"
          >
            户籍信息
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.bqDm)"
            :disabled="scope.row.level !== 1"
          >
            作废
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 flex justify-center">
      <el-button type="primary" @click="handleAdd">新增标签</el-button>
    </div>

    <!-- 新增标签弹窗 -->
    <el-dialog v-model="dialogVisible" title="新增标签" width="500px">
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
          <el-form-item label="信用代码">
            <el-input
              v-model="hjxxQueryParams.shxydm"
              placeholder="请输入社会信用代码"
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
        <el-table-column align="center" label="标签名称" prop="bqMc" />
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
      <template #footer>
      </template>
    </el-dialog>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick } from 'vue'
import { BqglApi, BqglRespVO, BqglHjxxRespVO } from '@/api/lghjft/hj/bqgl'
import { ElMessage, ElMessageBox, ElTable } from 'element-plus'

defineOptions({ name: 'Bqgl' })

const loading = ref(true)
const list = ref<BqglRespVO[]>([])
const dialogVisible = ref(false)
const formLoading = ref(false)
const formRef = ref()

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
  bqDm: '',
  shxydm: ''
})

const formData = reactive({
  bqMc: ''
})

const formRules = {
  bqMc: [{ required: true, message: '请输入标签名称', trigger: 'blur' }]
}

const getList = async () => {
  loading.value = true
  try {
    const data = await BqglApi.getBqxx()
    list.value = data
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  formData.bqMc = ''
  dialogVisible.value = true
}

const handleDelete = async (id: string) => {
  try {
    await ElMessageBox.confirm('是否确认作废该标签？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await BqglApi.deleteBqxx(id)
    ElMessage.success('作废成功')
    await getList()
  } catch {}
}

const getHjxxList = async () => {
  hjxxLoading.value = true
  try {
    const data = await BqglApi.getHjxx(hjxxQueryParams)
    hjxxList.value = data.list
    hjxxTotal.value = data.total
    
    // 设置选中状态
    nextTick(() => {
      hjxxList.value.forEach(row => {
        if (row.bqDm) {
          hjxxTableRef.value?.toggleRowSelection(row, true)
        }
      })
    })
  } finally {
    hjxxLoading.value = false
  }
}

const handleHjxx = (bqDm: string) => {
  hjxxQueryParams.bqDm = bqDm
  hjxxQueryParams.pageNo = 1
  selectedHjxx.value = [] // 重置选中
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
  hjxxQueryParams.shxydm = ''
  handleHjxxQuery()
}

const handleSaveHjxx = async (isDelete: boolean) => {
  if (selectedHjxx.value.length === 0) return
  
  try {
    await BqglApi.saveHjxx({
      bqDm: hjxxQueryParams.bqDm,
      djxhList: selectedHjxx.value.map(item => item.djxh),
      deleted: isDelete
    })
    ElMessage.success(isDelete ? '取消标记成功' : '标记成功')
    getHjxxList() // 刷新列表
  } catch {}
}

const submitForm = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    formLoading.value = true
    try {
      await BqglApi.createBqxx({ bqMc: formData.bqMc })
      ElMessage.success('新增成功')
      dialogVisible.value = false
      await getList()
    } finally {
      formLoading.value = false
    }
  })
}

onMounted(() => {
  getList()
})
</script>
