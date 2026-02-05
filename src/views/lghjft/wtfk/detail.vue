<template>
  <ContentWrap>
    <div class="flex justify-between items-center mb-20px">
      <el-button @click="goBack">
        <Icon icon="ep:arrow-left" class="mr-5px" /> 返回列表
      </el-button>
      <el-tag :type="statusMap[formData.status ?? 1]?.type">
        {{ statusMap[formData.status ?? 1]?.label || '未知状态' }}
      </el-tag>
    </div>

    <div class="bg-gray-50 p-20px mb-20px rounded-8px">
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step
          title="提交反馈"
          :description="formData.createTime ? formatDate(formData.createTime as any) : ''"
        />
        <el-step title="管理员受理" />
        <el-step title="处理完成" />
        <el-step title="已关闭" />
      </el-steps>
    </div>

    <el-row :gutter="20">
      <el-col :span="16">
        <el-card shadow="never" header="反馈内容">
          <el-descriptions :column="2" border>
            <el-descriptions-item label="反馈单号">{{ formData.feedbackId }}</el-descriptions-item>
            <el-descriptions-item label="反馈类型">
              <el-tag v-if="formData.type === '1'">功能建议</el-tag>
              <el-tag v-else-if="formData.type === '2'" type="success">操作问题</el-tag>
              <el-tag v-else-if="formData.type === '3'" type="warning">系统问题</el-tag>
              <el-tag v-else-if="formData.type === '4'" type="danger">其他问题</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="联系电话">{{ formData.contactPhone || '-' }}</el-descriptions-item>
            <el-descriptions-item label="提交平台">{{ formData.platformName || '-' }}</el-descriptions-item>
            <el-descriptions-item label="反馈内容" :span="2">
              <div v-html="formData.content" class="editor-content"></div>
            </el-descriptions-item>

            <el-descriptions-item label="附件" :span="2">
              <div v-if="formData.files && formData.files.length > 0" class="flex flex-wrap gap-10px">
                <template v-for="(item, index) in formData.files" :key="index">
                  <el-image
                    v-if="isImage(item.fileUrl, item.fileName)"
                    style="width: 80px; height: 80px; border-radius: 4px; border: 1px solid #eee"
                    :src="item.fileUrl"
                    :preview-src-list="formData.files.filter(f => isImage(f.fileUrl, f.fileName)).map(f => f.fileUrl)"
                    :initial-index="formData.files.filter(f => isImage(f.fileUrl, f.fileName)).indexOf(item)"
                    fit="cover"
                    preview-teleported
                  />

                  <el-link
                    v-else
                    type="primary"
                    :underline="false"
                    @click="downloadFile(item.fileUrl)"
                    class="file-link-item"
                  >
                    <div class="flex items-center p-5px border-1 border-blue-200 rounded bg-blue-50">
                      <Icon icon="ep:document" class="mr-5px" />
                      <span class="text-12px">{{ item.fileName || getFileName(item.fileUrl) }}</span>
                    </div>
                  </el-link>
                </template>
              </div>
              <span v-else class="text-gray-400">无附件</span>
            </el-descriptions-item>
          </el-descriptions>
        </el-card>

        <el-card v-if="formData.status !== 0" shadow="never" header="处理回复" class="mt-20px">
          <div class="p-10px bg-blue-50 rounded-4px">
            <p class="text-14px text-gray-600 mb-10px">
              <strong>处理人：</strong>{{ formData.processorName || '管理员' }}
              <span><strong>处理时间：</strong>{{ formatDate(formData.processTime as any) }}</span>
            </p>
            <div class="text-15px leading-24px">
              <strong>处理备注：</strong>
              <div class="mt-5px text-gray-800">{{ formData.processNotes || '无备注' }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :span="8">
        <el-card shadow="never" header="处理历史">
          <el-timeline>
            <el-timeline-item
              v-for="(log, index) in logList"
              :key="index"
              :timestamp="formatDate(log.createTime as any)"
              :type="log.status === 1 ? 'success' : 'primary'"
            >
              <p class="font-bold">{{ statusMap[log.status]?.label }}</p>
              <p class="text-12px text-gray-500">操作人：{{ log.operatorName || '系统' }}</p>
              <p v-if="log.content" class="text-13px mt-5px text-gray-600 italic">"{{ log.content }}"</p>
            </el-timeline-item>
          </el-timeline>
          <el-empty v-if="logList.length === 0" description="暂无处理记录" />
        </el-card>
      </el-col>
    </el-row>
  </ContentWrap>
</template>

<script setup lang="ts">
import { WtfkApi, WtfkVO } from '@/api/lghjft/wtfk'
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'WtfkDetail' })

interface WtfkLog {
  id?: number
  content: string
  operatorId: number
  operatorName?: string
  status: number
  createTime?: string | Date
}

// 新增文件接口
interface FileItem {
  fileUrl: string
  fileName: string
  fileOriginName?: string
}

const { query } = useRoute()
const { back } = useRouter()
const loading = ref(false)
const logList = ref<WtfkLog[]>([])

// 更新 formData 类型和初始值
const formData = ref<WtfkVO & { files?: FileItem[] }>({
  id: 0,
  feedbackId: '',
  type: '1',
  content: '',
  files: [], // 初始化为空数组
  contactPhone: '',
  platformName: '',
  status: 1,
  createTime: '',
  processNotes: '',
  processTime: '',
  contactEmail: '',
  processorId: 0,
  processorName: ''
})

const statusMap: any = {
  0: { label: '待处理', type: 'info', step: 1 },
  1: { label: '待处理', type: 'info', step: 1 },
  2: { label: '跟进中', type: 'warning', step: 2 },
  3: { label: '已处理', type: 'success', step: 4},
  4: { label: '已关闭', type: 'danger', step: 4 }
}

const activeStep = computed(() => {
  const status = formData.value.status ?? 1
  return statusMap[status]?.step || 1
})

const getDetail = async () => {
  const id = Number(query.id)
  if (!id) return
  loading.value = true
  try {
    const [detail, logs] = await Promise.all([
      WtfkApi.getWtfk(id),
      WtfkApi.getWtfkLogList(id)
    ])
    if (detail) {
      detail.status = (detail.status === null || detail.status === undefined) ? 1 : Number(detail.status)
    }
    formData.value = detail
    logList.value = logs || []
  } finally {
    loading.value = false
  }
}

/** 修改后的 isImage：优先检测 name */
const isImage = (url: string, name?: string) => {
  const target = name || url
  if (!target) return false

  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
  const cleanStr = target.split('?')[0]
  const ext = cleanStr.split('.').pop()?.toLowerCase() || ''

  return imageExtensions.includes(ext)
}

const getFileName = (url: string) => {
  return url ? url.substring(url.lastIndexOf('/') + 1) : 'unknown'
}

const downloadFile = (url: string) => {
  window.open(url, '_blank')
}

const goBack = () => {
  back()
}

onMounted(() => {
  getDetail()
})
</script>

<style scoped>
.editor-content :deep(img) {
  max-width: 100%;
  height: auto;
}
.bg-gray-50 { background-color: #f9fafb; }
.bg-blue-50 { background-color: #f0f7ff; }

.file-link-item {
  transition: all 0.3s;
}
.file-link-item:hover {
  transform: translateY(-2px);
  opacity: 0.8;
}
.gap-10px {
  display: flex;
  gap: 10px;
}
</style>
