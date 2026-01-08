<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="类型" prop="lx">
        <el-input v-model="formData.lx" placeholder="请输入类型" />
      </el-form-item>
      <el-form-item label="描述" prop="ms">
        <el-input v-model="formData.ms" placeholder="请输入描述" />
      </el-form-item>
      <el-form-item label="有效期起" prop="yxqq">
        <el-date-picker v-model="formData.yxqq" type="date" value-format="x" placeholder="选择有效期起" />
      </el-form-item>
      <el-form-item label="有效期止" prop="yxqz">
        <el-date-picker v-model="formData.yxqz" type="date" value-format="x" placeholder="选择有效期止" />
      </el-form-item>
      <el-form-item label="有效标志" prop="xybz">
        <el-input v-model="formData.xybz" placeholder="请输入有效标志" />
      </el-form-item>
      <el-form-item label="基层工会比例" prop="jcghbl">
        <el-input v-model="formData.jcghbl" placeholder="请输入基层工会比例" />
      </el-form-item>
      <el-form-item label="行业工会比例" prop="hyghbl">
        <el-input v-model="formData.hyghbl" placeholder="请输入行业工会比例" />
      </el-form-item>
      <el-form-item label="属地工会比例" prop="sdghbl">
        <el-input v-model="formData.sdghbl" placeholder="请输入属地工会比例" />
      </el-form-item>
      <el-form-item label="县级工会比例" prop="xjghbl">
        <el-input v-model="formData.xjghbl" placeholder="请输入县级工会比例" />
      </el-form-item>
      <el-form-item label="市级工会比例" prop="sjghbl">
        <el-input v-model="formData.sjghbl" placeholder="请输入市级工会比例" />
      </el-form-item>
      <el-form-item label="省总工会比例" prop="szghbl">
        <el-input v-model="formData.szghbl" placeholder="请输入省总工会比例" />
      </el-form-item>
      <el-form-item label="全总工会比例" prop="qgzghbl">
        <el-input v-model="formData.qgzghbl" placeholder="请输入全总工会比例" />
      </el-form-item>
      <el-form-item label="省稽查局比例" prop="sjcjbl">
        <el-input v-model="formData.sjcjbl" placeholder="请输入省稽查局比例" />
      </el-form-item>
      <el-form-item label="省税局比例" prop="sdsjbl">
        <el-input v-model="formData.sdsjbl" placeholder="请输入省税局比例" />
      </el-form-item>
      <el-form-item label="主管税务机关比例" prop="swjgbl">
        <el-input v-model="formData.swjgbl" placeholder="请输入主管税务机关比例" />
      </el-form-item>
      <el-form-item label="TJ" prop="tj">
        <el-input v-model="formData.tj" placeholder="请输入TJ" />
      </el-form-item>
      <el-form-item label="YXJ" prop="yxj">
        <el-input v-model="formData.yxj" placeholder="请输入YXJ" />
      </el-form-item>
      <el-form-item label="MRBZ" prop="mrbz">
        <el-input v-model="formData.mrbz" placeholder="请输入MRBZ" />
      </el-form-item>
      <el-form-item label="JYM" prop="jym">
        <el-input v-model="formData.jym" placeholder="请输入JYM" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { FpblCopyApi, FpblCopy } from '@/api/dm/fpblcopy'

/** 分配比例 表单 */
defineOptions({ name: 'FpblCopyForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  blId: undefined,
  bluuid: undefined,
  lx: undefined,
  ms: undefined,
  yxqq: undefined,
  yxqz: undefined,
  xybz: undefined,
  jcghbl: undefined,
  hyghbl: undefined,
  sdghbl: undefined,
  xjghbl: undefined,
  sjghbl: undefined,
  szghbl: undefined,
  qgzghbl: undefined,
  sjcjbl: undefined,
  sdsjbl: undefined,
  swjgbl: undefined,
  tj: undefined,
  yxj: undefined,
  mrbz: undefined,
  jym: undefined
})
const formRules = reactive({
  lx: [{ required: true, message: '类型不能为空', trigger: 'blur' }],
  ms: [{ required: true, message: '描述不能为空', trigger: 'blur' }],
  yxqq: [{ required: true, message: '有效期起不能为空', trigger: 'blur' }],
  yxqz: [{ required: true, message: '有效期止不能为空', trigger: 'blur' }],
  xybz: [{ required: true, message: '有效标志不能为空', trigger: 'blur' }],
  jcghbl: [{ required: true, message: '基层工会比例不能为空', trigger: 'blur' }],
  hyghbl: [{ required: true, message: '行业工会比例不能为空', trigger: 'blur' }],
  sdghbl: [{ required: true, message: '属地工会比例不能为空', trigger: 'blur' }],
  xjghbl: [{ required: true, message: '县级工会比例不能为空', trigger: 'blur' }],
  sjghbl: [{ required: true, message: '市级工会比例不能为空', trigger: 'blur' }],
  szghbl: [{ required: true, message: '省总工会比例不能为空', trigger: 'blur' }],
  qgzghbl: [{ required: true, message: '全总工会比例不能为空', trigger: 'blur' }],
  sjcjbl: [{ required: true, message: '省稽查局比例不能为空', trigger: 'blur' }],
  sdsjbl: [{ required: true, message: '省税局比例不能为空', trigger: 'blur' }],
  swjgbl: [{ required: true, message: '主管税务机关比例不能为空', trigger: 'blur' }],
  tj: [{ required: true, message: 'TJ不能为空', trigger: 'blur' }],
  mrbz: [{ required: true, message: 'MRBZ不能为空', trigger: 'blur' }],
  jym: [{ required: true, message: 'JYM不能为空', trigger: 'blur' }]
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
      formData.value = await FpblCopyApi.getFpblCopy(id)
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
    const data = formData.value as unknown as FpblCopy
    if (formType.value === 'create') {
      await FpblCopyApi.createFpblCopy(data)
      message.success(t('common.createSuccess'))
    } else {
      await FpblCopyApi.updateFpblCopy(data)
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
    blId: undefined,
    bluuid: undefined,
    lx: undefined,
    ms: undefined,
    yxqq: undefined,
    yxqz: undefined,
    xybz: undefined,
    jcghbl: undefined,
    hyghbl: undefined,
    sdghbl: undefined,
    xjghbl: undefined,
    sjghbl: undefined,
    szghbl: undefined,
    qgzghbl: undefined,
    sjcjbl: undefined,
    sdsjbl: undefined,
    swjgbl: undefined,
    tj: undefined,
    yxj: undefined,
    mrbz: undefined,
    jym: undefined
  }
  formRef.value?.resetFields()
}
</script>