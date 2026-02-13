<!-- src/views/bpm/union-refund/components/AttachmentSelector.vue -->
<template>
  <div class="attachment-selector">
    <el-row :gutter="24">
      <el-col :span="8" v-for="item in attachmentItems" :key="item.key">
        <div class="attachment-card">
          <div class="preview-container">
            <!-- 图片预览 -->
            <img v-if="isImageUrl(item.fileUrl)" :src="getFullImageUrl(item.fileUrl)" alt="预览" class="preview-img" />
            <!-- 上传过程中的本地预览 -->
            <img v-else-if="item.previewUrl" :src="item.previewUrl" alt="预览" class="preview-img" />
            <!-- 非图片文件显示文件类型背景 -->
            <div v-else-if="item.fileUrl" class="file-preview" :class="getFileBackgroundClass(item.fileUrl)">
              <div class="file-preview-content">
                <span class="file-type-badge-large">{{ getFileExtension(item.fileUrl) }}</span>
                <span class="file-name-preview">{{ getFileNameShort(item.fileName) }}</span>
              </div>
            </div>
            <!-- 无图时显示上传图标 -->
            <div v-else class="icon" @click="triggerUpload(item.key)">
              <el-icon>
                <Upload />
              </el-icon>
            </div>

            <!-- 删除按钮 - 右上角，有文件时显示 -->
            <el-icon v-if="item.fileUrl" class="delete-btn" @click.stop="handleDelete(item.key)">
              <Close />
            </el-icon>
          </div>

          <div class="label">{{ item.label }}</div>
          <div v-if="item.fileName" class="filename" @click="handlePreview(item)">{{ item.fileName }}</div>
          <div v-else class="upload-tip" @click="triggerUpload(item.key)">点击上传</div>
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
import { Upload, Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { updateFile } from '@/api/infra/file'

// 导入环境配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''

interface AttachmentItem {
  key: string
  label: string
  fileUrl: string
  fileName: string
  previewUrl: string
}

const props = defineProps<{
  modelValue: { type: string; fileUrl: string }[]
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
      if (item && att.fileUrl) {
        item.fileUrl = att.fileUrl
        item.fileName = getFileNameFromUrl(att.fileUrl)
      }
    })
  },
  { immediate: true }
)

// 同步内部值到父组件
watch(attachmentItems, () => {
  const list = attachmentItems.value
    .filter(i => i.fileUrl && i.fileUrl.trim() !== '')
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
    // 生成本地预览（仅图片）
    if (file.type.startsWith('image/')) {
      const localPreview = URL.createObjectURL(file)
      const item = attachmentItems.value.find(i => i.key === currentUploadType.value)
      if (item) {
        item.previewUrl = localPreview
      }
    }

    // 上传文件
    const formData = new FormData()
    formData.append('file', file)
    const res = await updateFile(formData)
    const fileUrl = res.data

    // 更新对应项
    const item = attachmentItems.value.find(i => i.key === currentUploadType.value)
    if (item) {
      item.fileUrl = fileUrl
      item.fileName = file.name
      item.previewUrl = ''
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

// 删除文件
const handleDelete = (key: string) => {
  const item = attachmentItems.value.find(i => i.key === key)
  if (item) {
    item.fileUrl = ''
    item.fileName = ''
    item.previewUrl = ''
    ElMessage.success('删除成功')
  }
}

// 预览文件
const handlePreview = (item: AttachmentItem) => {
  if (!item.fileUrl) return
  window.open(getFullImageUrl(item.fileUrl), '_blank')
}

// 获取完整的URL
const getFullImageUrl = (url: string): string => {
  if (!url) return ''
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }
  const cleanUrl = url.startsWith('/') ? url.slice(1) : url
  return `${API_BASE_URL}/${cleanUrl}`
}

// 获取文件扩展名
const getFileExtension = (url: string): string => {
  if (!url) return ''
  const cleanUrl = url.split('?')[0]
  const match = cleanUrl.match(/\.([^./]+)$/)
  return match ? match[1].toUpperCase() : 'FILE'
}

// 获取文件类型背景类名
const getFileBackgroundClass = (url: string): string => {
  const ext = getFileExtension(url).toLowerCase()
  if (['pdf'].includes(ext)) return 'file-bg-pdf'
  if (['doc', 'docx'].includes(ext)) return 'file-bg-word'
  if (['xls', 'xlsx', 'csv'].includes(ext)) return 'file-bg-excel'
  if (['ppt', 'pptx'].includes(ext)) return 'file-bg-ppt'
  if (['txt', 'md'].includes(ext)) return 'file-bg-txt'
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) return 'file-bg-zip'
  return 'file-bg-default'
}

// 缩短文件名显示
const getFileNameShort = (fileName: string): string => {
  if (!fileName) return ''
  if (fileName.length > 15) {
    return fileName.substring(0, 10) + '...' + fileName.substring(fileName.length - 5)
  }
  return fileName
}

// 工具函数
function getFileNameFromUrl(url: string): string {
  if (!url) return ''
  try {
    const urlWithoutQuery = url.split('?')[0]
    const fileName = urlWithoutQuery.split('/').pop() || ''
    return decodeURIComponent(fileName)
  } catch {
    return ''
  }
}

function isImageUrl(url: string): boolean {
  return /\.(jpg|jpeg|png|gif|bmp|webp|svg|ico)$/i.test(url.split('?')[0])
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
  cursor: default;
  transition: all 0.3s;
  text-align: center;
  padding: 12px;
  position: relative;
}

.attachment-card:hover {
  border-color: #409eff;
  background-color: #ecf5ff;
}

.preview-container {
  width: 100%;
  height: 100px;
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
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: #909399;
  cursor: pointer;
}

/* 文件预览背景 */
.file-preview {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
}

.file-preview-content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 8px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.file-type-badge-large {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
  background: rgba(255, 255, 255, 0.2);
  padding: 2px 8px;
  border-radius: 4px;
  letter-spacing: 2px;
}

.file-name-preview {
  font-size: 10px;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.3);
  padding: 2px 6px;
  border-radius: 12px;
}

/* 删除按钮 */
.delete-btn {
  position: absolute;
  top: 4px;
  right: 4px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  opacity: 0;
  transition: opacity 0.2s, transform 0.2s;
  font-size: 14px;
}

.delete-btn:hover {
  background: rgba(245, 108, 108, 0.9);
  transform: scale(1.1);
}

.preview-container:hover .delete-btn {
  opacity: 1;
}

/* 文件类型背景色 */
.file-bg-pdf {
  background: linear-gradient(145deg, #ff6b6b 0%, #ee5253 100%);
}

.file-bg-word {
  background: linear-gradient(145deg, #54a0ff 0%, #2e86de 100%);
}

.file-bg-excel {
  background: linear-gradient(145deg, #78e08f 0%, #38ada9 100%);
}

.file-bg-ppt {
  background: linear-gradient(145deg, #f6b93b 0%, #e58e26 100%);
}

.file-bg-txt {
  background: linear-gradient(145deg, #8395a7 0%, #576574 100%);
}

.file-bg-zip {
  background: linear-gradient(145deg, #c56cf0 0%, #5f27cd 100%);
}

.file-bg-default {
  background: linear-gradient(145deg, #00d2d3 0%, #01a3a4 100%);
}

.label {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.filename {
  font-size: 12px;
  color: #409eff;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  padding: 0 4px;
}

.filename:hover {
  text-decoration: underline;
}

.upload-tip {
  font-size: 12px;
  color: #909399;
  cursor: pointer;
  padding: 2px 8px;
}

.upload-tip:hover {
  color: #409eff;
}
</style>