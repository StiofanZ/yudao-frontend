<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="税款国库代码" prop="skgkDm">
        <el-input v-model="formData.skgkDm" placeholder="请输入税款国库代码" />
      </el-form-item>
      <el-form-item label="税款国库名称" prop="skgkmc">
        <el-input v-model="formData.skgkmc" placeholder="请输入税款国库名称" />
      </el-form-item>
      <el-form-item label="税款国库简称" prop="skgkjc">
        <el-input v-model="formData.skgkjc" placeholder="请输入税款国库简称" />
      </el-form-item>
      <el-form-item label="行政区划代码" prop="xzqhDm">
        <el-input v-model="formData.xzqhDm" placeholder="请输入行政区划代码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { SkgkApi, Skgk } from '@/api/dm/skgk'

/** 收款国库 表单 */
defineOptions({ name: 'SkgkForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  gkId: undefined,
  skgkDm: undefined,
  skgkmc: undefined,
  skgkjc: undefined,
  xzqhDm: undefined
})
const formRules = reactive({
  skgkDm: [{ required: true, message: '税款国库代码不能为空', trigger: 'blur' }],
  skgkmc: [{ required: true, message: '税款国库名称不能为空', trigger: 'blur' }],
  skgkjc: [{ required: true, message: '税款国库简称不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '收款国库'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SkgkApi.getSkgk(id)
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
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as Skgk
    if (formType.value === 'create') {
      await SkgkApi.createSkgk(data)
      message.success(t('common.createSuccess'))
    } else {
      await SkgkApi.updateSkgk(data)
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
    gkId: undefined,
    skgkDm: undefined,
    skgkmc: undefined,
    skgkjc: undefined,
    xzqhDm: undefined
  }
  formRef.value?.resetFields()
}
</script>