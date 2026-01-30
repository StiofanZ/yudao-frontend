<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="登录账号ID" prop="dlzhId">
        <el-input-number
          v-model="formData.dlzhId"
          :min="0"
          class="!w-240px"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="登记序号" prop="djxh">
        <el-input v-model="formData.djxh" placeholder="请输入登记序号" />
      </el-form-item>
      <el-form-item label="身份类型" prop="sflx">
        <el-select v-model="formData.sflx" class="!w-240px" placeholder="请选择身份类型">
          <el-option label="基层工会" value="01" />
          <el-option label="缴费单位" value="02" />
          <el-option label="联合工会" value="03" />
          <el-option label="集团工会" value="04" />
          <el-option label="产业系统工会" value="05" />
          <el-option label="县区总工会" value="06" />
          <el-option label="市总工会" value="07" />
          <el-option label="省总工会" value="08" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限类型" prop="qxlx">
        <el-select v-model="formData.qxlx" class="!w-240px" placeholder="请选择权限类型">
          <el-option label="管理员" value="01" />
          <el-option label="一般人" value="02" />
        </el-select>
      </el-form-item>
      <el-form-item label="授权原因" prop="sqyy">
        <el-input-number
          v-model="formData.sqyy"
          :min="0"
          class="!w-240px"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="解绑原因" prop="jbyy">
        <el-input-number
          v-model="formData.jbyy"
          :min="0"
          class="!w-240px"
          controls-position="right"
        />
      </el-form-item>
      <el-form-item label="部门编号" prop="deptId">
        <el-input-number
          v-model="formData.deptId"
          :min="0"
          class="!w-240px"
          controls-position="right"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { type Sfxx, SfxxApi } from '@/api/lghjft/qx/sfxx'

defineOptions({ name: 'SfxxForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref<Sfxx>({
  id: undefined,
  dlzhId: undefined,
  djxh: undefined,
  sflx: undefined,
  qxlx: undefined,
  sqyy: 0,
  jbyy: 0,
  deptId: undefined
})
const formRules = reactive({
  dlzhId: [{ required: true, message: '登录账号ID不能为空', trigger: 'blur' }],
  djxh: [{ required: true, message: '登记序号不能为空', trigger: 'blur' }],
  sflx: [{ required: true, message: '身份类型不能为空', trigger: 'change' }],
  qxlx: [{ required: true, message: '权限类型不能为空', trigger: 'change' }]
})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '身份信息'
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SfxxApi.getSfxx(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value
    if (formType.value === 'create') {
      await SfxxApi.createSfxx(data)
      message.success(t('common.createSuccess'))
    } else {
      await SfxxApi.updateSfxx(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    dlzhId: undefined,
    djxh: undefined,
    sflx: undefined,
    qxlx: undefined,
    sqyy: 0,
    jbyy: 0,
    deptId: undefined
  }
  formRef.value?.resetFields()
}
</script>
