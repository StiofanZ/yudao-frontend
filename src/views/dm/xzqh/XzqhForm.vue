<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="行政区划名称" prop="xzqhmc">
        <el-input v-model="formData.xzqhmc" placeholder="请输入行政区划名称" />
      </el-form-item>
      <el-form-item label="上级行政区划代码" prop="sjxzqhDm">
        <el-tree-select
          v-model="formData.sjxzqhDm"
          :data="xzqhTree"
          :props="{ ...defaultProps, label: 'xzqhmc' }"
          check-strictly
          default-expand-all
          placeholder="请选择上级行政区划代码"
        />
      </el-form-item>
      <el-form-item label="行政区划级别" prop="xzqhjb">
        <el-input v-model="formData.xzqhjb" placeholder="请输入行政区划级别" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { XzqhApi, Xzqh } from '@/api/dm/xzqh'
import { defaultProps, handleTree } from '@/utils/tree'

/** 行政区划 表单 */
defineOptions({ name: 'XzqhForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  xzqhDm: undefined,
  xzqhmc: undefined,
  sjxzqhDm: undefined,
  xzqhjb: undefined
})
const formRules = reactive({
  xzqhmc: [{ required: true, message: '行政区划名称不能为空', trigger: 'blur' }],
  sjxzqhDm: [{ required: true, message: '上级行政区划代码不能为空', trigger: 'blur' }],
  xzqhjb: [{ required: true, message: '行政区划级别不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const xzqhTree = ref() // 树形结构

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
      formData.value = await XzqhApi.getXzqh(id)
    } finally {
      formLoading.value = false
    }
  }
  await getXzqhTree()
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
    const data = formData.value as unknown as Xzqh
    if (formType.value === 'create') {
      await XzqhApi.createXzqh(data)
      message.success(t('common.createSuccess'))
    } else {
      await XzqhApi.updateXzqh(data)
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
    xzqhDm: undefined,
    xzqhmc: undefined,
    sjxzqhDm: undefined,
    xzqhjb: undefined
  }
  formRef.value?.resetFields()
}

/** 获得行政区划树 */
const getXzqhTree = async () => {
  xzqhTree.value = []
  const data = await XzqhApi.getXzqhList({})
  const root: Tree = { id: 0, name: '顶级行政区划', children: [] }
  root.children = handleTree(data, 'id', 'sjxzqhDm')
  xzqhTree.value.push(root)
}
</script>
