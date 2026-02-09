<template>
  <div class="apply-form-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">工会经费缓缴申请表</span>
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules" label-width="140px" label-position="left" size="default">
        <!-- 基础信息 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社会信用代码" prop="shxydm">
              <el-input v-model="formData.shxydm" maxlength="18" show-word-limit placeholder="请输入18位社会信用代码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费单位名称" prop="nsrmc">
              <el-input v-model="formData.nsrmc" maxlength="100" show-word-limit placeholder="请输入单位全称（与公章一致）"
                clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 新增：缴费单位-经办 输入框 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="缴费单位-经办" prop="  handler">
              <el-input v-model="formData.handler" maxlength="50" placeholder="请输入缴费单位经办人姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系人" prop="contact">
              <el-input v-model="formData.contact" maxlength="50" placeholder="请输入联系人姓名" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="formData.contactPhone" maxlength="50" placeholder="请输入联系电话（如：13800138000）" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用费率（%）" prop="applicableRate">
              <el-input-number v-model="formData.applicableRate" :precision="2" :min="0" :max="2" :step="0.01"
                class="w-full" controls-position="right" placeholder="如：0.8" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="职工人数（人）" prop="employeeCount">
              <el-input-number v-model="formData.employeeCount" :min="1" :step="1" class="w-full"
                controls-position="right" placeholder="在册职工总人数" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="月工资总额（元）" prop="monthlySalaryTotal">
              <el-input-number v-model="formData.monthlySalaryTotal" :precision="2" :min="0.01" :step="0.01"
                class="w-full" controls-position="right" placeholder="保留2位小数" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="月拨缴金额（元）" prop="monthlyPayAmount">
              <el-input-number v-model="formData.monthlyPayAmount" :precision="2" :min="0" class="w-full"
                controls-position="right" placeholder="系统自动计算，无需手动输入" disabled clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 缓缴期限：调整栅格适配900px宽度 -->
        <el-form-item label="申请缓缴期限" class="period-form-item" prop="deferPeriod">
          <el-row :gutter="16" class="period-row" style="align-items: center;">
            <el-col :span="7">
              <div class="period-item">
                <el-date-picker v-model="formData.deferStartDate" type="month" placeholder="请选择缓缴开始年月"
                  format="YYYY 年 MM 月" value-format="YYYY-MM" style="width: 100%;" size="default" clearable />
              </div>
            </el-col>
            <el-col :span="7">
              <div class="period-item">
                <el-date-picker v-model="formData.deferEndDate" type="month" placeholder="请选择缓缴结束年月"
                  format="YYYY 年 MM 月" value-format="YYYY-MM" style="width: 100%;" size="default" clearable />
              </div>
            </el-col>
            <el-col :span="4">
              <div class="period-item">
                <el-input-number v-model="formData.deferTotalMonth" :min="1" :max="24" :step="1" class="w-full"
                  controls-position="right" disabled size="default" placeholder="自动计算" clearable />
                <span class="month-text ml-2">月</span>
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 累计缓缴金额 ：调整栅格，贴合布局 -->
        <el-row :gutter="20" style="margin-top: -10px;">
          <el-col :span="12">
            <el-form-item label="累计缓缴金额（元）" prop="totalDeferAmount">
              <el-input-number v-model="formData.totalDeferAmount" :precision="2" :min="0.01" :step="0.01"
                class="w-[60%]" controls-position="right" placeholder="保留2位小数" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 情况说明 -->
        <el-form-item label="申请缓缴情况说明" prop="situationDesc" style="margin-top: 10px;">
          <el-input v-model="formData.situationDesc" type="textarea" :rows="6"
            placeholder="请详细说明申请缓缴的原因（如经营困难、资金周转问题等）、目前资金状况、缓缴后还款计划等，字数不少于10字" maxlength="2000" show-word-limit
            style="resize: vertical;" />
        </el-form-item>

        <!-- 提交按钮：微调间距，保留原样式 -->
        <el-form-item style="text-align: center; margin-top: 24px;">
          <el-button type="primary" size="large" @click="handleSubmit" :loading="loading">
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { WfJfhjSqApi, type WfJfhjSqSubmit } from '@/api/lghjft/workflow/wfjfhjsq'
import router from '@/router';

// 核心变量
const formRef = ref<FormInstance>()
const loading = ref(false)

const formData = reactive<WfJfhjSqSubmit>({
  shxydm: '',
  nsrmc: '',
  contact: '',
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
  handler: ''  //缴费单位-经办
})

