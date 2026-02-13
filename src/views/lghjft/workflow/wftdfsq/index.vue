<template>
  <div class="apply-form-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">工会经费退抵费申请表</span>
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules" label-width="140px" label-position="left" size="default"
        clearable>
        <!-- 基本信息 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社会信用代码" prop="shxydm">
              <el-input v-model="formData.shxydm" maxlength="50" show-word-limit placeholder="请输入18位社会信用代码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人名称" prop="nsrmc">
              <el-input v-model="formData.nsrmc" maxlength="100" placeholder='请输入纳税人名称' clearable />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 情况说明 -->
        <el-form-item label="情况说明" prop="situationDesc">
          <el-input v-model="formData.situationDesc" type="textarea" :rows="4" placeholder="请详细说明申请退还原因" clearable
            maxlength="200" show-word-limit />
        </el-form-item>
        <!-- <el-col :span="12">
            <el-form-item label="单位负责人" prop="unitLeader">
              <el-input v-model="formData.unitLeader" maxlength="50" placeholder="请输入单位负责人" disabled />
            </el-form-item>
          </el-col> -->
        <!-- <el-col :span="12">
            <el-form-item label="经办人" prop="handler">
              <el-input v-model="formData.handler" maxlength="50" placeholder="请输入经办人" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="formData.contactPhone" maxlength="20" placeholder="请输入联系电话（手机/座机）" clearable />
            </el-form-item>
          </el-col> -->
        <!-- <el-col :span="12">
            <el-form-item label="申请日期" prop="applyDate">
              <el-date-picker v-model="formData.applyDate" type="date" placeholder="请选择申请日期" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
          </el-col> -->
        <!-- </el-row> -->
        <!-- 账户信息 -->
        <h3 class="section-title">退款账户信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="户名" prop="accountName">
              <el-input v-model="formData.accountName" maxlength="100" placeholder="请输入账户户名（与开户行一致）" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行名称" prop="bankName">
              <el-input v-model="formData.bankName" maxlength="100" placeholder="请输入开户行全称（如：中国工商银行XX支行）" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="accountNo">
              <el-input v-model="formData.accountNo" maxlength="50" placeholder="请输入银行账号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行行号" prop="bankCode">
              <el-input v-model="formData.bankCode" maxlength="20" placeholder="请输入开户行行号" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 附件上传 -->
        <h3 class="section-title">附列资料（点击上传）</h3>
        <AttachmentSelector v-model="formData.attachments" />

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
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import AttachmentSelector from './AttachmentSelector.vue'
// 修复：修正API导入路径，匹配实际unionRefundApply.ts文件
import { createApply, ApplyRefundReqVO } from '@/api/lghjft/workflow/wftdfsq/index'
import router from '@/router'
const formData = reactive({
  situationDesc: '',
  shxydm: '',
  nsrmc: '',
  unitLeader: '',
  handler: '',
  contactPhone: '',
  accountName: '',
  bankName: '',
  applyDate: '', // 改为空值，由用户选择
  accountNo: '',
  bankCode: '',
  attachments: [] as { type: string; fileUrl: string }[]
})

// 基础校验规则
const rules = reactive({
  // 社会信用代码：必填 + 18位格式校验
  shxydm: [
    { required: true, message: '请输入社会信用代码', trigger: 'blur' },
    { pattern: /^[0-9A-Z]{18}$/, message: '社会信用代码应为18位数字/大写字母', trigger: 'blur' }
  ],
  // 纳税人名称：必填 + 长度限制
  nsrmc: [
    { required: true, message: '请输入纳税人名称', trigger: 'blur' },
    { min: 2, max: 100, message: '纳税人名称长度应在2-100个字符之间', trigger: 'blur' }
  ],
  // 情况说明：必填 + 最小长度
  situationDesc: [
    { required: true, message: '请输入退抵费情况说明', trigger: 'blur' },
    { min: 10, message: '情况说明至少填写10个字符', trigger: 'blur' }
  ],
  // 经办人：必填
  handler: [
    { required: true, message: '请输入经办人', trigger: 'blur' },
    { min: 2, max: 50, message: '姓名长度应在2-50个字符之间', trigger: 'blur' }
  ],
  // 联系电话：必填 + 手机号/座机格式
  contactPhone: [
    { required: true, message: '请输入联系电话', trigger: 'blur' },
    { pattern: /^(0\d{2,3}-\d{7,8})|(1[3-9]\d{9})$/, message: '请输入有效的手机号或座机号（座机格式：0XX-XXXXXXX）', trigger: 'blur' }
  ],
  // 申请日期：必填
  applyDate: [
    { required: true, message: '请选择申请日期', trigger: 'change' }
  ],
  // 账户户名：必填
  accountName: [
    { required: true, message: '请输入退款账户户名', trigger: 'blur' },
    { min: 2, max: 100, message: '户名长度应在2-100个字符之间', trigger: 'blur' }
  ],
  // 开户行名称：必填
  bankName: [
    { required: true, message: '请输入开户行名称', trigger: 'blur' },
    { min: 5, message: '开户行名称至少填写5个字符（如：中国工商银行XX支行）', trigger: 'blur' }
  ],
  // 银行账号：必填 + 数字格式
  accountNo: [
    { required: true, message: '请输入银行账号', trigger: 'blur' },
    { pattern: /^\d{8,30}$/, message: '银行账号应为8-30位数字', trigger: 'blur' }
  ],
  // 开户行行号：选填，填了则校验格式
  bankCode: [
    { pattern: /^\d{0}$|^\d{12}$/, message: '开户行行号应为12位数字', trigger: 'blur' }
  ]
})

const formRef = ref()
const loading = ref(false)
const handleSubmit = async () => {
  // 仅保留表单基础校验（原有逻辑，无修改）
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  // 新增：二次确认提醒（格式完全模仿参考代码）
  try {
    await ElMessageBox.confirm(
      '确认提交工会经费退（抵）费申请？提交后将无法修改',
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

  // 以下原有逻辑，一字未改全部保留
  loading.value = true
  try {
    // 严谨的TS类型断言，避免字段细微差异导致的类型错误
    await createApply(formData as unknown as ApplyRefundReqVO)
    console.log(formData);
    ElMessage.success('申请提交成功！')
    router.push('/task/my')
  } catch (e) {
    console.error('申请提交失败：', e)
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
}

.card-header {
  font-size: 18px;
  font-weight: bold;
}

.title {
  color: #1890ff;
}

.section-title {
  margin: 24px 0 16px;
  font-size: 16px;
  color: #303133;
  font-weight: bold;
}
</style>