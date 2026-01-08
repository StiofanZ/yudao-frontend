<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="工会机构代码" prop="deptId">
        <el-input v-model="formData.deptId" placeholder="请输入工会机构代码" />
      </el-form-item>
      <el-form-item label="备注" prop="bz">
        <el-select v-model="formData.bz" placeholder="请选择备注">
          <el-option
            v-for="dict in getStrDictOptions(DICT_TYPE.SYS_HJFL_GH)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="户籍分类代码" prop="hjflDm">
        <el-input v-model="formData.hjflDm" placeholder="请输入户籍分类代码" />
      </el-form-item>
      <el-form-item label="户籍分类名称" prop="hjflmc">
        <el-input v-model="formData.hjflmc" placeholder="请输入户籍分类名称" />
      </el-form-item>
      <el-form-item label="顺序号" prop="sxh">
        <el-input v-model="formData.sxh" placeholder="请输入顺序号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { HjflApi, Hjfl } from '@/api/dm/hjfl'

/** 户籍分类 表单 */
defineOptions({ name: 'HjflForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  deptId: undefined,
  bz: undefined,
  hjflDm: undefined,
  hjflmc: undefined,
  sxh: undefined,
  hjflid: undefined
})
const formRules = reactive({
  deptId: [{ required: true, message: '工会机构代码不能为空', trigger: 'blur' }],
  bz: [{ required: true, message: '备注不能为空', trigger: 'change' }],
  hjflDm: [{ required: true, message: '户籍分类代码不能为空', trigger: 'blur' }],
  hjflmc: [{ required: true, message: '户籍分类名称不能为空', trigger: 'blur' }]
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
      formData.value = await HjflApi.getHjfl(id)
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
    const data = formData.value as unknown as Hjfl
    if (formType.value === 'create') {
      await HjflApi.createHjfl(data)
      message.success(t('common.createSuccess'))
    } else {
      await HjflApi.updateHjfl(data)
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
    deptId: undefined,
    bz: undefined,
    hjflDm: undefined,
    hjflmc: undefined,
    sxh: undefined,
    hjflid: undefined
  }
  formRef.value?.resetFields()
}
</script>