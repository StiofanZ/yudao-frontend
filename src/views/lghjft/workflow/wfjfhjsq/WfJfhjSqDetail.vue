<template>
  <div class="form-container" id="print-area">
    <!-- 标题区域 -->
    <el-row justify="center" align="middle" class="title-row">
      <el-col :span="24" class="title-col">
        <h1 class="form-title">甘肃省工会经费缓缴申请表</h1>
      </el-col>
      <el-col :span="24" class="fill-date-col">
        填报日期：
        <span v-if="!isPrintMode" class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[0] : ''
          }}</span>
        <span v-else class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[0] : '' }}</span> 年
        <span v-if="!isPrintMode" class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[1] : ''
          }}</span>
        <span v-else class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[1] : '' }}</span> 月
        <span v-if="!isPrintMode" class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[2] : ''
          }}</span>
        <span v-else class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[2] : '' }}</span> 日
      </el-col>
    </el-row>

    <!-- 基础信息区域：与参考样式完全一致的栅格布局 -->
    <el-row class="form-grid-container" :gutter="0">
      <!-- 第一行：缴费单位名称 + 社会信用代码 -->
      <el-col :span="4" class="label-cell">缴费单位名称</el-col>
      <el-col :span="8">
        <input v-if="!isPrintMode" v-model="formData.nsrmc" class="form-input" disabled />
        <span v-else class="form-input">{{ formData.nsrmc || '' }}</span>
      </el-col>
      <el-col :span="4" class="label-cell">社会信用代码</el-col>
      <el-col style="border-right: none;" :span="8">
        <input v-if="!isPrintMode" v-model="formData.shxydm" class="form-input" disabled />
        <span v-else class="form-input">{{ formData.shxydm || '' }}</span>
      </el-col>

      <!-- 第二行：联系人及电话 + 适用费率（%） -->
      <el-col :span="4" class="label-cell">联系人及电话</el-col>
      <el-col :span="8">
        <!-- 正常模式：禁用输入框展示 联系人/联系电话 组合 -->
        <input v-if="!isPrintMode" v-model="contactAndPhone" class="form-input" disabled />
        <!-- 打印模式：纯文本展示 联系人/联系电话 组合 -->
        <span v-else class="form-input">{{ contactAndPhone }}</span>
      </el-col>
      <el-col :span="4" class="label-cell">适用费率(%) </el-col>
      <el-col :span="8" style="border-right: none;">
        <input v-if="!isPrintMode" v-model.number="formData.applicableRate" class="form-input" type="number" min="0"
          step="0.01" disabled />
        <span v-else class="form-input">{{ formData.applicableRate || '' }}</span>
      </el-col>

      <!-- 第三行：职工人数 + 月工资总额 + 月拨缴金额 -->
      <el-col :span="4" class="label-cell">职工人数（人）</el-col>
      <el-col :span="4">
        <input v-if="!isPrintMode" v-model.number="formData.employeeCount" class="form-input" type="number" min="0"
          disabled />
        <span v-else class="form-input">{{ formData.employeeCount || '' }}</span>
      </el-col>
      <el-col :span="4" class="label-cell">月工资总额（元）</el-col>
      <el-col :span="4">
        <input v-if="!isPrintMode" v-model.number="formData.monthlySalaryTotal" class="form-input" type="number" min="0"
          step="0.01" disabled />
        <span v-else class="form-input">{{ formData.monthlySalaryTotal || '' }}</span>
      </el-col>
      <el-col :span="4" class="label-cell">月拨缴金额（元）</el-col>
      <el-col :span="4" style="border-right: none;">
        <input v-if="!isPrintMode" v-model.number="formData.monthlyPayAmount" class="form-input" type="number" min="0"
          step="0.01" disabled />
        <span v-else class="form-input">{{ formData.monthlyPayAmount || '' }}</span>
      </el-col>

      <!-- 第四行：申请缓缴期限 + 累计缓缴金额 -->
      <el-col :span="4" class="label-cell">申请缓缴期限</el-col>
      <el-col :span="8">
        自
        <span v-if="!isPrintMode" class="mini-input">{{ formData.deferStartDate ? formData.deferStartDate.split('-')[0]
          : '' }}</span>
        <span v-else class="mini-input">{{ formData.deferStartDate ? formData.deferStartDate.split('-')[0] : ''
          }}</span> 年
        <span v-if="!isPrintMode" class="mini-input">{{ formData.deferStartDate ? formData.deferStartDate.split('-')[1]
          : '' }}</span>
        <span v-else class="mini-input">{{ formData.deferStartDate ? formData.deferStartDate.split('-')[1] : ''
          }}</span> 月
        至
        <span v-if="!isPrintMode" class="mini-input">{{ formData.deferEndDate ? formData.deferEndDate.split('-')[0] : ''
          }}</span>
        <span v-else class="mini-input">{{ formData.deferEndDate ? formData.deferEndDate.split('-')[0] : '' }}</span> 年
        <span v-if="!isPrintMode" class="mini-input">{{ formData.deferEndDate ? formData.deferEndDate.split('-')[1] : ''
          }}</span>
        <span v-else class="mini-input">{{ formData.deferEndDate ? formData.deferEndDate.split('-')[1] : '' }}</span> 月，
        共
        <input v-if="!isPrintMode" v-model.number="formData.deferTotalMonth" class="mini-input" type="number" min="1"
          disabled />
        <span v-else class="mini-input">{{ formData.deferTotalMonth || '' }}</span> 月
      </el-col>
      <el-col :span="6" class="label-cell">累计缓缴金额（元）</el-col>
      <el-col :span="6" style="border-right: none;">
        <input v-if="!isPrintMode" v-model.number="formData.totalDeferAmount" class="form-input" type="number" min="0"
          step="0.01" disabled />
        <span v-else class="form-input">{{ formData.totalDeferAmount || '' }}</span>
      </el-col>

      <!-- 第五行：申请缓缴情况说明 -->
      <el-col :span="4" class="label-cell">申请缓缴情况说明</el-col>
      <el-col :span="20">
        <textarea v-if="!isPrintMode" v-model="formData.situationDesc" class="form-textarea" rows="5"
          disabled></textarea>
        <span v-else class="form-textarea">{{ formData.situationDesc || '' }}</span>
      </el-col>
    </el-row>

    <!-- 缴费单位 + 基层工会意见：无标题边框，居左布局 -->
    <el-row class="approval-grid-container" :gutter="0" style="border-top: none;">
      <el-col :span="12" class="approval-item-col">
        <div class="approval-label">缴费单位（章）</div><br />
        <div class="approval-sign-wrap">
          <div class="sign-group">
            <div>单位负责人：<input v-if="!isPrintMode" v-model="formData.unitLeader" class="sign-input" disabled /><span
                v-else class="sign-input">{{ formData.unitLeader || '' }}</span></div>
            <div>经办：<input v-if="!isPrintMode" v-model="formData.handler" class="sign-input" disabled /><span v-else
                class="sign-input">{{ formData.handler || '' }}</span></div>
          </div>
          <div class="date-line">
            <span v-if="!isPrintMode" class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[0] : ''
              }}</span>
            <span v-else class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[0] : '' }}</span> 年
            <span v-if="!isPrintMode" class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[1] : ''
              }}</span>
            <span v-else class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[1] : '' }}</span> 月
            <span v-if="!isPrintMode" class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[2] : ''
              }}</span>
            <span v-else class="mini-input">{{ formData.applyDate ? formData.applyDate.split('-')[2] : '' }}</span> 日
          </div>
        </div>
      </el-col>
      <el-col :span="12" class="approval-item-col">
        <div class="approval-label">基层工会意见（章）</div>

        <textarea v-if="!isPrintMode" v-model="formData.grassrootsOpinion" disabled class="approval-textarea"
          rows="2"></textarea>
        <span v-else class="approval-textarea">{{ formData.managerOpinion || '' }}</span>


        <div class="approval-sign-wrap">
          <div class="sign-group">
            <div>工会负责人：<input v-if="!isPrintMode" v-model="formData.grassrootsLeader" class="sign-input"
                disabled /><span v-else class="sign-input">{{
                  formData.grassrootsLeader || '' }}</span></div>
            <div>经办：<input v-if="!isPrintMode" v-model="formData.grassrootsHandler" class="sign-input" disabled /><span
                v-else class="sign-input">{{ formData.grassrootsHandler || '' }}</span></div>
          </div>
          <div class="date-line">
            <span v-if="!isPrintMode" class="mini-input">{{ formData.grassrootsApproveTime ?
              formData.grassrootsApproveTime.split('-')[0] : '' }}</span>
            <span v-else class="mini-input">{{ formData.grassrootsApproveTime ?
              formData.grassrootsApproveTime.split('-')[0] : '' }}</span> 年
            <span v-if="!isPrintMode" class="mini-input">{{ formData.grassrootsApproveTime ?
              formData.grassrootsApproveTime.split('-')[1] : '' }}</span>
            <span v-else class="mini-input">{{ formData.grassrootsApproveTime ?
              formData.grassrootsApproveTime.split('-')[1] : '' }}</span> 月
            <span v-if="!isPrintMode" class="mini-input">{{ formData.grassrootsApproveTime ?
              formData.grassrootsApproveTime.split('-')[2] : '' }}</span>
            <span v-else class="mini-input">{{ formData.grassrootsApproveTime ?
              formData.grassrootsApproveTime.split('-')[2] : '' }}</span> 日
          </div>
        </div>
      </el-col>
    </el-row>

    <!-- 主管工会审核意见：无标题边框，居左布局 -->
    <el-row class="super-union-grid-container" :gutter="0" style="margin-top: -1px;">
      <el-col :span="24" class="super-union-col">
        <div class="approval-label">主管工会审核意见（章）</div>
        <textarea v-if="!isPrintMode" v-model="formData.managerOpinion" disabled class="approval-textarea"
          rows="2"></textarea>
        <span v-else class="approval-textarea">{{ formData.managerOpinion || '' }}</span> <br />

        <div class="approval-section">
          <div>工会负责人：<input v-if="!isPrintMode" v-model="formData.managerLeaderName" class="sign-input" disabled /><span
              v-else class="sign-input">{{ formData.managerLeaderName || '' }}</span></div><br />
          <div>财务负责人：<input v-if="!isPrintMode" v-model="formData.managerFinanceLeader" class="sign-input" disabled />
            <span v-else class="sign-input" style="margin-left: 20px;">{{ formData.managerFinanceLeader || '' }}</span>
            经办：<input v-if="!isPrintMode" v-model="formData.managerHandlerName" class="sign-input" disabled /><span
              v-else class="sign-input">{{ formData.managerHandlerName || '' }}</span>
          </div>

          <div class="date-line" style="margin-top: 15px;">
            <span v-if="!isPrintMode" class="mini-input">{{ formData.managerApproveTime ?
              formData.managerApproveTime.split('-')[0] : '' }}</span>
            <span v-else class="mini-input">{{ formData.managerApproveTime ? formData.managerApproveTime.split('-')[0] :
              '' }}</span> 年
            <span v-if="!isPrintMode" class="mini-input">{{ formData.managerApproveTime ?
              formData.managerApproveTime.split('-')[1] : '' }}</span>
            <span v-else class="mini-input">{{ formData.managerApproveTime ? formData.managerApproveTime.split('-')[1] :
              '' }}</span> 月
            <span v-if="!isPrintMode" class="mini-input">{{ formData.managerApproveTime ?
              formData.managerApproveTime.split('-')[2] : '' }}</span>
            <span v-else class="mini-input">{{ formData.managerApproveTime ? formData.managerApproveTime.split('-')[2] :
              '' }}</span> 日
          </div>
        </div>
      </el-col>
    </el-row>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage, ElRow, ElCol, ElButton } from 'element-plus'
