<template>
  <ContentWrap>
    <div class="mb-4 font-bold text-lg">标签代码管理</div>
    
    <el-table :data="list" :show-overflow-tooltip="true" :stripe="true" v-loading="loading">
      <el-table-column align="center" label="标签代码" prop="bqDm" />
      <el-table-column align="center" label="标签名称" prop="bqMc" />
      <el-table-column align="center" label="部门名称" prop="deptMc" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.bqDm)"
            :disabled="scope.row.level === 1"
          >
            作废
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="mt-4 flex justify-center">
      <el-button type="primary" @click="handleAdd">新增</el-button>
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
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { BqglApi, BqglRespVO } from '@/api/lghjft/hj/bqgl'
import { ElMessage, ElMessageBox } from 'element-plus'

defineOptions({ name: 'Bqgl' })

const loading = ref(true)
const list = ref<BqglRespVO[]>([])
const dialogVisible = ref(false)
const formLoading = ref(false)
const formRef = ref()

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
