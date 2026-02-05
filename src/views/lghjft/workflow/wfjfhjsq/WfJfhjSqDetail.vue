<template>
  <div class="apply-form-container" id="print-area">
    <div class="a4-paper" id="print-target">
      <!-- 申请表标题 -->
      <div class="form-title">工会经费缓缴申请表</div>

      <!-- 1. 基础信息模块 -->
      <div class="form-module">
        <div class="vertical-label-box" style="height:70mm;">
          <div class="vertical-label">基础信息</div>
        </div>
        <div class="module-content" style="height: 70mm;">
          <!-- 第一行：缴费单位名称 + 社会信用代码 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">缴费单位名称：</span>
              <el-input v-if="!isPrintMode" v-model="formData.nsrmc" disabled class="form-input" />
              <span v-else class="print-text">{{ formData.nsrmc || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">社会信用代码：</span>
              <el-input v-if="!isPrintMode" v-model="formData.shxydm" disabled class="form-input" />
              <span v-else class="print-text">{{ formData.shxydm || '————————————————————' }}</span>
            </div>
          </div>

          <!-- 第二行：联系人及电话 + 适用费率 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">联系人及电话：</span>
              <el-input v-if="!isPrintMode" v-model="formData.contactPhone" disabled class="form-input" />
              <span v-else class="print-text">{{ formData.contactPhone || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">适用费率（%）：</span>
              <el-input v-if="!isPrintMode" v-model.number="formData.applicableRate" disabled
                class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.applicableRate || '————————' }}</span>
            </div>
          </div>

          <!-- 第三行：职工人数 + 月工资总额 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">职工人数（人）：</span>
              <el-input v-if="!isPrintMode" v-model.number="formData.employeeCount" disabled
                class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.employeeCount || '————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">月工资总额（元）：</span>
              <el-input v-if="!isPrintMode" v-model.number="formData.monthlySalaryTotal" disabled class="form-input" />
              <span v-else class="print-text">{{ formData.monthlySalaryTotal || '————————————————————' }}</span>
            </div>
          </div>

          <!-- 第四行：月拨缴金额 + 累计缓缴金额 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">月拨缴金额（元）：</span>
              <el-input v-if="!isPrintMode" v-model.number="formData.monthlyPayAmount" disabled class="form-input" />
              <span v-else class="print-text">{{ formData.monthlyPayAmount || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">累计缓缴金额（元）：</span>
              <el-input v-if="!isPrintMode" v-model.number="formData.totalDeferAmount" disabled class="form-input" />
              <span v-else class="print-text">{{ formData.totalDeferAmount || '————————————————————' }}</span>
            </div>
          </div>

          <!-- 第五行：缓缴期限 -->
          <div class="form-row single-item">
            <span class="item-label">申请缓缴期限：</span>
            <div class="defer-period-box">
              <span>自</span>
              <el-input v-if="!isPrintMode" v-model="formData.deferStartDate" disabled class="form-input month-input" />
              <span v-else class="print-text month-text">{{ formData.deferStartDate || '____年__月' }}</span>
              <span>至</span>
              <el-input v-if="!isPrintMode" v-model="formData.deferEndDate" disabled class="form-input month-input" />
              <span v-else class="print-text month-text">{{ formData.deferEndDate || '____年__月' }}</span>
              <span>，共</span>
              <el-input v-if="!isPrintMode" v-model.number="formData.deferTotalMonth" disabled
                class="form-input num-input" />
              <span v-else class="print-text num-text">{{ formData.deferTotalMonth || '__' }}</span>
              <span>月</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 申请说明模块 -->
      <div class="form-module">
        <div class="vertical-label-box" style="height: 40mm;">
          <div class="vertical-label">申请说明</div>
        </div>
        <div class="module-content" style="height: 40mm;">
          <div class="form-row single-item">
            <span class="item-label">申请缓缴情况说明：</span>
            <el-input v-if="!isPrintMode" v-model="formData.situationDesc" type="textarea" :rows="4" disabled
              class="form-textarea" />
            <span v-else class="print-textarea">{{ formData.situationDesc ||
              '————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————'
            }}</span>
          </div>
        </div>
      </div>

      <!-- 3. 缴费单位意见 -->
      <div class="form-module" v-if="showUnitSection">
        <div class="vertical-label-box" style="height: 30mm;">
          <div class="vertical-label">缴费单位</div>
        </div>
        <div class="module-content" style="height: 30mm;">
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">单位负责人：</span>
              <el-input v-if="!isPrintMode" v-model="formData.unitLeader" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.unitLeader || '————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">经办：</span>
              <el-input v-if="!isPrintMode" v-model="formData.handler" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.handler || '————————' }}</span>
            </div>
          </div>
          <div class="form-row date-item">
            <span class="item-label">日期:</span>
            <el-date-picker v-if="!isPrintMode" v-model="formData.applyDate" type="date" format="YYYY-MM-DD"
              value-format="YYYY-MM-DD" disabled class="form-date" />
            <span v-else class="print-text short-text">{{ formData.applyDate || '____年__月__日' }}</span>
          </div>
        </div>
      </div>

      <!-- 4. 基层工会意见 -->
      <div class="form-module" v-if="showGrassrootsSection">
        <div class="vertical-label-box" style="height: 50mm;">
          <div class="vertical-label">基层工会</div>
        </div>
        <div class="module-content" style="height: 50mm;">
          <div class="form-row single-item">
            <span class="item-label ">基层工会意见(章):</span>
            <el-input v-if="!isPrintMode" v-model="formData.grassrootsOpinion" type="textarea" :rows="2" disabled
              class="form-textarea" />
            <span v-else class="print-text mid-text">{{ formData.grassrootsOpinion || '————————————————————' }}</span>
          </div>
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">工会负责人：</span>
              <el-input v-if="!isPrintMode" v-model="formData.grassrootsLeader" disabled
                class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.grassrootsLeader || '————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">经办：</span>
              <el-input v-if="!isPrintMode" v-model="formData.grassrootsHandler" disabled
                class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.grassrootsHandler || '————————' }}</span>
            </div>
          </div>
          <div class="form-row date-item">
            <span class="item-label">日期：</span>
            <el-date-picker v-if="!isPrintMode" v-model="formData.grassrootsnApproveTime" type="date"
              format="YYYY-MM-DD" value-format="YYYY-MM-DD" disabled class="form-date" />
            <span v-else class="print-text short-text">{{ formData.grassrootsnApproveTime || '____年__月__日' }}</span>
          </div>
        </div>
      </div>

      <!-- 5. 主管工会审核意见 -->
      <div class="form-module last-module" v-if="showManagerSection">
        <div class="vertical-label-box" style="height: 70mm;">
          <div class="vertical-label">主管工会</div>
        </div>
        <div class="module-content" style="height: 70mm;">
          <div class="form-row single-item">
            <span class="item-label">主管工会审核意见(章):</span>
            <el-input v-if="!isPrintMode" v-model="formData.managerOpinion" type="textarea" :rows="2" disabled
              class="form-textarea" />
            <span v-else class="print-approve-text">{{ formData.managerOpinion ||
              '————————————————————————————————————————————————————————————————————————————————————————————————————'
            }}</span>
          </div>
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">工会负责人：</span>
              <el-input v-if="!isPrintMode" v-model="formData.managerLeaderName" disabled
                class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.managerLeaderName || '————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">财务负责人：</span>
              <el-input v-if="!isPrintMode" v-model="formData.managerFinanceLeader" disabled
                class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.managerFinanceLeader || '————————' }}</span>
            </div>
          </div>
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">经办：</span>
              <el-input v-if="!isPrintMode" v-model="formData.managerHandlerName" disabled
                class="form-input short-input" />
              <span v-else class="print-text short-text">{{ formData.managerHandlerName || '————————' }}</span>
            </div>
            <div class="form-item date-item">
              <span class="item-label">日期：</span>
              <el-date-picker v-if="!isPrintMode" v-model="formData.managerApproveTime" type="date" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" disabled class="form-date" />
              <span v-else class="print-text short-text">{{ formData.managerApproveTime || '____年__月__日' }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打印按钮 -->
    <div class="no-print print-btn-box">
      <el-button type="primary" size="large" @click="handlePrint">打印申请表</el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { WfJfhjSqApi } from '@/api/lghjft/workflow/wfjfhjsq'
import type { WfJfhjSq, WfJfhjSqSubmit } from '@/api/lghjft/workflow/wfjfhjsq'

// 接收父组件传递的ID
const props = defineProps<{ id: number }>()

// 响应式数据
const formData = ref<WfJfhjSq>({
  id: 0,
  shxydm: '',
  nsrmc: '',
  contactPhone: '',
  applicableRate: 0,
  employeeCount: 0,
  monthlySalaryTotal: 0,
  monthlyPayAmount: 0,
  deferStartDate: '',
  deferEndDate: '',
  deferTotalMonth: 0,
  totalDeferAmount: 0,
  situationDesc: '',
  unitLeader: '',
  handler: '',
  applyDate: '',
  grassrootsOpinion: '',
  grassrootsLeader: '',
  grassrootsHandler: '',
  grassrootsnApproveTime: '',
  managerOpinion: '',
  managerLeaderName: '',
  managerHandlerName: '',
  managerApproveTime: '',
  managerFinanceLeader: '',
  processInstanceId: ''
})
const isPrintMode = ref(false)

// 计算是否显示各审批模块（无数据则不显示）
const showUnitSection = computed(() => !!(
  formData.value.unitLeader || formData.value.handler || formData.value.applyDate
))

const showGrassrootsSection = computed(() => !!(
  formData.value.grassrootsOpinion || formData.value.grassrootsLeader ||
  formData.value.grassrootsHandler || formData.value.grassrootsnApproveTime
))

const showManagerSection = computed(() => !!(
  formData.value.managerOpinion || formData.value.managerLeaderName ||
  formData.value.managerFinanceLeader || formData.value.managerHandlerName ||
  formData.value.managerApproveTime
))

// 自动计算缓缴月数
watch([() => formData.value.deferStartDate, () => formData.value.deferEndDate], () => {
  if (formData.value.deferStartDate && formData.value.deferEndDate) {
    const [startYear, startMonth] = formData.value.deferStartDate.split('-').map(Number)
    const [endYear, endMonth] = formData.value.deferEndDate.split('-').map(Number)
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth)
    formData.value.deferTotalMonth = totalMonths < 1 ? 1 : totalMonths

    // 自动计算累计缓缴金额（月拨缴金额 * 缓缴月数）
    if (formData.value.monthlyPayAmount) {
      formData.value.totalDeferAmount = formData.value.monthlyPayAmount * formData.value.deferTotalMonth
    }
  } else {
    formData.value.deferTotalMonth = 0
    formData.value.totalDeferAmount = 0
  }
})

