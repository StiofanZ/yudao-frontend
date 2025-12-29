<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="退费申请明细ID" prop="tfsqmxId">
        <el-input v-model="formData.tfsqmxId" placeholder="请输入退费申请明细ID" />
      </el-form-item>
      <el-form-item label="申请退费类型代码" prop="sqtflxDm">
        <el-input v-model="formData.sqtflxDm" placeholder="请输入申请退费类型代码" />
      </el-form-item>
      <el-form-item label="流程实例的编号" prop="processInstanceId">
        <el-input v-model="formData.processInstanceId" placeholder="请输入流程实例的编号" />
      </el-form-item>
      <el-form-item label="审批结果" prop="status">
        <el-radio-group v-model="formData.status">
          <el-radio value="1">请选择字典生成</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <!-- 子表的表单 -->
    <el-tabs v-model="subTabsName">
      <el-tab-pane label="申请-退费申请明细" name="wfSqTfsqmx">
        <WfSqTfsqmxForm ref="wfSqTfsqmxFormRef" :id="formData.id" />
      </el-tab-pane>
    </el-tabs>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { WfSqTfsqApi, WfSqTfsq } from '@/api/lghjft/wfsqtfsq'
import WfSqTfsqmxForm from './components/WfSqTfsqmxForm.vue'

/** 申请-退费申请 表单 */
defineOptions({ name: 'WfSqTfsqForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  tfsqmxId: undefined,
  sqtflxDm: undefined,
  processInstanceId: undefined,
  status: undefined
})
const formRules = reactive({
  tfsqmxId: [{ required: true, message: '退费申请明细ID不能为空', trigger: 'blur' }],
  sqtflxDm: [{ required: true, message: '申请退费类型代码不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '审批结果不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 子表的表单 */
const subTabsName = ref('wfSqTfsqmx')
const wfSqTfsqmxFormRef = ref()

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await WfSqTfsqApi.getWfSqTfsq(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 校验子表单
  try {
    await wfSqTfsqmxFormRef.value.validate()
  } catch (e) {
    subTabsName.value = 'wfSqTfsqmx'
    return
  }
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as WfSqTfsq
    // 拼接子表的数据
    data.wfsqtfsqmxs = wfSqTfsqmxFormRef.value.getData()
    if (formType.value === 'create') {
      await WfSqTfsqApi.createWfSqTfsq(data)
      message.success(t('common.createSuccess'))
    } else {
      await WfSqTfsqApi.updateWfSqTfsq(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    tfsqmxId: undefined,
    sqtflxDm: undefined,
    processInstanceId: undefined,
    status: undefined
  }
  formRef.value?.resetFields()
}
</script>
