<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="版本号" prop="version">
            <el-input v-model="formData.version" placeholder="请输入版本号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="内容" prop="content">
        <Editor v-model="formData.content" height="250px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button :loading="formLoading" type="primary" @click="submitForm">确 定</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { defineEmits, defineExpose, ref } from 'vue'
import { BbfbVO, createBbfb, getBbfb, updateBbfb } from '@/api/lghjft/nrgl/bbfb'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor/src/Editor.vue'

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formRef = ref()

const formData = ref<BbfbVO>({
  id: undefined,
  version: '',
  title: '',
  content: '',
  status: 0
})

const formRules = {
  version: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  content: [{ required: true, message: '内容不能为空', trigger: 'blur' }]
}

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增版本发布' : '修改版本发布'
  formLoading.value = true
  resetForm()
  if (id) {
    try {
      const res = await getBbfb(id)
      formData.value = res
    } finally {
      formLoading.value = false
    }
  } else {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    version: '',
    title: '',
    content: '',
    status: 0
  }
  formRef.value?.resetFields()
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value
    if (data.id) {
      await updateBbfb(data)
      ElMessage.success('修改成功')
    } else {
      await createBbfb(data)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const emit = defineEmits(['success'])
defineExpose({ open })
</script>
