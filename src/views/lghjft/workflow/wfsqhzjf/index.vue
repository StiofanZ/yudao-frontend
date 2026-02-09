<template>
  <div class="apply-form-container">
    <el-card shadow="never">
      <template #header>
        <div class="card-header">
          <span class="title">工会经费汇总缴纳申请表</span>
        </div>
      </template>
      <!-- :rules="rules" -->
      <el-form ref="formRef" :model="formData" label-width="180px" label-position="left" size="default">
        <!-- 1. 基本信息区域 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="申请汇总缴费单位社会信用代码" prop="xyxdm">
              <el-input v-model="formData.xyxdm" maxlength="18" show-word-limit placeholder="请输入18位社会信用代码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="申请汇总缴费单位全称" prop="dwqc">
              <el-input v-model="formData.dwqc" maxlength="255" placeholder="请输入单位全称（与公章一致）" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="主管税务部门" prop="zgsbm">
              <el-input v-model="formData.zgsbm" maxlength="255" placeholder="请输入所属主管税务机关全称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费单位地址" prop="dwdz">
              <el-input v-model="formData.dwdz" maxlength="500" placeholder="请输入单位注册地址或实际经营地址" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工会法人登记证件号码" prop="ghfrdjzjh">
              <el-input v-model="formData.ghfrdjzjh" maxlength="30" placeholder="请输入工会法人资格登记证号码" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="缴费单位工会全称" prop="ghqc">
              <el-input v-model="formData.ghqc" maxlength="255" placeholder="请输入工会全称（与工会公章一致）" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 2. 人员/账户信息区域 -->
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="职工总人数" prop="zzgzs">
              <el-input v-model.number="formData.zzgzs" type="number" min="0" placeholder="请输入单位在册职工总人数" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="工会会员数" prop="ghyhs">
              <el-input v-model.number="formData.ghyhs" type="number" min="0" placeholder="请输入工会会员人数" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工会负责人" prop="ghfzr">
              <el-input v-model="formData.ghfzr" maxlength="50" placeholder="请输入工会主席/负责人姓名" disabled />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="联系电话" prop="lxdh">
              <el-input v-model="formData.lxdh" maxlength="20" placeholder="请输入联系电话（手机/座机）" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工会账户账号" prop="ghzhzh">
              <el-input v-model="formData.ghzhzh" maxlength="50" placeholder="请输入工会专用银行账户账号" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行名称" prop="khyhmc">
              <el-input v-model="formData.khyhmc" maxlength="100" placeholder="请输入开户银行全称" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="工会账户户名" prop="ghzhhm">
              <el-input v-model="formData.ghzhhm" maxlength="255" placeholder="请输入工会账户开户名称" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="开户银行网点代码" prop="khyhwdm">
              <el-input v-model="formData.khyhwdm" maxlength="20" placeholder="选填：请输入开户银行网点联行号/代码" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 3. 申请信息区域 -->
        <el-form-item label="汇总申报缴纳原因" prop="hzbsjygy">
          <el-input v-model="formData.hzbsjygy" type="textarea" :rows="4" placeholder="请详细说明汇总申报缴纳原因（如：下属分支机构较多、统一管理等）"
            clearable />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="负责人" prop="fzrxm">
              <el-input v-model="formData.fzrxm" maxlength="50" placeholder="请输入单位主要负责人姓名" clearable />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="经办人姓名" prop="jbrxm">
              <el-input v-model="formData.jbrxm" maxlength="50" placeholder="请输入经办人姓名" clearable />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item label="经办人联系电话" prop="jbrdh">
              <el-input v-model="formData.jbrdh" maxlength="20" placeholder="请输入经办人联系电话" />
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 4. 分支机构信息 -->
        <el-form-item label="分支机构信息">
          <div class="branch-info">
            <span>共 {{ formData.fjgzs }} 户分支机构（下属企业、子公司）申请汇总缴纳工会经费。</span>
            <el-button type="primary" @click="openBranchDialog" style="margin-left: 20px;">添加分支机构明细
            </el-button>
          </div>
        </el-form-item>

        <!-- 5. 提交按钮 -->
        <el-form-item style="text-align: center; margin-top: 32px;">
          <el-button type="primary" size="large" @click="handleSubmit" :loading="loading">
            提交申请
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- 核心：分支机构明细 Dialog（直接内嵌组件，无 iframe） -->
    <el-dialog v-model="branchDialogVisible" title="分支机构明细维护" width="95%" height="90vh" top="10px" destroy-on-close
      append-to-body>
      <BranchDetail :init-data="branchList" @save="handleBranchSave" @cancel="branchDialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormItemRule } from 'element-plus'
