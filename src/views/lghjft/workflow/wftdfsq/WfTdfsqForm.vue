<template>
  <div class="form-container" id="print-target">
    <!-- 标题区域 -->
    <div class="title-section">
      <h1 class="form-title">甘肃省工会经费退（抵）费申请表</h1>
    </div>

    <!-- 主表格 -->
    <table class="form-table">
      <!-- 情况说明、账户信息 原有代码（无任何修改） -->
      <tr>
        <th rowspan="3" class="vertical-text">情况说明</th>
        <td width="20%">社会信用代码</td>
        <td width="26%">
          <input v-if="!isPrintMode" v-model="data.shxydm" disabled class="form-input" />
          <span v-else class="form-input">{{ data.shxydm || '' }}</span>
        </td>
        <td width="20%">纳税人名称</td>
        <td width="35%">
          <input v-if="!isPrintMode" v-model="data.nsrmc" disabled class="form-input" />
          <span v-else class="form-input">{{ data.nsrmc || '' }}</span>
        </td>
      </tr>
      <tr>
        <td colspan="4" style="border: none;">
          <textarea v-if="!isPrintMode" v-model="data.situationDesc" disabled class="form-textarea" rows="5"></textarea>
          <span v-else class="form-textarea">{{ data.situationDesc || '' }}</span>
        </td>
      </tr>
      <tr>
        <td colspan="4" style="border: none; padding: 8px 0;">
          <div class="approval-sign-wrap">
            <div class="sign-group">
              <div>单位负责人：
                <input v-if="!isPrintMode" v-model="data.unitLeader" disabled class="sign-input" />
                <span v-else class="sign-input">{{ data.unitLeader || '' }}</span>
              </div>
              <div>经办人：
                <input v-if="!isPrintMode" v-model="data.handler" disabled class="sign-input" />
                <span v-else class="sign-input">{{ data.handler || '' }}</span>
              </div>
              <div>（公章）</div>
            </div>
            <div style="display: flex; align-items: center; gap: 20px;">
              联系电话：
              <input v-if="!isPrintMode" v-model="data.contactPhone" disabled class=" sign-input" type="text" />
              <span v-else class=" sign-input">{{ data.contactPhone || '' }}</span>
              <div class="date-line">
                <span class="mini-input">{{ getDatePart(data.applyDate, 'year') }}</span> 年
                <span class="mini-input">{{ getDatePart(data.applyDate, 'month') }}</span> 月
                <span class="mini-input">{{ getDatePart(data.applyDate, 'day') }}</span> 日
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <th rowspan="2" class="vertical-text">账户信息</th>
        <td>户名</td>
        <td>
          <input v-if="!isPrintMode" v-model="data.accountName" disabled class="form-input" />
          <span v-else class="form-input">{{ data.accountName || '' }}</span>
        </td>
        <td>开户行名称</td>
        <td>
          <input v-if="!isPrintMode" v-model="data.bankName" disabled class="form-input" />
          <span v-else class="form-input">{{ data.bankName || '' }}</span>
        </td>
      </tr>
      <tr>
        <td>账号</td>
        <td>
          <input v-if="!isPrintMode" v-model="data.accountNo" disabled class="form-input" />
          <span v-else class="form-input">{{ data.accountNo || '' }}</span>
        </td>
        <td>开户行行号</td>
        <td>
          <input v-if="!isPrintMode" v-model="data.bankCode" disabled class="form-input" placeholder="非必填" />
          <span v-else class="form-input">{{ data.bankCode || '' }}</span>
        </td>
      </tr>

      <!-- 附列资料 - 原有代码（无修改） -->
      <tr>
        <th class="vertical-text">附列资料</th>
        <td colspan="4">
          <div class="checkbox-group">
            <label>
              <input type="checkbox" disabled :checked="!!data.voucherUrl" /> 已缴纳工会经费有效凭证复印件
            </label>
            <label>
              <input type="checkbox" disabled :checked="!!data.payrollUrl" /> 对应属期工资表
            </label>
            <label>
              <input type="checkbox" disabled :checked="!!data.licenseUrl" /> 开户许可证复印件
            </label>
          </div>
          <div class="note">
            注意事项：<br />
            根据实际情况选择附件，复印件注明“此复印件与原件相符，原件在我单位留存”并加盖公章
          </div>
        </td>
      </tr>

      <!-- 受理情况 - 主管工会 + 省总工会 原有代码（无修改） -->
      <tr>
        <th rowspan="2" class="vertical-text">受理情况</th>
        <td colspan="4">
          <div class="approval-section">
            <div class="approval-title">主管工会审批意见：</div>
            <textarea v-if="!isPrintMode" v-model="data.managerOpinion" disabled class="approval-textarea"
              style="margin-top:40px; margin-left: 40px; width: 90%;" rows="2"></textarea>
            <span v-else class="approval-textarea">{{ data.managerOpinion || '' }}</span>
            <div class="approval-sign-wrap">
              <div class="sign-group">
                <div>负责人：
                  <input v-if="!isPrintMode" v-model="data.managerLeaderName" disabled class="sign-input" />
                  <span v-else class="sign-input">{{ data.managerLeaderName || '' }}</span>
                </div>
                <div>经办人：
                  <input v-if="!isPrintMode" v-model="data.managerHandlerName" disabled class="sign-input" />
                  <span v-else class="sign-input">{{ data.managerHandlerName || '' }}</span>
                </div>
                <div>（盖章）</div>
              </div>
              <div class="date-line">
                <span class="mini-input">{{ getDatePart(data.managerApproveTime, 'year') }}</span> 年
                <span class="mini-input">{{ getDatePart(data.managerApproveTime, 'month') }}</span> 月
                <span class="mini-input">{{ getDatePart(data.managerApproveTime, 'day') }}</span> 日
              </div>
            </div>
          </div>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <div class="approval-section">
            <div class="approval-title">省总工会审核意见：</div>
            <textarea v-if="!isPrintMode" v-model="data.provinceOpinion" disabled class="approval-textarea" rows="2"
              style="margin-top:40px; margin-left: 40px;   width: 90%;"></textarea>
            <span v-else class="approval-textarea">{{ data.provinceOpinion || '' }}</span>

            <!-- 退还方式：原有代码（无修改） -->
            <div class="refund-method" v-if="data.refundMethod !== undefined && data.refundMethod !== null">
              退还方式：
              <label>
                <input type="radio" disabled v-model="refundMethodText" value="差额退库" /> 差额退库
              </label>
              <label>
                <input type="radio" disabled v-model="refundMethodText" value="全额退库" /> 全额退库
              </label>
              <label>
                <input type="radio" disabled v-model="refundMethodText" value="抵扣欠费" /> 抵扣欠费
              </label>
              <label>
                <input type="radio" disabled v-model="refundMethodText" value="抵扣下期应缴费" /> 抵扣下期应缴费
              </label>
            </div>

            <div class="approval-sign-wrap">
              <div class="sign-group">
                <div>负责人：
                  <input v-if="!isPrintMode" v-model="data.provinceLeaderName" disabled class="sign-input" />
                  <span v-else class="sign-input">{{ data.provinceLeaderName || '' }}</span>
                </div>
                <div>经办人：
                  <input v-if="!isPrintMode" v-model="data.provinceHandlerName" disabled class="sign-input" />
                  <span v-else class="sign-input">{{ data.provinceHandlerName || '' }}</span>
                </div>
                <div>（盖章）</div>
              </div>
              <div class="date-line">
                <span class="mini-input">{{ getDatePart(data.provinceApproveTime, 'year') }}</span> 年
                <span class="mini-input">{{ getDatePart(data.provinceApproveTime, 'month') }}</span> 月
                <span class="mini-input">{{ getDatePart(data.provinceApproveTime, 'day') }}</span> 日
              </div>
            </div>
          </div>
        </td>
      </tr>
    </table>

    <!-- 按钮组：新增【查看文件】按钮，样式和原有统一 -->
    <div v-if="!isPrintMode" class="btn-group">
      <!-- 查看文件按钮 -->
      <el-button type="success" class="print-btn ck-btn" @click="openFileDialog">查看文件</el-button>
    </div>

    <!-- 文件预览弹窗 -->
    <el-dialog v-model="fileDialogVisible" title="附列资料文件查看" width="600px" top="50px" destroy-on-close append-to-body>
      <div class="file-list-container" v-if="attachmentList.length > 0">
        <!-- 渲染附件列表 -->
        <div class="file-item" v-for="(item, index) in attachmentList" :key="index">
          <!-- 无文件时提示 -->
          <div v-if="item.label === '无'" class="no-file-tip">{{ item.name }}</div>
          <!-- 有文件时展示：名称 + 预览/下载按钮 -->
          <div v-else class="file-info">
            <span class="file-name">{{ item.label }}：{{ item.name }}</span>
            <div class="file-btns">
              <el-button type="primary" size="small" @click="previewFile(item.url)">预览</el-button>
              <el-button type="success" size="small" @click="downloadFile(item.url, item.name)">下载</el-button>
            </div>
          </div>
        </div>
      </div>
      <!-- 弹窗底部按钮 -->
      <template #footer>
        <el-button type="default" @click="fileDialogVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElDialog, ElButton } from 'element-plus' // 新增引入Dialog和Button
