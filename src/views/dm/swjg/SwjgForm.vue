<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px" v-loading="formLoading">
      <el-form-item label="税务机关名称" prop="swjgmc">
        <el-input v-model="formData.swjgmc" placeholder="请输入税务机关名称" />
      </el-form-item>
      <el-form-item label="税务机关简称" prop="swjgjc">
        <el-input v-model="formData.swjgjc" placeholder="请输入税务机关简称" />
      </el-form-item>
      <el-form-item label="地址" prop="dz">
        <el-input v-model="formData.dz" placeholder="请输入地址" />
      </el-form-item>
      <el-form-item label="邮政编码" prop="yzbm">
        <el-input v-model="formData.yzbm" placeholder="请输入邮政编码" />
      </el-form-item>
      <el-form-item label="联系人" prop="lxr">
        <el-input v-model="formData.lxr" placeholder="请输入联系人" />
      </el-form-item>
      <el-form-item label="联系电话" prop="lxdh">
        <el-input v-model="formData.lxdh" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="手续费账号" prop="sxfzh">
        <el-input v-model="formData.sxfzh" placeholder="请输入手续费账号" />
      </el-form-item>
      <el-form-item label="户名" prop="sxfhm">
        <el-input v-model="formData.sxfhm" placeholder="请输入户名" />
      </el-form-item>
      <el-form-item label="行号" prop="sxfhh">
        <el-input v-model="formData.sxfhh" placeholder="请输入行号" />
      </el-form-item>
      <el-form-item label="银行" prop="sxfyh">
        <el-input v-model="formData.sxfyh" placeholder="请输入银行" />
      </el-form-item>
      <el-form-item label="上级税务机关" prop="sjswjgDm">
        <el-tree-select v-model="formData.sjswjgDm" :data="swjgTree" :props="treeProps" check-strictly
          default-expand-all placeholder="请选择上级税务机关" clearable class="w-full" />
      </el-form-item>

      <el-form-item label="稽查局标记" prop="jcjbj">
        <el-select v-model="formData.jcjbj" placeholder="请选择稽查局标记" style="width: 60%">
          <el-option label="是" value="Y" />
          <el-option label="否" value="N" />
        </el-select>
      </el-form-item>
      <el-form-item label="工会机构代码" prop="ghjgDm">
        <el-input v-model="formData.ghjgDm" placeholder="请输入工会机构代码" />
      </el-form-item>
      <el-form-item label="顺序号" prop="sxh">
        <el-input v-model="formData.sxh" placeholder="请输入顺序号" />
      </el-form-item>
      <el-form-item label="校验码" prop="jym">
        <el-input v-model="formData.jym" placeholder="请输入校验码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { SwjgApi, Swjg } from '@/api/dm/swjg'
import { defaultProps, handleTree } from '@/utils/tree'

/** 税务机关 表单 */
defineOptions({ name: 'SwjgForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  swjgDm: undefined,
  swjgmc: undefined,
  swjgjc: undefined,
  dz: undefined,
  yzbm: undefined,
  lxr: undefined,
  lxdh: undefined,
  sxfzh: undefined,
  sxfhm: undefined,
  sxfhh: undefined,
  sxfyh: undefined,
  sjswjgDm: undefined,
  jcjbj: undefined,
  ghjgDm: undefined,
  sxh: undefined,
  jym: undefined
})

const treeProps = {
  label: 'swjgmc',
  value: 'swjgDm',
  children: 'children'
}
const formRules = reactive({
  swjgmc: [{ required: true, message: '税务机关名称不能为空', trigger: 'blur' }],
  swjgjc: [{ required: true, message: '税务机关简称不能为空', trigger: 'blur' }],
  sjswjgDm: [{ required: true, message: '上级税务机关代码不能为空', trigger: 'blur' }],
  jcjbj: [{ required: true, message: '稽查局标记不能为空', trigger: 'blur' }],
  ghjgDm: [{ required: true, message: '工会机构代码不能为空', trigger: 'blur' }],
  jym: [{ required: true, message: '校验码不能为空', trigger: 'blur' }],
  sxfzh: [{ required: true, message: '手续费账号不能为空', trigger: 'blur' }],
  sxfhm: [{ required: true, message: '户名不能为空', trigger: 'blur' }],
  sxfhh: [{ required: true, message: '行号不能为空', trigger: 'blur' }],
  sxfyh: [{ required: true, message: '银行不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref
const swjgTree = ref() // 树形结构

/** 打开弹窗 */
const open = async (type: string, swjgDm?: string) => {
  // 修改：id? -> swjgDm?
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '税务机关'
  formType.value = type
  resetForm()
  console.log(formData)

  // 修改时，设置数据
  if (swjgDm) {
    // 修改：id -> swjgDm
    formLoading.value = true
    try {
      formData.value = await SwjgApi.getSwjg(swjgDm) // 修改：id -> swjgDm
    } finally {
      formLoading.value = false
    }
  }
  await getSwjgTree()
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
    const data = formData.value as unknown as Swjg
    if (formType.value === 'create') {
      await SwjgApi.createSwjg(data)
      message.success(t('common.createSuccess'))
    } else {
      await SwjgApi.updateSwjg(data)
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
    swjgDm: undefined,
    swjgmc: undefined,
    swjgjc: undefined,
    dz: undefined,
    yzbm: undefined,
    lxr: undefined,
    lxdh: undefined,
    sxfzh: undefined,
    sxfhm: undefined,
    sxfhh: undefined,
    sxfyh: undefined,
    sjswjgDm: undefined,
    jcjbj: undefined,
    ghjgDm: undefined,
    sxh: undefined,
    jym: undefined
  }
  formRef.value?.resetFields()
}

/** 获得税务机关树 */
const getSwjgTree = async () => {
  swjgTree.value = []
  const data = await SwjgApi.getSwjgList({})
  const root: Tree = { id: 0, name: '顶级税务机关', children: [] }
  root.children = handleTree(data, 'swjgDm', 'sjswjgDm')
  swjgTree.value.push(root)
}
</script>
