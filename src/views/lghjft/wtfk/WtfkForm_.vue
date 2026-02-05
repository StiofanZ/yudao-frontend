<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="top"
      v-loading="formLoading"
      style="padding: 0 20px;"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="反馈类型" prop="type">
            <el-radio-group v-model="formData.type" style="width: 100%;">
              <el-row :gutter="10" style="width: 100%;">
                <el-col :span="6">
                  <el-radio label="1" border style="width: 100%; margin-right: 0;">功能建议</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="2" border style="width: 100%; margin-right: 0;">操作问题</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="3" border style="width: 100%; margin-right: 0;">系统问题</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="4" border style="width: 100%; margin-right: 0;">其他问题</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="formData.contactPhone"
              placeholder="请输入联系电话"
              style="width: 280px"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="反馈内容" prop="content">
            <Editor v-model="formData.content" height="200px" />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="附件上传">
            <el-upload
              v-model:file-list="fileList"
              :action="uploadUrl"
              :headers="uploadHeaders"
              :data="{ tableName: 'lghjft_wtfk' }"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              :on-exceed="handleExceed"
              :before-upload="beforeUpload"
              :limit="3"
              multiple
            >
              <el-button type="primary">
                <Icon icon="ep:upload" class="mr-1" /> 点击上传
              </el-button>
              <template #tip>
                <div class="el-upload__tip">单个文件不超过 10MB</div>
              </template>
            </el-upload>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { WtfkApi, type WtfkVO, type FileItem } from '@/api/lghjft/wtfk'
import { getAccessToken } from '@/utils/auth'
import type { UploadUserFile, UploadProps, UploadFile } from 'element-plus'

defineOptions({ name: 'WtfkForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')

const formData = ref<Partial<WtfkVO>>({
  id: undefined,
  type: undefined,
  content: undefined,
  platformName: undefined,
  contactPhone: undefined,
  contactEmail: undefined,
  status: 0,
  processorId: undefined,
  processTime: undefined,
  files: []
})

// ================== 上传相关逻辑 ==================
const uploadUrl = import.meta.env.VITE_BASE_URL + '/admin-api/infra/file/upload'
const uploadHeaders = ref({ Authorization: 'Bearer ' + getAccessToken() })
const fileList = ref<UploadUserFile[]>([])

const handleUploadSuccess = (response: any, uploadFile: UploadFile) => {
  if (response.code !== 0) {
    message.error('上传失败：' + response.msg)
    return
  }
  if (response.data) {
    // 构造 FileItem 对象
    const fileItem: FileItem = {
      fileUrl: response.data,
      fileName: uploadFile.name
    }

    if (!formData.value.files) {
      formData.value.files = []
    }
    formData.value.files.push(fileItem)
    message.success('上传成功！')
  }
}

const handleRemove = (uploadFile: UploadFile) => {
  // 兼容两种情况：新上传的文件(response.data) 和 回显的文件(url)
  const fileUrl = uploadFile.response?.data || uploadFile.url

  if (fileUrl && formData.value.files) {
    const index = formData.value.files.findIndex(item => item.fileUrl === fileUrl)
    if (index > -1) {
      formData.value.files.splice(index, 1)
    }
  }
}

const beforeUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.size / 1024 / 1024 > 10) {
    message.error('文件大小不能超过 10MB!')
    return false
  }
  return true
}

const handleExceed = () => {
  message.error('最多只能上传 3 个文件！')
}
//=====================

const formRules = reactive({
  type: [{ required: true, message: '反馈类型不能为空', trigger: 'change' }],
  content: [{ required: true, message: '反馈内容不能为空', trigger: 'blur' }],
  contactPhone: [
    {
      pattern: /^1[3-9]\d{9}$/,
      message: '请输入正确的手机号码',
      trigger: 'blur'
    }
  ]
})
const formRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()

  if (id) {
    formLoading.value = true
    try {
      const data = await WtfkApi.getWtfk(id)
      formData.value = data

      // 4. Edit Mode：数据清洗，将后端 files 映射回 Element UI 的 fileList
      if (data.files && data.files.length > 0) {
        fileList.value = data.files.map(item => ({
          name: item.fileName,
          url: item.fileUrl
        }))
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

/** 提交表单 */
const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    formData.value.platformName = '网页端'

    if (formType.value === 'create') {
      formData.value.status = 1
    }

    const data = formData.value as unknown as WtfkVO
    if (formType.value === 'create') {
      await WtfkApi.createWtfk(data)
      message.success(t('common.createSuccess'))
    } else {
      await WtfkApi.updateWtfk(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  fileList.value = []
  formData.value = {
    id: undefined,
    userId: undefined,
    userName: undefined,
    type: undefined,
    content: undefined,
    contactPhone: undefined,
    contactEmail: undefined,
    status: 1,
    processorId: undefined,
    processTime: undefined,
    processNotes: undefined,
    platformName: '网页端',
    files: [] // 重置为空数组
  }
  formRef.value?.resetFields()
}
</script>