import { getApplyDetail } from '@/api/lghjft/workflow/wftdfsq/index'

// 类型定义（原有代码无修改）
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

// 响应式数据（原有+新增弹窗控制、退还方式映射）
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
const refundMethodText = ref('') // 退还方式文字值
// 新增：文件弹窗显隐控制
const fileDialogVisible = ref(false)

// 退还方式数字转文字映射（原有代码）
const refundMethodMap = {
  1: '差额退库',
  2: '全额退库',
  3: '抵扣欠费',
  4: '抵扣下期应缴费'
}

// 数据加载（原有代码无修改）
onMounted(async () => {
  await loadDetail()
})
const loadDetail = async () => {
  try {
    const res = await getApplyDetail(props.id)

    // 通用日期处理函数
    const formatDateField = (obj: any, field: string) => {
      if (Array.isArray(obj[field]) && obj[field].length === 3) {
        const [year, month, day] = obj[field]
        return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      }
      return undefined
    }

    // 批量处理日期字段
    const applyDateStr = formatDateField(res, 'applyDate') || res.applyTime || res.applyDate || ''
    const provinceApproveTimeStr = formatDateField(res, 'provinceApproveTime') || res.provinceApproveTime || ''
    const managerApproveTimeStr = formatDateField(res, 'managerApproveTime') || res.managerApproveTime || ''

    // 赋值整合
    data.value = {
      ...res,
      applyDate: applyDateStr,
      provinceApproveTime: provinceApproveTimeStr,
      managerApproveTime: managerApproveTimeStr
    }

    // 退还方式赋值
    if (data.value.refundMethod) {
      refundMethodText.value = refundMethodMap[data.value.refundMethod] || ''
    }

    // 附件处理（原有代码，已自动处理3类文件，无需修改）
    const attachments: AttachmentItem[] = []
      ; (['voucherUrl', 'payrollUrl', 'licenseUrl'] as const).forEach(key => {
        const url = res[key]
        if (url && url.trim()) {
          const fileName = url.substring(url.lastIndexOf('/') + 1)
          attachments.push({
            label: key === 'voucherUrl' ? '已缴纳工会经费有效凭证复印件' :
              key === 'payrollUrl' ? '对应属期工资表' : '开户许可证复印件',
            name: fileName,
            url
          })
        }
      })
    if (attachments.length === 0) attachments.push({ label: '无', name: '未上传任何附列资料' })
    attachmentList.value = attachments
  } catch (error) {
    console.error('加载失败：', error)
    ElMessage.error('数据加载失败')
  }
}

