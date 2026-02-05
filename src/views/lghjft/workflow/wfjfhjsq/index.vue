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
              <el-input v-model="formData.shxydm" maxlength="18" show-word-limit placeholder="请输入18位社会信用代码" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费单位名称" prop="nsrmc">
              <el-input v-model="formData.nsrmc" maxlength="100" show-word-limit placeholder="请输入单位全称（与公章一致）" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系人及电话" prop="contactPhone">
              <el-input v-model="formData.contactPhone" maxlength="50" placeholder="请输入联系人姓名+电话（如：张三 13800138000）" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="适用费率（%）" prop="applicableRate">
              <el-input-number v-model="formData.applicableRate" :precision="2" :min="0" :max="2" :step="0.01"
                class="w-full" controls-position="right" placeholder="如：0.8" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="8">
            <el-form-item label="职工人数（人）" prop="employeeCount">
              <el-input-number v-model="formData.employeeCount" :min="1" :step="1" class="w-full"
                controls-position="right" placeholder="请输入在册职工总人数" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="月工资总额（元）" prop="monthlySalaryTotal">
              <el-input-number v-model="formData.monthlySalaryTotal" :precision="2" :min="0.01" :step="0.01"
                class="w-full" controls-position="right" placeholder="请输入月工资总额（保留2位小数）" />
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="月拨缴金额（元）" prop="monthlyPayAmount">
              <el-input-number v-model="formData.monthlyPayAmount" :precision="2" :min="0" class="w-full"
                controls-position="right" placeholder="系统自动计算，无需手动输入" disabled />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 缓缴期限：最终优化布局 -->
        <el-form-item label="申请缓缴期限" class="period-form-item" prop="deferPeriod">
          <!-- 第一行：开始年月 + 结束年月 + 共X月 -->
          <el-row :gutter="20" class="period-row">
            <el-col :span="7">
              <div class="period-item">
                <el-date-picker v-model="formData.deferStartDate" type="month" placeholder="请选择缓缴开始年月"
                  format="YYYY 年 MM 月" value-format="YYYY-MM" style="width: 100%;" size="default" />
              </div>
            </el-col>
            <el-col :span="7">
              <div class="period-item">
                <el-date-picker v-model="formData.deferEndDate" type="month" placeholder="请选择缓缴结束年月"
                  format="YYYY 年 MM 月" value-format="YYYY-MM" style="width: 100%;" size="default" />
              </div>
            </el-col>
            <el-col :span="6">
              <div class="period-item">
                <el-input-number v-model="formData.deferTotalMonth" :min="1" :max="24" :step="1" class="w-[70%]"
                  controls-position="right" disabled size="default" placeholder="系统自动计算月数" />
                <span class="month-text ml-2">月</span>
              </div>
            </el-col>
          </el-row>
        </el-form-item>

        <!-- 第二行：累计缓缴金额  -->
        <el-row :gutter="20" class="period-row mt-3">
          <el-col :span="12">
            <div class="period-item">
              <span class="label-text mr-2">累计缓缴金额（元）</span>
              <el-input-number v-model="formData.totalDeferAmount" :precision="2" :min="0.01" :step="0.01"
                class="w-[50%]" controls-position="right" size="default" placeholder="请输入累计缓缴金额（保留2位小数）" />
            </div>
          </el-col>
        </el-row>

        <!-- 情况说明 -->
        <el-form-item label="申请缓缴情况说明" prop="situationDesc" style="margin-top: 14px;">
          <el-input v-model="formData.situationDesc" type="textarea" :rows="6"
            placeholder="请详细说明申请缓缴的原因（如经营困难、资金周转问题等）、目前资金状况、缓缴后还款计划等，字数不少于10字" maxlength="2000" show-word-limit
            style="resize: vertical;" />
        </el-form-item>

        <!-- 提交按钮 -->
        <el-form-item style="text-align: center; margin-top: 32px;">
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

// 表单数据：严格匹配WfJfhjSqSubmit接口
const formData = reactive<WfJfhjSqSubmit>({
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
  situationDesc: ''
})

