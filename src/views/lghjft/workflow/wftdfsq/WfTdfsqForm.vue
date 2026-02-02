<template>
  <div class="apply-form-container" id="print-area">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">工会经费退还申请表</span>
        </div>
      </template>

      <!-- ========== 一、申请信息 ========== -->
      <h3 class="section-title">一、申请信息</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="社会信用代码" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.shxydm" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.shxydm }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人名称" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.nsrmc" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.nsrmc }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-form-item label="情况说明" class="compact-label">
        <el-input v-if="!isPrintMode" v-model="data.situationDesc" type="textarea" :rows="4" disabled
          class="large-textarea" />
        <span v-else class="print-value print-textarea-large">{{ data.situationDesc }}</span>
      </el-form-item>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="单位负责人" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.unitLeader" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.unitLeader }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="经办人" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.handler" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.handler }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="联系电话" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.contactPhone" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.contactPhone }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="申请日期" class="compact-label">
            <el-date-picker v-if="!isPrintMode" v-model="data.applyDate" type="date" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" style="width: 100%;" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.applyDate }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ========== 二、退款账户信息 ========== -->
      <h3 class="section-title">二、退款账户信息</h3>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="户名" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.accountName" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.accountName }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行名称" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.bankName" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.bankName }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="账号" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.accountNo" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.accountNo }}</span>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开户行行号" class="compact-label">
            <el-input v-if="!isPrintMode" v-model="data.bankCode" placeholder="非必填" disabled class="no-border-input" />
            <span v-else class="print-value">{{ data.bankCode || '—' }}</span>
          </el-form-item>
        </el-col>
      </el-row>

      <!-- ========== 三、附列资料 ========== -->
      <div class="attachment-section">
        <div class="vertical-label">附<br />列<br />资<br />料</div>
        <el-table :data="attachmentList" :show-header="false" style="width: 100%; margin-left: 80px;">
          <el-table-column prop="label" width="240" />
          <el-table-column prop="name">
            <template #default="scope">
              <a v-if="scope.row.url" :href="scope.row.url" target="_blank" class="file-link">
                {{ scope.row.name }}
              </a>
              <span v-else>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- ========== 四、主管工会审批意见 ========== -->
      <template v-if="showManagerSection">
        <h3 class="section-title no-box">主管工会审批意见</h3>
        <el-form-item label="审批意见" class="compact-label">
          <el-input v-if="!isPrintMode" v-model="data.managerOpinion" type="textarea" :rows="5" disabled
            class="large-textarea" />
          <span v-else class="print-value print-textarea-large">{{ data.managerOpinion }}</span>
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" class="compact-label">
              <el-input v-if="!isPrintMode" v-model="data.managerLeaderName" disabled class="no-border-input" />
              <span v-else class="print-value">{{ data.managerLeaderName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人" class="compact-label">
              <el-input v-if="!isPrintMode" v-model="data.managerHandlerName" disabled class="no-border-input" />
              <span v-else class="print-value">{{ data.managerHandlerName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审批日期" class="compact-label">
              <el-date-picker v-if="!isPrintMode" v-model="data.managerApproveTime" type="date" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" style="width: 100%;" disabled class="no-border-input" />
              <span v-else class="print-value">{{ data.managerApproveTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!-- ========== 五、省总工会审核意见 ========== -->
      <template v-if="showProvinceSection">
        <h3 class="section-title no-box">省总工会审核意见</h3>
        <el-form-item label="审批意见" class="compact-label">
          <el-input v-if="!isPrintMode" v-model="data.provinceOpinion" type="textarea" :rows="5" disabled
            class="large-textarea" />
          <span v-else class="print-value print-textarea-large">{{ data.provinceOpinion }}</span>
        </el-form-item>

        <el-form-item v-if="data.refundMethod !== undefined && data.refundMethod !== null" label="退还方式"
          class="compact-label">
          <el-radio-group v-if="!isPrintMode" v-model="data.refundMethod" disabled>
            <el-radio :label="1">差额退库</el-radio>
            <el-radio :label="2">全额退库</el-radio>
            <el-radio :label="3">抵扣欠费</el-radio>
            <el-radio :label="4">抵扣下期应缴费</el-radio>
          </el-radio-group>
          <span v-else class="print-value">
            {{
              { 1: '差额退库', 2: '全额退库', 3: '抵扣欠费', 4: '抵扣下期应缴费' }[data.refundMethod!] || ''
            }}
          </span>
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" class="compact-label">
              <el-input v-if="!isPrintMode" v-model="data.provinceLeaderName" disabled class="no-border-input" />
              <span v-else class="print-value">{{ data.provinceLeaderName }}</span>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人" class="compact-label">
              <el-input v-if="!isPrintMode" v-model="data.provinceHandlerName" disabled class="no-border-input" />
              <span v-else class="print-value">{{ data.provinceHandlerName }}</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="审批日期" class="compact-label">
              <el-date-picker v-if="!isPrintMode" v-model="data.provinceApproveTime" type="date" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" style="width: 100%;" disabled class="no-border-input" />
              <span v-else class="print-value">{{ data.provinceApproveTime }}</span>
            </el-form-item>
          </el-col>
        </el-row>
      </template>

      <!-- 打印按钮（仅屏幕显示） -->
      <div class="no-print" style="text-align: center; margin-top: 16px;">
        <el-button @click="handlePrint">打印申请表</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getApplyDetail } from '@/api/lghjft/workflow/wftdfsq/index'

interface ApplyDetail {
  id: number
  situationDesc: string
  shxydm: string
  nsrmc: string
  unitLeader?: string
  handler?: string
  contactPhone?: string
  accountName: string
  bankName: string
  accountNo: string
  bankCode?: string
  applyDate?: string
  licenseUrl?: string
  payrollUrl?: string
  voucherUrl?: string
  managerOpinion?: string
  managerLeaderName?: string
  managerHandlerName?: string
  managerApproveTime?: string
  provinceOpinion?: string
  provinceLeaderName?: string
  provinceHandlerName?: string
  provinceApproveTime?: string
  refundMethod?: number
}

interface AttachmentItem {
  label: string
  name: string
  url?: string
}

const props = defineProps<{ id: number }>()

const data = ref<ApplyDetail>({
  id: 0,
  situationDesc: '',
  shxydm: '',
  nsrmc: '',
  accountName: '',
  bankName: '',
  accountNo: '',
  applyDate: ''
})

const attachmentList = ref<AttachmentItem[]>([])
const isPrintMode = ref(false)

const fileTypeMap = {
  voucherUrl: { label: '已缴纳工会经费有效凭证复印件' },
  payrollUrl: { label: '对应属期工资表' },
  licenseUrl: { label: '开户许可证复印件' }
}

onMounted(async () => {
  await loadDetail()
})

const loadDetail = async () => {
  try {
    const res = await getApplyDetail(props.id)

    let applyDateStr = ''
    if (Array.isArray(res.applyDate) && res.applyDate.length === 3) {
      const [year, month, day] = res.applyDate
      applyDateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    } else {
      applyDateStr = res.applyTime || res.applyDate || ''
    }

    data.value = { ...res, applyDate: applyDateStr }

    const attachments: AttachmentItem[] = []
      ; (['voucherUrl', 'payrollUrl', 'licenseUrl'] as const).forEach(key => {
        const url = res[key]
        if (url && url.trim()) {
          const fileName = url.substring(url.lastIndexOf('/') + 1)
          attachments.push({
            label: fileTypeMap[key].label,
            name: fileName,
            url
          })
        }
      })

    if (attachments.length === 0) {
      attachments.push({ label: '无', name: '未上传任何附列资料' })
    }

    attachmentList.value = attachments
  } catch (error) {
    console.error('加载失败：', error)
    ElMessage.error('数据加载失败')
  }
}

const handlePrint = () => {
  isPrintMode.value = true
  setTimeout(() => {
    window.print()
    isPrintMode.value = false
  }, 100)
}

const showManagerSection = computed(() => {
  return !!(data.value.managerOpinion || data.value.managerLeaderName || data.value.managerHandlerName || data.value.managerApproveTime)
})

const showProvinceSection = computed(() => {
  return !!(
    data.value.provinceOpinion ||
    data.value.provinceLeaderName ||
    data.value.provinceHandlerName ||
    data.value.provinceApproveTime ||
    (data.value.refundMethod !== undefined && data.value.refundMethod !== null)
  )
})
</script>

<style scoped>
.apply-form-container {
  max-width: 900px;
  margin: 20px auto;
  font-family: 'SimSun', '宋体', sans-serif;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 20px;
}

.title {
  color: #000;
  font-size: 20px;
  font-weight: bold;
}

.section-title {
  margin: 24px 0 16px;
  font-size: 16px;
  color: #000;
  font-weight: bold;
  border-bottom: 1px solid #000;
  padding-bottom: 4px;
}

/* 去掉审批标题的边框感 */
.section-title.no-box {
  border: none;
  padding: 0;
  margin-top: 20px;
}

/* 竖排“附列资料” */
.attachment-section {
  position: relative;
  margin: 24px 0 16px;
}

.vertical-label {
  position: absolute;
  left: 0;
  top: 0;
  width: 60px;
  height: 100px;
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-weight: bold;
  font-size: 14pt;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* 缩小标签，增大内容区 */
.compact-label .el-form-item__label {
  font-size: 13pt !important;
  padding-right: 6px !important;
  width: 90px !important;
}

.el-form-item {
  margin-bottom: 12px;
}

/* 去掉输入框边框 */
.no-border-input :deep(.el-input__wrapper),
.no-border-input :deep(.el-input__inner),
.no-border-input :deep(.el-date-editor .el-input__wrapper) {
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
}

.large-textarea :deep(.el-textarea__inner) {
  min-height: 100px !important;
  border: none !important;
  background: transparent !important;
  box-shadow: none !important;
  padding: 6px 8px !important;
}

/* 打印样式 */
.print-value {
  display: inline-block;
  min-height: 24px;
  padding: 2px 4px;
  border-bottom: 1px solid #000;
  width: 100%;
  box-sizing: border-box;
}

.print-textarea-large {
  min-height: 100px !important;
  white-space: pre-wrap;
  line-height: 1.6;
}

/* 打印专用 */
@media print {
  body {
    width: 210mm;
    height: 297mm;
    margin: 0;
    padding: 15mm;
    font-family: 'SimSun', '宋体', serif;
    background: white !important;
    color: #000;
    font-size: 14pt;
    line-height: 1.6;
  }

  .apply-form-container {
    max-width: none;
    margin: 0;
  }

  .el-card,
  .el-card__body {
    border: none !important;
    box-shadow: none !important;
    padding: 0 !important;
  }

  /* 隐藏附件表格（只保留竖排文字？但通常打印不需要附件链接） */
  .attachment-section {
    display: none !important;
  }

  .no-print {
    display: none !important;
  }

  .el-input__wrapper,
  .el-textarea__inner,
  .el-date-editor {
    display: none !important;
  }

  .el-form-item__label {
    font-weight: bold;
  }
}
</style>