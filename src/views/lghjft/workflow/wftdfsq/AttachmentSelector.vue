<!-- src/views/bpm/union-refund/components/AttachmentSelector.vue -->
<template>
  <div class="attachment-selector">
    <el-row :gutter="24">
      <el-col :span="8" v-for="item in attachmentItems" :key="item.key">
        <div class="attachment-card" @click="triggerUpload(item.key)">
          <div class="preview-container">
            <!-- 优先用 fileUrl 预览（回显或上传后） -->
            <img v-if="isImageUrl(item.fileUrl)" :src="item.fileUrl" alt="预览" class="preview-img" />
            <!-- 上传过程中用本地 previewUrl -->
            <img v-else-if="item.previewUrl" :src="item.previewUrl" alt="预览" class="preview-img" />
            <!-- 无图时显示图标 -->
            <div v-else class="icon">
              <el-icon>
                <Upload />
              </el-icon>
            </div>
          </div>

          <div class="label">{{ item.label }}</div>
          <div v-if="item.fileName" class="filename">{{ item.fileName }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 隐藏的文件输入 -->
    <input ref="fileInput" type="file" style="display: none" accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls,.doc,.docx"
      @change="handleFileChange" />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Upload } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

import { updateFile, createFile } from '@/api/infra/file'
import { log } from 'node:console'
// 存储 fileUrl（字符串）
interface AttachmentItem {
  key: string
  label: string
  fileUrl: string       // ✅ 文件完整 URL
  fileName: string
  previewUrl: string    // 上传过程中的本地预览
}

const props = defineProps<{
  modelValue: { type: string; fileUrl: string }[] // ✅ 改为 fileUrl
}>()
const emit = defineEmits<{
  (e: 'update:modelValue', value: { type: string; fileUrl: string }[]): void
}>()

// 固定三类附件
const attachmentItems = ref<AttachmentItem[]>([
  { key: 'voucher', label: '已缴纳工会经费有效凭证复印件', fileUrl: '', fileName: '', previewUrl: '' },
  { key: 'payroll', label: '对应属期工资表', fileUrl: '', fileName: '', previewUrl: '' },
  { key: 'license', label: '开户许可证复印件', fileUrl: '', fileName: '', previewUrl: '' }
])

const currentUploadType = ref<string | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)

// 同步外部值（回显）
watch(
  () => props.modelValue,
  (newVal) => {
    newVal.forEach((att) => {
      const item = attachmentItems.value.find(i => i.key === att.type)
      if (item) {
        item.fileUrl = att.fileUrl
        item.fileName = getFileNameFromUrl(att.fileUrl)
        // previewUrl 可选，回显时可不用
      }
    })
  },
  { immediate: true }
)

// 同步内部值到父组件
watch(attachmentItems, () => {
  const list = attachmentItems.value
    .filter(i => i.fileUrl.trim() !== '')
    .map(i => ({ type: i.key, fileUrl: i.fileUrl }))
  emit('update:modelValue', list)
}, { deep: true })

const triggerUpload = (type: string) => {
  currentUploadType.value = type
  fileInput.value?.click()
}

const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (!file || !currentUploadType.value) return

  try {
    // 1. 生成本地预览（仅图片）
    if (file.type.startsWith('image/')) {
      const localPreview = URL.createObjectURL(file)
      const item = attachmentItems.value.find(i => i.key === currentUploadType.value)
      if (item) {
        item.previewUrl = localPreview
      }
    }

    // 2. 上传文件 → 调用 /upload 接口
    const formData = new FormData()
    formData.append('file', file)
    const res = await updateFile(formData) // 返回 { code: 0, data: "http://..." }
    console.log(res);

    // 3. ✅ 拿到文件 URL
    const fileUrl = res.data // 字符串

    // 4. 更新对应项
    const item = attachmentItems.value.find(i => i.key === currentUploadType.value)
    if (item) {
      item.fileUrl = fileUrl
      item.fileName = file.name
      item.previewUrl = '' // 清掉本地预览，用真实 URL
    }

    ElMessage.success(`${file.name} 上传成功！`)

  } catch (error) {
    console.error('上传失败', error)
    ElMessage.error('文件上传失败，请重试')
  } finally {
    target.value = ''
    currentUploadType.value = null
  }
}

// 工具函数
function getFileNameFromUrl(url: string): string {
  try {
    return url.split('/').pop() || ''
  } catch {
    return ''
  }
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(url)
}
</script>

<style scoped>
.attachment-selector {
  padding: 16px;
  background-color: #f5f7fa;
  border-radius: 8px;
}

.attachment-card {
  height: 180px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  text-align: center;
  padding: 12px;
}

.attachment-card:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.preview-container {
  width: 100%;
  height: 100%;
  margin-bottom: 8px;
  position: relative;
  overflow: hidden;
  border-radius: 4px;
  background-color: #f0f0f0;
}

.preview-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 4px;
}

.icon {
  font-size: 24px;
  color: #909399;
  margin-bottom: 8px;
}

.label {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.filename {
  font-size: 12px;
  color: #606266;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>