// 完善的校验规则
const rules = reactive<FormRules>({
  // 社会信用代码：必填 + 格式校验
  shxydm: [
    { required: true, message: '请输入社会信用代码', trigger: 'blur' },
    { pattern: /^[0-9A-Z]{18}$/, message: '社会信用代码应为18位数字/大写字母', trigger: 'blur' }
  ],
  // 单位名称：必填 + 长度校验
  nsrmc: [
    { required: true, message: '请输入缴费单位名称', trigger: 'blur' },
    { min: 2, max: 100, message: '单位名称长度应在2-100个字符之间', trigger: 'blur' }
  ],
  // 联系人及电话：必填 + 格式校验
  contactPhone: [
    { required: true, message: '请输入联系人及电话', trigger: 'blur' },
    { pattern: /^.+(\s+)?1[3-9]\d{9}$/, message: '请输入正确格式（如：张三 13800138000）', trigger: 'blur' }
  ],
  // 适用费率：必填 + 范围校验
  applicableRate: [
    { required: true, message: '请输入适用费率', trigger: 'change' },
    { type: 'number', min: 0.01, max: 2, message: '费率范围应为0.01%-2%', trigger: 'change' }
  ],
  // 职工人数：必填 + 范围校验
  employeeCount: [
    { required: true, message: '请输入职工人数', trigger: 'change' },
    { type: 'number', min: 1, message: '职工人数不能少于1人', trigger: 'change' }
  ],
  // 月工资总额：必填 + 范围校验
  monthlySalaryTotal: [
    { required: true, message: '请输入月工资总额', trigger: 'change' },
    { type: 'number', min: 0.01, message: '月工资总额不能为0', trigger: 'change' }
  ],
  // 缓缴开始时间：必填
  deferStartDate: [
    { required: true, message: '请选择缓缴开始时间', trigger: 'change' }
  ],
  // 缓缴结束时间：必填 + 逻辑校验（自定义）
  deferEndDate: [
    { required: true, message: '请选择缓缴结束时间', trigger: 'change' },
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
  // 缓缴月数：必填 + 范围校验
  deferTotalMonth: [
    { required: true, message: '缓缴月数不能为空', trigger: 'change' },
    { type: 'number', min: 1, max: 24, message: '缓缴月数范围为1-24个月', trigger: 'change' }
  ],
  // 累计缓缴金额：必填 + 范围校验
  totalDeferAmount: [
    { required: true, message: '请输入累计缓缴金额', trigger: 'change' },
    { type: 'number', min: 0.01, message: '累计缓缴金额不能为0', trigger: 'change' }
  ],
  // 情况说明：必填 + 长度校验
  situationDesc: [
    { required: true, message: '请输入申请缓缴情况说明', trigger: 'blur' },
    { min: 10, message: '情况说明至少填写10个字符', trigger: 'blur' }
  ]
})

// 自动计算月拨缴金额
watch([() => formData.applicableRate, () => formData.monthlySalaryTotal], () => {
  if (formData.applicableRate > 0 && formData.monthlySalaryTotal > 0) {
    formData.monthlyPayAmount = Number(((formData.applicableRate / 100) * formData.monthlySalaryTotal).toFixed(2))
  }
})

// 自动计算缓缴月数
watch([() => formData.deferStartDate, () => formData.deferEndDate], () => {
  if (formData.deferStartDate && formData.deferEndDate) {
    const [startYear, startMonth] = formData.deferStartDate.split('-').map(Number)
    const [endYear, endMonth] = formData.deferEndDate.split('-').map(Number)
    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth)
    formData.deferTotalMonth = totalMonths < 1 ? 1 : (totalMonths > 24 ? 24 : totalMonths)
  }
})

// 提交逻辑
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

/* 缓缴期限核心样式 */
.period-form-item {
  margin-bottom: 20px !important;
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
  /* 关键：输入框左对齐 */
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

/* 优化输入框样式 */
:deep(.el-date-picker) {
  padding: 2px 0;
  width: 100% !important;
}

:deep(.el-input-number) {
  --el-input-number-input-width: 100%;
}

/* 消除默认间距，优化对齐 */
:deep(.el-form-item__content) {
  line-height: normal;
  padding: 0;
}

:deep(.el-form-item__label) {
  padding-right: 15px;
}

/* 响应式适配 */
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