<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="银行行别代码" prop="yhhbDm">
        <el-tree-select v-model="formData.yhhbDm" :data="yhwdTree" :props="{ ...defaultProps, label: 'yhwdmc' }"
          check-strictly default-expand-all placeholder="请选择银行行别代码" />
      </el-form-item>
      <el-form-item label="网点代码" prop="yhwdDm">
        <el-input v-model="formData.yhwdDm" placeholder="请输入网点代码" />
      </el-form-item>
      <el-form-item label="网点名称" prop="yhwdmc">
        <el-input v-model="formData.yhwdmc" placeholder="请输入网点名称" />
      </el-form-item>
      <el-form-item label="网点简称" prop="yhwdjc">
        <el-input v-model="formData.yhwdjc" placeholder="请输入网点简称" />
      </el-form-item>
      <el-form-item label="网点行号" prop="wdhh">
        <el-input v-model="formData.wdhh" placeholder="请输入网点行号" />
      </el-form-item>
      <el-form-item label="清算行号" prop="qshh">
        <el-input v-model="formData.qshh" placeholder="请输入清算行号" />
      </el-form-item>
      <el-form-item label="行政区划代码" prop="xzqhDm">
        <el-input v-model="formData.xzqhDm" placeholder="请输入行政区划代码" />
      </el-form-item>
      <el-form-item label="顺序号" prop="sxh">
        <el-input v-model="formData.sxh" placeholder="请输入顺序号" />
      </el-form-item>
      <el-form-item label="有效期止" prop="yxqz">
        <el-date-picker v-model="formData.yxqz" type="date" value-format="x" placeholder="选择有效期止" />
      </el-form-item>
      <el-form-item label="网点地址" prop="wddz">
        <el-input v-model="formData.wddz" placeholder="请输入网点地址" />
      </el-form-item>
      <el-form-item label="网点电话" prop="wddh">
        <el-input v-model="formData.wddh" placeholder="请输入网点电话" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { YhwdApi, Yhwd } from '@/api/dm/yhwd'
import { defaultProps, handleTree } from '@/utils/tree'
import { log } from 'console'

/** 银行网点 表单 */
defineOptions({ name: 'YhwdForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  yhhbDm: undefined,
  yhwdDm: undefined,
  yhwdmc: undefined,
  yhwdjc: undefined,
  wdhh: undefined,
  qshh: undefined,
  xzqhDm: undefined,
  sxh: undefined,
  yxqz: undefined,
  wddz: undefined,
  wddh: undefined,
  yhhbId: undefined
})
const formRules = reactive({
  yhhbDm: [{ required: true, message: '银行行别代码不能为空', trigger: 'blur' }],
  yhwdDm: [{ required: true, message: '网点代码不能为空', trigger: 'blur' }],
  yhwdmc: [{ required: true, message: '网点名称不能为空', trigger: 'blur' }],
  yhwdjc: [{ required: true, message: '网点简称不能为空', trigger: 'blur' }],
  wdhh: [{ required: true, message: '网点行号不能为空', trigger: 'blur' }],
  qshh: [{ required: true, message: '清算行号不能为空', trigger: 'blur' }],
  xzqhDm: [{ required: true, message: '行政区划代码不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const yhwdTree = ref() // 树形结构

/** 打开弹窗 */
const open = async (type: string, yhhbId?: number) => {
  dialogVisible.value = true
  console.log(yhhbId)
  dialogTitle.value = t('action.' + type) + '户籍分类'
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (yhhbId) {
    formLoading.value = true
    try {
      formData.value = await YhwdApi.getYhwd(yhhbId)
    } finally {
      formLoading.value = false
    }
  }
  await getYhwdTree()
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
    const data = formData.value as unknown as Yhwd
    if (formType.value === 'create') {
      await YhwdApi.createYhwd(data)
      message.success(t('common.createSuccess'))
    } else {
      await YhwdApi.updateYhwd(data)
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
    yhhbDm: undefined,
    yhwdDm: undefined,
    yhwdmc: undefined,
    yhwdjc: undefined,
    wdhh: undefined,
    qshh: undefined,
    xzqhDm: undefined,
    sxh: undefined,
    yxqz: undefined,
    wddz: undefined,
    wddh: undefined,
    yhhbId: undefined
  }
  formRef.value?.resetFields()
}

/** 获得银行网点树 */
const getYhwdTree = async () => {
  yhwdTree.value = []
  const data = await YhwdApi.getYhwdPage({})
  const root: Tree = { id: 0, name: '顶级银行网点', children: [] }
  root.children = handleTree(data, 'id', 'yhhbDm')
  yhwdTree.value.push(root)
}
</script>