// 完善的校验规则：新增校验
const rules = reactive<FormRules>({
  shxydm: [
    { required: true, message: '请输入社会信用代码', trigger: 'blur' },
    { pattern: /^[0-9A-Z]{18}$/, message: '社会信用代码应为18位数字/大写字母', trigger: 'blur' }
  ],
  nsrmc: [
    { required: true, message: '请输入缴费单位名称', trigger: 'blur' },
    { min: 2, max: 100, message: '单位名称长度应在2-100个字符之间', trigger: 'blur' }
  ],
  // 新增：缴费单位-经办 校验规则
  handler: [
    { required: true, message: '请输入缴费单位经办人姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '经办人姓名长度2-50字符', trigger: 'blur' }
  ],
  // 联系人：仅校验必填+长度
  contact: [
    { required: true, message: '请输入联系人姓名', trigger: 'blur' },
    { min: 2, max: 50, message: '联系人姓名长度2-50字符', trigger: 'blur' }
  ],
  // 联系电话：校验必填+手机号格式
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的11位手机号', trigger: 'blur' }
  ],
  applicableRate: [
    { required: true, message: '请输入适用费率', trigger: 'change' },
    { type: 'number', min: 0.01, max: 2, message: '费率范围应为0.01%-2%', trigger: 'change' }
  ],
  employeeCount: [
    { required: true, message: '请输入职工人数', trigger: 'change' },
    { type: 'number', min: 1, message: '职工人数不能少于1人', trigger: 'change' }
  ],
  monthlySalaryTotal: [
    { required: true, message: '请输入月工资总额', trigger: 'change' },
    { type: 'number', min: 0.01, message: '月工资总额不能为0', trigger: 'change' }
  ],
  deferStartDate: [
    { required: true, message: '请选择缓缴开始年月', trigger: 'change' }
  ],
  deferEndDate: [
    { required: true, message: '请选择缓缴结束年月', trigger: 'change' },
    {
      validator: (rule, value, callback) => {
        if (formData.deferStartDate && value) {
          if (value < formData.deferStartDate) {
            callback(new Error('结束时间不能早于开始时间'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ],
  deferTotalMonth: [
    { required: true, message: '缓缴月数不能为空', trigger: 'change' },
    { type: 'number', min: 1, max: 24, message: '缓缴月数范围为1-24个月', trigger: 'change' }
  ],
  totalDeferAmount: [
    { required: true, message: '请输入累计缓缴金额', trigger: 'change' },
    { type: 'number', min: 0.01, message: '累计缓缴金额不能为0', trigger: 'change' }
  ],
  situationDesc: [
    { required: true, message: '请输入申请缓缴情况说明', trigger: 'blur' },
    { min: 10, message: '情况说明至少填写10个字符', trigger: 'blur' }
  ]
})

// 自动计算月拨缴金额：优化精度，初始化也计算（核心公式：月工资总额 × 费率 ÷ 100）
watch([() => formData.applicableRate, () => formData.monthlySalaryTotal], () => {
  // 只有费率和工资总额都大于0时才计算
  if (formData.applicableRate > 0 && formData.monthlySalaryTotal > 0) {
    // 计算逻辑：月拨缴金额 = 月工资总额 × (适用费率 / 100)，保留2位小数
    const calculateAmount = (formData.monthlySalaryTotal * formData.applicableRate) / 100
    formData.monthlyPayAmount = Number(calculateAmount.toFixed(2))
    // 同步计算累计缓缴金额（可选：若需要自动算累计，取消下面注释）
    // if (formData.deferTotalMonth > 0) {
    //   formData.totalDeferAmount = Number((formData.monthlyPayAmount * formData.deferTotalMonth).toFixed(2))
    // }
  } else {
    formData.monthlyPayAmount = 0
  }
}, { immediate: true })

// 自动计算缓缴月数：修复业务逻辑（包含起止月），适配900px布局
watch([() => formData.deferStartDate, () => formData.deferEndDate], () => {
  if (formData.deferStartDate && formData.deferEndDate) {
    const [startYear, startMonth] = formData.deferStartDate.split('-').map(Number)
    const [endYear, endMonth] = formData.deferEndDate.split('-').map(Number)
    // 核心修正：+1 包含开始和结束月份，符合实际业务
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1
    formData.deferTotalMonth = totalMonths < 1 ? 1 : (totalMonths > 24 ? 24 : totalMonths)

    // 可选：缓缴月数变化后，自动更新累计缓缴金额
    // if (formData.monthlyPayAmount > 0) {
    //   formData.totalDeferAmount = Number((formData.monthlyPayAmount * formData.deferTotalMonth).toFixed(2))
    // }
  } else {
    formData.deferTotalMonth = 0
  }
}, { immediate: true })

// 提交逻辑：保留原有所有代码，无修改
const handleSubmit = async () => {
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 二次确认
  try {
    await ElMessageBox.confirm(
      '确认提交工会经费缓缴申请？提交后将无法修改',
      '提交确认',
      {
        confirmButtonText: '确认提交',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    ElMessage.info('已取消提交')
    return
  }

  loading.value = true
  try {

    await WfJfhjSqApi.createWfJfhjSq(formData)
    ElMessage.success('申请提交成功！')
    router.push('/task/my')
    formRef.value?.resetFields()
  } catch (e) {
    console.error('提交失败：', e)
    ElMessage.error('提交失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.apply-form-container {
  max-width: 900px;
  /* 保留原900px最大宽度 */
  margin: 20px auto;
  padding: 0 20px;
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.title {
  color: #1890ff;
}

/* 缓缴期限样式：微调适配900px，消除冗余间距 */
.period-form-item {
  margin-bottom: 10px !important;
}

.period-row {
  align-items: center;
  width: 100%;
}

.period-item {
  display: flex;
  align-items: center;
  width: 100%;
  height: 42px;
  padding: 0 5px;
  justify-content: flex-start;
}

.label-text {
  color: #303133;
  font-size: 14px;
  white-space: nowrap;
  font-weight: 500;
}

.month-text {
  color: #303133;
  font-size: 14px;
  white-space: nowrap;
}

.mt-3 {
  margin-top: 15px !important;
}

.mr-2 {
  margin-right: 8px;
}

/* 优化输入框/数字输入框样式，适配900px布局 */
:deep(.el-date-picker) {
  padding: 2px 0;
  width: 100% !important;
}

:deep(.el-input-number) {
  --el-input-number-input-width: 100%;
}

:deep(.el-form-item__content) {
  line-height: normal;
  padding: 0;
}

:deep(.el-form-item__label) {
  padding-right: 15px;
}

/* 突出禁用输入框，用户易识别 */
:deep(.el-input-number.is-disabled) {
  --el-input-bg-color: #f5f7fa !important;
}

/* 响应式适配：保留原有，微调适配900px */
@media (max-width: 992px) {
  .period-row {
    flex-wrap: wrap;
  }

  .period-row>.el-col {
    margin-bottom: 10px;
    flex: 0 0 100%;
    max-width: 100%;
  }
}
</style>