// 安全分割日期（原有代码无修改）
const getDatePart = (dateStr: string | undefined, part: 'year' | 'month' | 'day') => {
  if (!dateStr || typeof dateStr !== 'string' || !dateStr.includes('-')) {
    return ''
  }
  const [year, month, day] = dateStr.split('-')
  switch (part) {
    case 'year': return year || ''
    case 'month': return month || ''
    case 'day': return day || ''
    default: return ''
  }
}

// 打印功能（原有代码无修改）
const handlePrint = () => {
  isPrintMode.value = true
  setTimeout(() => {
    window.print()
    isPrintMode.value = false
  }, 100)
}

// 查看机构明细（原有代码无修改）
const openBranchDialog = () => {
  ElMessage.info('可在此处补充查看机构明细的业务逻辑')
}

// 新增：文件弹窗相关方法
// 打开文件弹窗
const openFileDialog = () => {
  // 无附件时直接提示，不打开弹窗
  if (attachmentList.value.length === 1 && attachmentList.value[0].label === '无') {
    ElMessage.info('暂无上传的附列资料文件')
    return
  }
  fileDialogVisible.value = true
}

// 预览文件：新窗口打开URL，支持在线预览（pdf/图片等）
const previewFile = (url?: string) => {
  if (!url) {
    ElMessage.warning('文件地址无效，无法预览')
    return
  }
  window.open(url, '_blank') // 新标签页打开预览
}