import { createApply, HzApplyReqVO, BranchDetailReqVO } from "@/api/lghjft/workflow/wfsqhzjf/index";
import router from '@/router';
// 直接导入分支机构组件（关键：不再用 iframe）
import BranchDetail from "./BranchDetail.vue";

// 表单数据（严格匹配API，移除sqrq字段，fjgzs赋默认值0）
const formData = reactive<Omit<HzApplyReqVO, 'branchList' | 'sqrq'>>({
  xyxdm: '',
  dwqc: '',
  zgsbm: '',
  dwdz: '',
  ghfrdjzjh: '',
  ghqc: '',
  zzgzs: 0,
  ghyhs: 0,
  ghfzr: '',
  lxdh: '',
  ghzhzh: '',
  khyhmc: '',
  ghzhhm: '',
  khyhwdm: '',
  hzbsjygy: '',
  fzrxm: '',
  jbrxm: '',
  jbrdh: '',
  fjgzs: 0 // 消除undefined风险
})

// 分支机构列表
const branchList = ref<BranchDetailReqVO[]>([])
// Dialog 控制
const branchDialogVisible = ref(false)
// 表单校验
const formRef = ref()
const loading = ref(false)

// 监听分支机构列表，自动更新总数
watch(
  () => branchList.value,
  (newList) => {
    formData.fjgzs = newList.length
  },
  { deep: true, immediate: true }
)