import { WfJfhjSqApi } from '@/api/lghjft/workflow/wfjfhjsq'
import type { WfJfhjSq } from '@/api/lghjft/workflow/wfjfhjsq'

// 接收父组件ID
const props = defineProps<{ id: number }>()

// 响应式数据
const formData = ref<WfJfhjSq>({} as WfJfhjSq)

const contactAndPhone = computed(() => {
  // 从formData中获取联系人、联系电话，空值兜底为空字符串
  const name = formData.value.contact || ''
  const phone = formData.value.contactPhone || ''
  // 智能拼接，无多余符号
  if (!name && !phone) return ''
  if (!name) return phone
  if (!phone) return name
  return `${name} / ${phone}`
})
const isPrintMode = ref(false)

// 自动计算缓缴月数和累计金额
watch([() => formData.value.deferStartDate, () => formData.value.deferEndDate, () => formData.value.monthlyPayAmount], () => {
  if (formData.value.deferStartDate && formData.value.deferEndDate && formData.value.monthlyPayAmount !== undefined) {
    try {
      const [startYear, startMonth] = formData.value.deferStartDate.split('-').map(Number)
      const [endYear, endMonth] = formData.value.deferEndDate.split('-').map(Number)
      const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth)
      formData.value.deferTotalMonth = totalMonths < 1 ? 1 : totalMonths
      formData.value.totalDeferAmount = formData.value.monthlyPayAmount * formData.value.deferTotalMonth
    } catch (e) {
      console.error('计算缓缴数据失败：', e)
    }
  }
}, { deep: true })

