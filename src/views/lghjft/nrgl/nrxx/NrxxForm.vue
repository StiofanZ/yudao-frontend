<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="上级内容" prop="parentId">
            <el-tree-select
              v-model="formData.parentId"
              :data="contentTree"
              :props="{ label: 'title', value: 'id', children: 'children' }"
              check-strictly
              placeholder="请选择上级内容"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="标题" prop="title">
            <el-input v-model="formData.title" placeholder="请输入标题" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="内容类型" prop="type">
            <el-select v-model="formData.type" placeholder="请选择内容类型" :disabled="isTypeDisabled">
              <el-option label="办事指南" value="guide" />
              <el-option label="常见问题" value="faq" />
              <el-option label="专题讲解" value="topic" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="内容" prop="content">
        <Editor v-model="formData.content" height="250px" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submitForm" :loading="formLoading">确 定</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { ref, defineExpose, watch } from 'vue'
import {
  createNrxx,
  updateNrxx,
  getNrxx,
  getNrxxfbList,
  NrxxVO
} from '@/api/lghjft/nrgl/nrxx'
import { handleTree } from '@/utils/tree'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor/src/Editor.vue'

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formRef = ref()
const contentTree = ref([])
const isTypeDisabled = ref(false)

const formData = ref<NrxxVO>({
  id: undefined,
  parentId: 0,
  title: '',
  type: '',
  content: '',
  sort: 0,
  status: 1
})

const formRules = {
  parentId: [{ required: true, message: '上级内容不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],
  type: [{ required: true, message: '内容类型不能为空', trigger: 'change' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }]
}

/** 打开弹窗 */
const open = async (type: string, id?: number, parentId?: number) => {
  dialogVisible.value = true
  dialogTitle.value = type === 'create' ? '新增内容管理' : '修改内容管理'
  formLoading.value = true
  resetForm()
  await getTree()
  if (parentId) {
    formData.value.parentId = parentId
  }
  if (id) {
    try {
      const res = await getNrxx(id)
      formData.value = res
    } finally {
      formLoading.value = false
    }
  } else {
    formLoading.value = false
  }
}

/** 获取上级内容树 */
const getTree = async () => {
  const res = await getNrxxfbList({})
  const tree = handleTree(res)
  const root = { id: 0, title: '顶级内容', children: tree }
  contentTree.value = [root]
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    parentId: 0,
    title: '',
    type: '',
    content: '',
    sort: 0,
    status: 1
  }
  formRef.value?.resetFields()
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value
    if (data.id) {
      await updateNrxx(data)
      ElMessage.success('修改成功')
    } else {
      await createNrxx(data)
      ElMessage.success('新增成功')
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const emit = defineEmits(['success'])
defineExpose({ open })

/** 监听上级内容的变化 */
watch(
  () => formData.value.parentId,
  (val) => {
    if (val === 0) {
      isTypeDisabled.value = false
    } else {
      // 查找对应的树节点
      const findNode = (nodes: any[], id: number): any => {
        for (const node of nodes) {
          if (node.id === id) {
            return node
          }
          if (node.children) {
            const found = findNode(node.children, id)
            if (found) return found
          }
        }
        return null
      }
      
      const node = findNode(contentTree.value, val)
      if (node) {
        formData.value.type = node.type
        isTypeDisabled.value = true
      }
    }
  }
)
</script>