// 加载详情数据
onMounted(async () => {
  await loadDetail()

})

const loadDetail = async () => {
  try {
    const res = await WfJfhjSqApi.getWfJfhjSq(props.id)
    // 单独处理基层审批日期
    if (Array.isArray(res.grassrootsnApproveTime) && res.grassrootsnApproveTime.length === 3) {
      const [y, m, d] = res.grassrootsnApproveTime
      res.grassrootsnApproveTime = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
    }
    res.grassrootsnApproveTime = res.grassrootsnApproveTime || ''

    // 单独处理主管审批日期
    if (Array.isArray(res.managerApproveTime) && res.managerApproveTime.length === 3) {
      const [y, m, d] = res.managerApproveTime
      res.managerApproveTime = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`
    }
    res.managerApproveTime = res.managerApproveTime || ''
    formData.value = { ...res }
  } catch (error) {
    console.error('加载缓缴申请详情失败：', error)
    ElMessage.error('数据加载失败，请重试')
  }
}

// 打印功能（沿用原汇总表的简洁打印方式）
const handlePrint = () => {
  isPrintMode.value = true
  // 延迟执行打印，确保DOM渲染完成
  setTimeout(() => {
    window.print()
    isPrintMode.value = false
  }, 100)
}
</script>

<style scoped>
/* 全局样式重置（对齐原汇总表） */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 页面容器样式 */
.apply-form-container {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'SimSun', '宋体', sans-serif;
  background-color: #f9f9f9;
}

/* A4纸张样式 */
.a4-paper {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 10mm;
  border: 1px solid #e0e0e0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  margin-bottom: 20px;
}

/* 打印按钮样式 */
.print-btn-box {
  margin-top: 20px;
}

/* 表单标题样式 */
.form-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10mm;
  letter-spacing: 2px;
  color: #333;
}

/* 表单模块容器 */
.form-module {
  display: flex;
  width: 100%;
  position: relative;
  /* margin-bottom: 3mm; */
}

/* 最后一个模块取消底部间距 */
.last-module {
  margin-bottom: 0;
}

/* 左侧垂直标签盒子 */
.vertical-label-box {
  width: 10mm;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #f5f5f5;
}

/* 垂直标签文字 */
.vertical-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 4px;
  color: #333;
}

/* 模块内容区域 */
.module-content {
  flex: 1;
  border: 1px solid #000;
  padding: 5mm;
  background-color: #fff;
}

/* 表单行样式 */
.form-row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 3mm;
}

/* 最后一行取消底部间距 */
.form-row:last-child {
  margin-bottom: 0;
}

/* 双列布局 */
.double-item {
  justify-content: space-between;
}

/* 单列布局 */
.single-item {
  flex-direction: column;
  align-items: flex-start;
}

/* 表单项样式 */
.form-item {
  display: flex;
  align-items: center;
  gap: 2mm;
  width: 100%;
}

/* 双列表单项宽度 */
.double-item .form-item {
  width: 48%;
}

/* 表单项标签 */
.item-label {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  color: #333;
}

/* 表单输入框样式 */
.form-input {
  flex: 1;
  height: 8mm;
  --el-input-border-color: #000;
}

/* 短输入框样式 */
.short-input {
  width: 40mm;
}

/* 中等长度输入框 */
.mid-input {
  width: 70mm;
}

/* 月份输入框 */
.month-input {
  width: 45mm;
}

/* 数字输入框 */
.num-input {
  width: 18mm;
}

/* 文本域样式 */
.form-textarea {
  width: 100%;
  --el-input-border-color: #000;
  margin-top: 2mm;
  resize: none;
}

/* 短文本域 */
.short-textarea {
  min-height: 20mm;
}

/* 日期选择器样式 */
.form-date {
  width: 40mm;
  height: 8mm;
  --el-input-border-color: #000;
}

/* 日期项对齐方式 */
.date-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 2mm;
}

/* 缓缴期限盒子 */
.defer-period-box {
  display: flex;
  align-items: center;
  gap: 2mm;
  width: 100%;
  margin-top: 2mm;
  flex-wrap: wrap;
}

/* 公章标签 */
.seal-label {
  margin-left: 3mm;
  font-weight: bold;
  flex-shrink: 0;
  font-size: 14px;
}

/* 打印模式文本样式 */
.print-text {
  display: inline-block;
  border-bottom: 1px solid #000;
  height: 8mm;
  line-height: 8mm;
  padding: 0 2mm;
  width: calc(100% - 60px);
  color: #333;
}

/* 短文本打印样式 */
.print-text.short-text {
  width: 40mm;
}

/* 中等文本打印样式 */
.print-text.mid-text {
  width: 70mm;
}

/* 月份文本打印样式 */
.print-text.month-text {
  width: 45mm;
}

/* 数字文本打印样式 */
.print-text.num-text {
  width: 18mm;
}

/* 文本域打印样式 */
.print-textarea {
  display: block;
  width: 100%;
  min-height: 30mm;
  border-bottom: 1px solid #000;
  padding: 2mm;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
}

/* 审批文本打印样式 */
.print-approve-text {
  display: block;
  width: 100%;
  min-height: 20mm;
  border-bottom: 1px solid #000;
  padding: 2mm;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
}

/* 打印样式适配 */
@media print {
  body {
    margin: 0;
    padding: 0;
    background: #fff;
    font-family: 'SimSun', '宋体', sans-serif;
  }

  .apply-form-container {
    padding: 0;
    background: #fff;
  }

  .a4-paper {
    border: none;
    box-shadow: none;
    padding: 0;
    min-height: 297mm;
    margin-bottom: 0;
  }

  /* 打印时隐藏非打印元素 */
  .no-print {
    display: none !important;
  }

  /* 打印时隐藏输入框/按钮等交互元素 */
  :deep(.el-input),
  :deep(.el-textarea),
  :deep(.el-date-picker),
  :deep(.el-button) {
    display: none !important;
  }

  /* 打印时边框颜色加深 */
  .vertical-label-box,
  .module-content {
    border-color: #000;
  }
}

/* 响应式适配 */
@media screen and (max-width: 1200px) {
  .a4-paper {
    width: 100%;
    min-height: auto;
    border: none;
    box-shadow: none;
    padding: 20px;
  }

  .vertical-label-box {
    width: 60px;
    height: auto;
  }

  .form-module {
    margin-bottom: 20px;
  }

  .module-content {
    height: auto;
    min-height: 120px;
  }

  .vertical-label {
    writing-mode: horizontal-tb;
    text-orientation: mixed;
  }

  .double-item {
    flex-wrap: wrap;
  }

  .double-item .form-item {
    width: 100%;
    margin-bottom: 10px;
  }
}
</style>