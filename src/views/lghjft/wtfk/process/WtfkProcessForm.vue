<template>
  <Dialog title="问题处理" v-model="dialogVisible" width="800px">
    <el-row :gutter="20">
      <el-col :span="10">
        <el-descriptions border :column="1">
          <el-descriptions-item label="单号">{{ formData?.feedbackId }}</el-descriptions-item>
          <el-descriptions-item label="用户ID">{{ formData?.userId }}</el-descriptions-item>
          <el-descriptions-item label="用户名">{{ formData?.userName }}</el-descriptions-item>
          <el-descriptions-item label="联系电话">
            <span v-if="formData.contactPhone">{{ formData.contactPhone }}</span>
            <span v-else style="color: #999; font-style: italic;">用户未输入电话</span>
          </el-descriptions-item>
          <el-descriptions-item label="反馈类型">
            <el-tag v-if="formData?.type === '1'">功能建议</el-tag>
            <el-tag v-else-if="formData?.type === '2'" type="success">操作问题</el-tag>
            <el-tag v-else-if="formData?.type === '3'" type="warning">系统问题</el-tag>
            <el-tag v-else-if="formData?.type === '4'" type="danger">其他问题</el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="平台名称">{{ formData?.platformName || '-' }}</el-descriptions-item>
          <el-descriptions-item label="描述">
            <div v-html="formData?.content" class="editor-content"></div>
          </el-descriptions-item>
        </el-descriptions>
      </el-col>

      <el-col :span="14">
        <div class="h-300px overflow-y-auto mb-20px p-10px border-lighter">
          <el-timeline>
            <el-timeline-item
              v-if="formData?.createTime"
              :timestamp="formatDate(formData.createTime)"
              placement="top"
            >
              用户提交了问题
            </el-timeline-item>
            <el-timeline-item
              v-for="(log, index) in logList"
              :key="index"
              :timestamp="log.createTime ? formatDate(log.createTime) : ''"
              color="#0bbd87"
            >
              <p>{{ log.content }}</p>
              <small v-if="log.operatorId">处理人ID：{{ log.operatorId }}</small>
            </el-timeline-item>
          </el-timeline>
        </div>

        <el-form ref="formRef" :model="processData" :rules="rules" label-position="top">
          <el-form-item label="处理意见" prop="processNotes">
            <el-input v-model="processData.processNotes" type="textarea" rows="3" placeholder="请输入本次处理的情况..." />
          </el-form-item>
          <el-form-item label="变更状态" prop="status">
            <el-radio-group v-model="processData.status">
              <el-radio :label="2">跟进中</el-radio>
              <el-radio :label="3">已处理</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="formLoading" @click="submitForm">提交处理记录</el-button>
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import { WtfkApi } from '@/api/lghjft/wtfk' // 修正导入方式
import { formatDate } from '@/utils/formatTime' // yudao 时间格式化工具

/** 定义处理日志的接口结构 */

interface WtfkDetail {
  id?: number
  feedbackId: string
  userId?: number | string
  userName?: string
  contactPhone?: string
  type: string
  platformName: string
  content: string
  createTime?: any
}
interface WtfkLog {
  id?: number
  content: string
  operatorId: number
  createTime?: any
}


const message = useMessage()
const dialogVisible = ref(false)
const formLoading = ref(false)

// --- 变量声明区域（确保每个变量只声明一次）---
// 1. 定义详情接口

const logList = ref<WtfkLog[]>([])
const formData = ref<WtfkDetail>({
  feedbackId: '',
  content: '',
  contactPhone: '',
  type: '',
  platformName: '',
  createTime: undefined
})

const processData = ref<{
  id: number | null
  processNotes: string
  status: number
}>({
  id: null,
  processNotes: '',
  status: 2
})

const formRef = ref()

const rules = {
  processNotes: [{ required: true, message: '必须填写处理备注', trigger: 'blur' }]
}

/** 打开弹窗 */
const open = async (id: number) => {
  resetForm(id)
  dialogVisible.value = true
  formLoading.value = true
  try {
    // 修正：直接使用 WtfkApi 对象下的方法
    const [info, logs] = await Promise.all([
      WtfkApi.getWtfk(id),
      WtfkApi.getWtfkLogList(id)
    ])
    formData.value = info
    logList.value = logs || []
  } catch (error) {
    console.error('获取数据失败', error)
  } finally {
    formLoading.value = false
  }
}

/** 提交表单 */


const resetForm = (id: number | null) => {
  processData.value = {
    id: id,
    processNotes: '',
    status: 2
  }
  logList.value = []
}

const emit = defineEmits(['success'])
/** 提交表单 */
const submitForm = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return

  formLoading.value = true
  try {
    await WtfkApi.handleProcess({
      ...processData.value,
      id: processData.value.id as number // 强制断言为 number
    })
    message.success('处理成功')
    dialogVisible.value = false

    // 2. 提交成功后，触发 success 事件
    emit('success')
    //重置 processData
    resetForm(processData.value.id)

  } catch (error) {
    console.error('提交失败', error)
  } finally {
    formLoading.value = false
  }
}
defineExpose({ open }) // 显式暴露 open 方法给父组件
</script>
<style scoped>
/* 1. 关键：强制限制描述容器的宽度，防止被大图撑宽 */
.editor-content {
  max-width: 280px; /* 针对 span="10" 的列宽进行硬限制 */
  max-height: 400px;
  overflow-x: hidden; /* 禁止横向撑开 */
  overflow-y: auto;   /* 纵向超出则滚动 */
  word-break: break-all;
  line-height: 1.6;
  padding-right: 5px;
}

/* 2. 增强图片约束 */
.editor-content :deep(img) {
  display: block !important;
  /* 强制图片宽度自适应容器，绝对不允许超过容器宽度 */
  width: 100% !important;
  height: auto !important;
  /* 限制最大高度，防止长截图 */
  max-height: 150px !important;
  object-fit: contain;
  margin: 8px 0;
  border-radius: 4px;
  cursor: pointer;
  background-color: #f5f7fa;
}
</style>
