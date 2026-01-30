<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="用户账号" prop="yhzh">
        <el-input v-model="formData.yhzh" class="!w-240px" placeholder="请输入用户账号" />
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <InputPassword v-model="formData.password" class="!w-240px" placeholder="请输入密码" />
      </el-form-item>
      <el-form-item label="用户姓名" prop="yhxm">
        <el-input v-model="formData.yhxm" class="!w-240px" placeholder="请输入用户姓名" />
      </el-form-item>
      <el-form-item label="联系电话" prop="lxdh">
        <el-input v-model="formData.lxdh" class="!w-240px" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="用户邮箱" prop="yhyx">
        <el-input v-model="formData.yhyx" class="!w-240px" placeholder="请输入用户邮箱" />
      </el-form-item>
      <el-form-item label="社会信用代码" prop="shxydm">
        <el-input v-model="formData.shxydm" class="!w-240px" placeholder="请输入社会信用代码" />
      </el-form-item>
      <el-form-item label="用户性别" prop="yhxb">
        <el-select v-model="formData.yhxb" class="!w-240px" clearable placeholder="请选择性别">
          <el-option :value="1" label="男" />
          <el-option :value="2" label="女" />
        </el-select>
      </el-form-item>
      <el-form-item label="头像地址" prop="txdz">
        <el-input v-model="formData.txdz" placeholder="请输入头像地址" />
      </el-form-item>
      <el-form-item label="账号状态" prop="status">
        <el-select v-model="formData.status" class="!w-240px" placeholder="请选择账号状态">
          <el-option :value="0" label="正常" />
          <el-option :value="1" label="停用" />
        </el-select>
      </el-form-item>
      <el-form-item label="用户备注" prop="yhbz">
        <el-input v-model="formData.yhbz" :rows="3" placeholder="请输入用户备注" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { type Dlzh, DlzhApi } from '@/api/lghjft/qx/dlzh'
import { InputPassword } from '@/components/InputPassword'

defineOptions({ name: 'DlzhForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref<Dlzh>({
  id: undefined,
  yhzh: undefined,
  password: undefined,
  yhxm: undefined,
  yhbz: undefined,
  lxdh: undefined,
  yhyx: undefined,
  shxydm: undefined,
  yhxb: undefined,
  txdz: undefined,
  status: 0
})

const passwordValidator = (_rule: any, value: string, callback: any) => {
  if (formType.value === 'create' && !value) {
    callback(new Error('密码不能为空'))
    return
  }
  callback()
}

const formRules = reactive({
  yhzh: [{ required: true, message: '用户账号不能为空', trigger: 'blur' }],
  password: [{ validator: passwordValidator, trigger: 'blur' }]
})
const formRef = ref()

const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '登录账号'
  formType.value = type
  resetForm()
  if (id) {
    formLoading.value = true
    try {
      const data = await DlzhApi.getDlzh(id)
      formData.value = { ...data, password: undefined }
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
      await DlzhApi.createDlzh(data)
      message.success(t('common.createSuccess'))
    } else {
      await DlzhApi.updateDlzh(data)
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
    yhzh: undefined,
    password: undefined,
    yhxm: undefined,
    yhbz: undefined,
    lxdh: undefined,
    yhyx: undefined,
    shxydm: undefined,
    yhxb: undefined,
    txdz: undefined,
    status: 0
  }
  formRef.value?.resetFields()
}
</script>
