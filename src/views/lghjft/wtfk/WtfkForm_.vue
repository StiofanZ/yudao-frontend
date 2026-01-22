<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible" width="600px">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-position="top"
      v-loading="formLoading"
      style="padding: 0 20px;"
    >
      <el-row :gutter="20">
        <el-col :span="24">
          <el-form-item label="反馈类型" prop="type">
            <el-radio-group v-model="formData.type" style="width: 100%;">
              <el-row :gutter="10" style="width: 100%;">
                <el-col :span="6">
                  <el-radio label="1" border style="width: 100%; margin-right: 0;">功能建议</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="2" border style="width: 100%; margin-right: 0;">操作问题</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="3" border style="width: 100%; margin-right: 0;">系统问题</el-radio>
                </el-col>
                <el-col :span="6">
                  <el-radio label="4" border style="width: 100%; margin-right: 0;">其他问题</el-radio>
                </el-col>
              </el-row>
            </el-radio-group>
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="联系电话" prop="contactPhone">
            <el-input
              v-model="formData.contactPhone"
              placeholder="请输入联系电话"
              style="width: 280px"
            />
          </el-form-item>
        </el-col>

        <el-col :span="24">
          <el-form-item label="反馈内容" prop="content">
            <Editor v-model="formData.content" height="200px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>


<script setup lang="ts">
import { WtfkApi, type WtfkVO } from '@/api/lghjft/wtfk'

/** 工会经费通-问题反馈 表单 */
defineOptions({ name: 'WtfkForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref<Partial<WtfkVO>>({
  id: undefined,
  type: undefined,
  content: undefined,
  platformName: undefined,
  contactPhone: undefined,
  contactEmail: undefined,
  status: 0, //默认0 未处理
  processorId: undefined,
  processTime: undefined
})
const formRules = reactive({
  type: [{ required: true, message: '反馈类型：功能异常 体验建议 其他问题不能为空', trigger: 'change' }],
  content: [{ required: true, message: '反馈内容不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

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
      formData.value = await WtfkApi.getWtfk(id)
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
    formData.value.platformName = '网页端' //手动改动平台名
    const data = formData.value as unknown as WtfkVO
    if (formType.value === 'create') {
      await WtfkApi.createWtfk(data)
      message.success(t('common.createSuccess'))
    } else {
      await WtfkApi.updateWtfk(data)
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
    userId: undefined,
    userName: undefined,
    type: undefined,
    content: undefined,
    contactPhone: undefined,
    contactEmail: undefined,
    status:0,
    processorId: undefined,
    processTime: undefined,
    processNotes: undefined,
    platformName: '网页端'  //健壮性
  }
  formRef.value?.resetFields()
}
</script>

