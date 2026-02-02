<template>
  <div class="apply-form-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">工会经费退还申请表</span>
        </div>
      </template>

      <el-form ref="formRef" :model="formData" :rules="rules" label-width="140px" label-position="left" size="default">
        <!-- 基本信息 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="社会信用代码" prop="shxydm">
              <el-input v-model="formData.shxydm" maxlength="50" show-word-limit />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="纳税人名称" prop="nsrmc">
              <el-input v-model="formData.nsrmc" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 情况说明 -->
        <el-form-item label="情况说明" prop="situationDesc">
          <el-input v-model="formData.situationDesc" type="textarea" :rows="3" placeholder="请详细说明申请退还原因" />
        </el-form-item>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="单位负责人" prop="unitLeader">
              <el-input v-model="formData.unitLeader" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人" prop="handler">
              <el-input v-model="formData.handler" maxlength="50" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="联系电话" prop="contactPhone">
              <el-input v-model="formData.contactPhone" maxlength="20" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请日期" prop="applyDate" required>
              <el-date-picker v-model="formData.applyDate" type="date" placeholder="请选择申请日期" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 账户信息 -->
        <h3 class="section-title">退款账户信息</h3>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="户名" prop="accountName">
              <el-input v-model="formData.accountName" maxlength="100" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行名称" prop="bankName">
              <el-input v-model="formData.bankName" maxlength="100" />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="账号" prop="accountNo">
              <el-input v-model="formData.accountNo" maxlength="50" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户行行号" prop="bankCode">
              <el-input v-model="formData.bankCode" maxlength="20" placeholder="非必填" />
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
  applyDate: new Date().toISOString().split('T')[0], // 初始化当日日期
  accountNo: '',
  bankCode: '',
  attachments: [] as { type: string; fileUrl: string }[]
})

const rules = {
  situationDesc: [{ required: true, message: '请输入情况说明', trigger: 'blur' }],
  shxydm: [{ required: true, message: '请输入社会信用代码', trigger: 'blur' }],
  nsrmc: [{ required: true, message: '请输入纳税人名称', trigger: 'blur' }],
  accountName: [{ required: true, message: '请输入户名', trigger: 'blur' }],
  bankName: [{ required: true, message: '请输入开户行名称', trigger: 'blur' }],
  accountNo: [{ required: true, message: '请输入账号', trigger: 'blur' }],
  applyDate: [{ required: true, message: '请选择申请日期', trigger: 'change' }]
}

const formRef = ref()
const loading = ref(false)

const handleSubmit = async () => {
  // 移除【三类附件必须上传】的强制校验逻辑，附件可选择不上传

  // 仅保留表单基础校验
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

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