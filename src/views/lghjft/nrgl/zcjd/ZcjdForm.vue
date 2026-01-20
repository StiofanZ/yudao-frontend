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
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formData.sort" :min="0" controls-position="right" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="解读部门" prop="jdbm">
            <el-input v-model="formData.jdbm" placeholder="请输入解读部门" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="发布日期" prop="fbrq">
            <el-date-picker
              v-model="formData.fbrq"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择发布日期"
              style="width: 100%"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="24">
          <el-form-item label="附件链接" prop="fjlj">
             <el-input v-model="formData.fjlj" placeholder="请输入附件链接或上传附件" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="24">
        <el-col :span="12">
          <el-form-item label="可见范围" prop="kjfw">
            <el-select v-model="formData.kjfw" placeholder="请选择可见范围">
              <el-option label="完全可见" :value="1" />
              <el-option label="下级可见" :value="2" />
              <el-option label="本级可见" :value="3" />
            </el-select>
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
  createZcjd,
  updateZcjd,
  getZcjd,
  getZcjdfbList,
  ZcjdVO
} from '@/api/lghjft/nrgl/zcjd'
import { handleTree } from '@/utils/tree'
import { ElMessage } from 'element-plus'
import Editor from '@/components/Editor/src/Editor.vue'

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formRef = ref()
const contentTree = ref([])


const formData = ref<ZcjdVO>({
  id: undefined,
  parentId: 0,
  title: '',
  
  content: '',
  sort: 0,
  status: 0, // 默认草稿
  kjfw: 1, // 默认公开
  deptId: undefined,
  deptName: ''
})

const formRules = {
  parentId: [{ required: true, message: '上级内容不能为空', trigger: 'blur' }],
  title: [{ required: true, message: '标题不能为空', trigger: 'blur' }],

  sort: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
  kjfw: [{ required: true, message: '可见范围不能为空', trigger: 'blur' }]
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
      const res = await getZcjd(id)
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
  const res = await getZcjdfbList({})
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
    
    content: '',
    sort: 0,
    status: 0,
    kjfw: 1,
    deptId: undefined,
    deptName: ''
  }
  formRef.value?.resetFields()
}

/** 提交表单 */
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value
    // 创建时后端会强制覆盖 status 为 0，更新时 status 保持不变 (但后端逻辑中不应该允许通过 update 修改 status 为 published, publish 必须走 publish 接口)
    // 这里前端传递 status 主要是为了 update 时带上原 status
    if (data.id) {
      await updateZcjd(data)
      ElMessage.success('修改成功')
    } else {
      await createZcjd(data)
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


</script>