// 加载数据核心方法
const loadDetail = async () => {
  try {
    const res = await WfJfhjSqApi.getWfJfhjSq(props.id)
    if (!res) {
      ElMessage.warning('未查询到数据，请检查ID是否正确')
      return
    }
    // 日期格式化（兼容数组/字符串格式）
    const formatDate = (date: any) => {
      if (Array.isArray(date) && date.length === 3) {
        const [y, m, d] = date
        return `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
      } else if (typeof date === 'string' && date) return date
      return ''
    }
    // 格式化所有日期字段
    res.grassrootsApproveTime = formatDate(res.grassrootsApproveTime)
    res.managerApproveTime = formatDate(res.managerApproveTime)
    res.applyDate = formatDate(res.applyDate)
    res.deferStartDate = formatDate(res.deferStartDate)
    res.deferEndDate = formatDate(res.deferEndDate)
    // 响应式赋值
    Object.assign(formData.value, res)
  } catch (error) {
    console.error('加载数据失败：', error)
    ElMessage.error('数据加载失败，请重试')
  }
}

// 刷新数据
const refreshData = async () => await loadDetail()

// 页面挂载加载
onMounted(async () => await loadDetail())



// 暴露刷新方法给父组件
defineExpose({ refreshData })
</script>

<style scoped>
/* 全局容器：与参考样式完全一致 */
.form-container {
  max-width: 900px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: "SimSun", serif;
  font-size: 16px;
}

.form-title {
  font-size: 26px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
}

.fill-date-col {
  text-align: right;
}

/* 基础信息栅格：参考样式的边框/内边距 */
:deep(.form-grid-container) {
  width: 100%;
  border: 1px solid #000;
  display: flex;
  flex-wrap: wrap;
  margin: 0;
  padding: 0;
}

:deep(.form-grid-container .el-col) {
  border-right: 1px solid #000;
  border-bottom: 1px solid #000;
  padding: 8px;
  box-sizing: border-box;
  vertical-align: middle;
  line-height: 2;
  margin: 0 !important;
}

:deep(.form-grid-container .el-col:last-child) {
  border-right: none;
}

:deep(.form-grid-container .el-col:nth-last-child(-n+2)) {
  border-bottom: none;
}

/* 标签单元格：居中对齐 */
.label-cell {
  text-align: center;
  font-weight: normal;
}

/* 核心修改：为所有输入/显示区域添加下划线 */
.form-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: center;
  padding: 2px 0;
}

.form-textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  resize: none;
  min-height: 100px;
  text-align: left;
  padding: 5px;
}

.mini-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: center;
  width: 50px;
  /* border-bottom: 1px dashed #000; */
  padding: 2px 0;
}

.sign-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  width: 120px;
  margin-left: 5px;
  text-align: center;
  border-bottom: 1px solid #000;
  padding: 2px 0;
}

/* 审批区域栅格：与参考样式一致的边框/布局 */
:deep(.approval-grid-container) {
  width: 100%;
  border: 1px solid #000;
  border-bottom: none;
  display: flex;
  flex-wrap: wrap;
}

:deep(.approval-item-col) {
  border-right: 1px solid #000;
  padding: 15px;
  box-sizing: border-box;
  margin: 0 !important;
}

:deep(.approval-item-col:last-child) {
  border-right: none;
}

:deep(.super-union-grid-container) {
  width: 100%;
  border: 1px solid #000;
  display: flex;
  flex-wrap: wrap;
}

:deep(.super-union-col) {
  padding: 15px;
  box-sizing: border-box;
  margin: 0 !important;
}

/* 审批内部样式：居左/间距与参考一致 */
.approval-label {
  text-align: left;
  margin-bottom: 10px;
}

.sign-group {
  display: flex;
  align-items: center;
  gap: 25px;
  flex-wrap: wrap;
}

.approval-sign-wrap {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8px;
  margin-top: 5px;
}

.approval-section {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.date-line {
  display: flex;
  align-items: center;
  gap: 5px;
  align-self: flex-end;
}


.approval-textarea {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  /* font-family: inherit; */
  font-size: 20px;
  font-weight: bold;
  resize: none;
  min-height: 40px;
  margin: 10px 4dvb;
}

/* 打印适配：移除固定宽高，强制自适应 */
:deep(.el-form) {
  width: 100% !important;
  max-width: 100% !important;
  height: auto !important;
}

/* 移除自定义表单内的固定宽度容器 */
.form-container {
  width: 100% !important;
  max-width: 100% !important;
  min-width: unset !important;
  /* 清除min-width，避免超出A4 */
  height: auto !important;
  overflow: visible !important;
}
</style>