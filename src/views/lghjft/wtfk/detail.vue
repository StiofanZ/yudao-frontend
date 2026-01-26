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
              <div v-if="formData.fileUrls && formData.fileUrls.length > 0" class="flex flex-wrap gap-10px">
                <template v-for="(url, index) in formData.fileUrls" :key="index">
                  <el-image
                    v-if="isImage(url)"
                    style="width: 80px; height: 80px; border-radius: 4px; border: 1px solid #eee"
                    :src="url"
                    :preview-src-list="formData.fileUrls.filter(u => isImage(u))"
                    :initial-index="formData.fileUrls.filter(u => isImage(u)).indexOf(url)"
                    fit="cover"
                    preview-teleported
                  />

                  <el-link
                    v-else
                    type="primary"
                    :underline="false"
                    @click="downloadFile(url)"
                    class="file-link-item"
                  >
                    <div class="flex items-center p-5px border-1 border-blue-200 rounded bg-blue-50">
                      <Icon icon="ep:document" class="mr-5px" />
                      <span class="text-12px">{{ getFileName(url) }}</span>
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
import { WtfkApi, WtfkVO } from '@/api/lghjft/wtfk' // 确保引入了 WtfkVO
import { useRoute, useRouter } from 'vue-router'
import { formatDate } from '@/utils/formatTime'

defineOptions({ name: 'WtfkDetail' })
interface WtfkLog {
  id?: number
  content: string
  operatorId: number
  operatorName?: string  // 必须加上这一行，解决“未解析”报错
  status: number
  createTime?: string | Date
}

const { query } = useRoute()
const { back } = useRouter()
const loading = ref(false)
const logList = ref<WtfkLog[]>([])

// 并初始化所有模板用到的变量
const formData = ref<WtfkVO>({
  id: 0,
  feedbackId: '',
  type: '1',
  content: '',
  fileUrls: [], //上传文件Url
  contactPhone: '',
  platformName: '', // 初始化字段，解决“未解析”错误
  status: 1,
  createTime: '',   // 初始化字段
  processNotes: '',
  processTime: '',
  contactEmail: '',
  processorId: 0,
  processorName: ''
})

// 状态与进度条映射关系
const statusMap: any = {
  0: { label: '待处理', type: 'info', step: 1 },//兼容
  1: { label: '待处理', type: 'info', step: 1 },
  2: { label: '跟进中', type: 'warning', step: 2 },
  3: { label: '已处理', type: 'success', step: 4}, //3->4 暂时不实现已关闭逻辑
  4: { label: '已关闭', type: 'danger', step: 4 }
}

const activeStep = computed(() => {
  // 显式提取 status，若为空则默认为 1
  const status = formData.value.status ?? 1
  return statusMap[status]?.step || 1
})

/** 获取详情及日志 */
const getDetail = async () => {
  const id = Number(query.id)
  if (!id) return
  loading.value = true
  try {
    const [detail, logs] = await Promise.all([
      WtfkApi.getWtfk(id),
      WtfkApi.getWtfkLogList(id)
    ])
    // 强制转换类型，确保 statusMap 能读取到 Key
    if (detail) {
      detail.status = (detail.status === null || detail.status === undefined) ? 1 : Number(detail.status)
    }
    formData.value = detail
    logList.value = logs || []
  } finally {
    loading.value = false
  }
}
/** 判断是否为图片 */
const isImage = (url: string) => {
  const imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'bmp']
  const ext = url.split('.').pop()?.toLowerCase() || ''
  return imageExtensions.includes(ext)
}

/** 获取文件名 */
const getFileName = (url: string) => {
  return url.substring(url.lastIndexOf('/') + 1)
}

/** 下载/打开文件 */
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