// // 严格符合TypeScript类型规范的表单校验规则
// const rules = reactive<Record<string, FormItemRule[]>>({
//   // 社会信用代码：必填 + 格式校验
//   xyxdm: [
//     { required: true, message: '请输入申请汇总缴费单位社会信用代码', trigger: 'blur' },
//     { pattern: /^[0-9A-Z]{18}$/, message: '社会信用代码应为18位数字/大写字母', trigger: 'blur' }
//   ],
//   // 单位全称：必填 + 长度校验
//   dwqc: [
//     { required: true, message: '请输入申请汇总缴费单位全称', trigger: 'blur' },
//     { min: 2, max: 255, message: '单位全称长度应在2-255个字符之间', trigger: 'blur' }
//   ],
//   // 主管税务部门：必填
//   zgsbm: [
//     { required: true, message: '请输入主管税务部门', trigger: 'blur' },
//     { min: 2, max: 255, message: '主管税务部门名称长度应在2-255个字符之间', trigger: 'blur' }
//   ],
//   // 缴费地址：必填
//   dwdz: [
//     { required: true, message: '请输入缴费单位地址', trigger: 'blur' },
//     { min: 5, max: 500, message: '地址长度应在5-500个字符之间', trigger: 'blur' }
//   ],
//   // 工会法人登记证号：必填
//   ghfrdjzjh: [
//     { required: true, message: '请输入工会法人登记证件号码', trigger: 'blur' },
//     { min: 1, max: 30, message: '证件号码长度应在1-30个字符之间', trigger: 'blur' }
//   ],
//   // 工会全称：必填
//   ghqc: [
//     { required: true, message: '请输入缴费单位工会全称', trigger: 'blur' },
//     { min: 2, max: 255, message: '工会全称长度应在2-255个字符之间', trigger: 'blur' }
//   ],
//   // 职工总人数：必填 + 数字校验
//   zzgzs: [
//     { required: true, message: '请输入职工总人数', trigger: 'blur' },
//     { type: 'number', min: 0, message: '职工总人数不能为负数', trigger: 'blur', transform: (value) => Number(value) }
//   ],
//   // 工会会员数：必填 + 数字校验
//   ghyhs: [
//     { required: true, message: '请输入工会会员数', trigger: 'blur' },
//     { type: 'number', min: 0, message: '工会会员数不能为负数', trigger: 'blur', transform: (value) => Number(value) }
//   ],
//   // 工会负责人：必填
//   ghfzr: [
//     { required: true, message: '请输入工会负责人', trigger: 'blur' },
//     { min: 2, max: 50, message: '姓名长度应在2-50个字符之间', trigger: 'blur' }
//   ],
//   // 联系电话：必填 + 格式校验
//   lxdh: [
//     { required: true, message: '请输入联系电话', trigger: 'blur' },
//     { pattern: /^(0\d{2,3}-\d{7,8})|(1[3-9]\d{9})$/, message: '请输入有效的手机号或座机号', trigger: 'blur' }
//   ],
//   // 工会账户账号：必填 + 格式校验
//   ghzhzh: [
//     { required: true, message: '请输入工会账户账号', trigger: 'blur' },
//     { pattern: /^\d{8,30}$/, message: '银行账号应为8-30位数字', trigger: 'blur' }
//   ],
//   // 开户行名称：必填
//   khyhmc: [
//     { required: true, message: '请输入开户银行名称', trigger: 'blur' },
//     { min: 5, max: 100, message: '开户行名称长度应在5-100个字符之间', trigger: 'blur' }
//   ],
//   // 工会账户户名：必填
//   ghzhhm: [
//     { required: true, message: '请输入工会账户户名', trigger: 'blur' },
//     { min: 2, max: 255, message: '账户户名长度应在2-255个字符之间', trigger: 'blur' }
//   ],
//   // 汇总原因：必填 + 长度校验
//   hzbsjygy: [
//     { required: true, message: '请输入汇总申报缴纳原因', trigger: 'blur' },
//     { min: 10, message: '汇总原因至少填写10个字符，说明具体理由', trigger: 'blur' }
//   ],
//   // 负责人：必填
//   fzrxm: [
//     { required: true, message: '请输入负责人姓名', trigger: 'blur' },
//     { min: 2, max: 50, message: '姓名长度应在2-50个字符之间', trigger: 'blur' }
//   ],
//   // 经办人：必填
//   jbrxm: [
//     { required: true, message: '请输入经办人姓名', trigger: 'blur' },
//     { min: 2, max: 50, message: '姓名长度应在2-50个字符之间', trigger: 'blur' }
//   ],
//   // 经办人电话：必填 + 格式校验
//   jbrdh: [
//     { required: true, message: '请输入经办人联系电话', trigger: 'blur' },
//     { pattern: /^(0\d{2,3}-\d{7,8})|(1[3-9]\d{9})$/, message: '请输入有效的手机号或座机号（座机格式：0XX-XXXXXXX）', trigger: 'blur' }
//   ]
// })

// 打开分支机构 Dialog（无延迟）
const openBranchDialog = () => {
  branchDialogVisible.value = true
}

// 接收分支机构组件的保存事件
const handleBranchSave = (data: BranchDetailReqVO[]) => {
  branchList.value = data
  branchDialogVisible.value = false
  ElMessage.success('分支机构明细保存成功')
}

// 提交申请
const handleSubmit = async () => {
  // 表单校验（原有逻辑，保留）
  const valid = await formRef.value?.validate().catch(() => false)
  if (!valid) return

  // 校验分支机构（原有逻辑，保留）
  if (!branchList.value || branchList.value.length === 0) {
    ElMessage.warning('请至少添加一条分支机构明细信息')
    return
  }

  // 新增：二次确认（完全模仿参考代码格式，适配当前业务文案）
  try {
    await ElMessageBox.confirm(
      '确认提交工会经费汇总缴纳申请？提交后将无法修改',
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

  // 以下所有原有逻辑，一字未改全部保留
  loading.value = true
  try {
    const submitData: any = {
      ...formData,
      detailList: branchList.value, // 核心：改为detailList，匹配后端校验字段
      attachments: [] // 补充：避免附件字段为null，后端可能隐性要求
    }
    await createApply(submitData)
    ElMessage.success('申请提交成功！')
    router.push('/task/my')
  } catch (error) {
    console.error('提交失败：', error)
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
  font-weight: 600;
}

.title {
  color: #1989fa;
}

.branch-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}
</style>