// 下载文件：创建a标签实现下载，自动带文件名
const downloadFile = (url?: string, fileName?: string) => {
  if (!url) {
    ElMessage.warning('文件地址无效，无法下载')
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = fileName || '工会经费附列资料' // 自定义默认文件名
  a.click()
  document.body.removeChild(a)
  ElMessage.success('开始下载文件')
}
</script>

<style scoped>
/* 原有样式全部保留，仅新增文件弹窗相关样式 */
.form-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: "SimSun", serif;
  font-size: 16px;
}

.title-section {
  text-align: center;
  margin-bottom: 25px;
}

.attachment {
  text-align: left;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.form-title {
  font-size: 26px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 15px;
}

.form-table {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  page-break-inside: avoid;
}

.form-table th,
.form-table td {
  border: 1px solid #000;
  padding: 8px;
  vertical-align: middle;
}

.vertical-text {
  writing-mode: vertical-lr;
  text-align: center;
  font-weight: normal;
  width: 60px;
}

.form-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
}

.form-textarea {
  width: 100%;
  border: none !important;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  resize: none;
  min-height: 80px;
  padding: 0;
  margin: 0;
}

.approval-textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 20px;
  font-weight: bold;
  resize: none;
  min-height: 40px;
  margin: 10px 0;
}

.mini-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: center;
  width: 50px;
}


.sign-input {
  border: none;
  border-bottom: 1px solid #000;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  width: 120px;
  margin-left: 5px;
  text-align: center;
}

.sign-group {
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
}

.checkbox-group {
  display: flex;
  gap: 20px;
  margin: 10px 0;
  flex-wrap: wrap;
}

.note {
  font-size: 14px;
  color: #333;
  line-height: 1.5;
}

.approval-section {
  padding: 5px 0;
}

.approval-title {
  font-weight: bold;
}

.refund-method {
  margin: 10px 0;
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.approval-sign-wrap {
  padding-right: 40px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-top: 5px;
}

.date-line {
  display: flex;
  align-items: center;
  gap: 5px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
}

.print-btn {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  height: 40px;
  line-height: 20px;
}


/* 新增：文件弹窗样式 */
.file-list-container {
  padding: 10px 0;
}

.file-item {
  padding: 12px 8px;
  border-bottom: 1px solid #eee;
}

.file-item:last-child {
  border-bottom: none;
}

.no-file-tip {
  text-align: center;
  color: #999;
  font-size: 16px;
  padding: 20px 0;
}

.file-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.file-name {
  font-size: 15px;
  color: #333;
  flex: 1;
}

.file-btns {
  display: flex;
  gap: 8px;
}
</style>