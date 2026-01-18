<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="消息标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入消息标题" />
      </el-form-item>
      <el-form-item label="消息内容" prop="content">
        <Editor v-model="formData.content" height="150px" />
      </el-form-item>
      <el-form-item label="消息类型" prop="messageType">
        <el-select v-model="formData.messageType" clearable placeholder="请选择消息类型">
          <el-option
            v-for="item in messageTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="接收部门" prop="deptIds">
        <el-input v-model="deptNameList" readonly placeholder="请选择接收部门">
          <template #append>
            <el-button @click="openDeptSelect">选择</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="接收人员" prop="userIds">
        <el-input v-model="userNameList" readonly placeholder="请选择接收人员">
          <template #append>
            <el-button @click="openUserSelect" :disabled="!formData.deptIds || formData.deptIds.length === 0">选择</el-button>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">保 存</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
  
  <DeptSelectForm ref="deptSelectRef" :multiple="true" @confirm="handleDeptSelect" />
  <UserSelectForm ref="userSelectRef" :multiple="true" @confirm="handleUserSelect" />
</template>
<script lang="ts" setup>
import * as XxtxApi from '@/api/lghjft/xxzx/xxtx/index'
import DeptSelectForm from '@/components/DeptSelectForm/index.vue'
import UserSelectForm from './components/UserSelectForm/index.vue'

defineOptions({ name: 'XxzxXxtxForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  title: '',
  messageType: undefined,
  content: '',
  status: 0,
  deptIds: [] as number[],
  userIds: [] as number[]
})
const deptNameList = ref('')
const userNameList = ref('')

const formRules = reactive({
  title: [{ required: true, message: '消息标题不能为空', trigger: 'blur' }],
  messageType: [{ required: true, message: '消息类型不能为空', trigger: 'change' }],
  content: [{ required: true, message: '消息内容不能为空', trigger: 'blur' }],
  deptIds: [{ required: true, message: '接收部门不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

const messageTypeOptions = [
  { value: 0, label: '系统消息' },
  { value: 1, label: '业务消息' }
]

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
      const data = await XxtxApi.getXxtx(id)
      formData.value = data
      // 确保 deptIds 和 userIds 是数组，防止后端返回 null 或 undefined 导致的问题
      if (!formData.value.deptIds) formData.value.deptIds = []
      if (!formData.value.userIds) formData.value.userIds = []
      
      // 设置显示的名称
      if (data.deptNames) {
        deptNameList.value = data.deptNames.join(',')
      }
      if (data.userNames) {
        userNameList.value = data.userNames.join(',')
      }
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 部门选择 */
const deptSelectRef = ref()
const openDeptSelect = () => {
  // 传递当前选中的部门ID列表，以便回显
  // 注意：DeptSelectForm 的 open 方法接受的是 DeptVO[]，不仅仅是 IDs
  // 这里简化处理，暂时不传回显，或者如果有完整对象则传
  // DeptSelectForm 的 open 参数定义：open = async (selectedList?: DeptApi.DeptVO[])
  // 我们只存了 ID，无法轻易构造 DeptVO，除非再次查询。
  // 暂时只打开，不回显选中状态（或者需要改进 DeptSelectForm 支持 ID 回显）
  // 实际上 DeptSelectForm 的 open 方法里：
  // if (selectedList?.length) { ... selectedDeptIds.value = selectedIds ... }
  // 所以我们可以构造包含 id 的假对象
  const selectedList = formData.value.deptIds.map(id => ({ id }))
  deptSelectRef.value.open(selectedList)
}
const handleDeptSelect = (deptList: any[]) => {
  formData.value.deptIds = deptList.map(item => item.id)
  deptNameList.value = deptList.map(item => item.name).join(',')
  // 部门改变后，清空已选人员（因为人员可能不再属于新选的部门）
  // 或者保留，但在打开人员选择时会被过滤掉
  // 为了用户体验，建议清空
  formData.value.userIds = []
  userNameList.value = ''
}

/** 人员选择 */
const userSelectRef = ref()
const openUserSelect = () => {
  const selectedList = formData.value.userIds.map(id => ({ id }))
  userSelectRef.value.open(undefined, selectedList, formData.value.deptIds)
}
const handleUserSelect = (id: any, userList: any[]) => {
  // UserSelectForm 的 confirm 事件参数：(id: any, userList: any[])
  // 这里的 id 可能是部门ID？看组件实现是 emit('confirm', checkedNodes) 或者是 (id, userList)
  // 看 UserSelectForm 源码: emit('confirm', id, emitUserList)
  // 我们主要关注 userList
  formData.value.userIds = userList.map(item => item.id)
  userNameList.value = userList.map(item => item.nickname).join(',')
}

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  
  // 设置状态为草稿
  formData.value.status = 0
  
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as XxtxApi.XxtxVO
    if (formType.value === 'create') {
      await XxtxApi.createXxtx(data)
      message.success(t('common.createSuccess'))
    } else {
      await XxtxApi.updateXxtx(data)
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
    title: '',
    messageType: undefined,
    content: '',
    status: 0,
    deptIds: [],
    userIds: []
  }
  deptNameList.value = ''
  userNameList.value = ''
  formRef.value?.resetFields()
}
</script>
