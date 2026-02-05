<template>
  <div class="branch-detail-container">
    <el-card shadow="never" border="false">
      <el-table :data="branchList" border stripe style="width: 100%; margin-bottom: 20px;"
        :height="'calc(100% - 120px)'">
        <el-table-column label="序号" width="80">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>
        <el-table-column label="社会信用代码" prop="fjgxyxdm" min-width="200">
          <template #default="scope">
            <el-input v-model="scope.row.fjgxyxdm" maxlength="18" size="small" show-word-limit />
          </template>
        </el-table-column>
        <el-table-column label="分支机构全称" prop="fjgdwqc" min-width="250">
          <template #default="scope">
            <el-input v-model="scope.row.fjgdwqc" maxlength="255" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="主管税务部门" prop="fjgzgsbm" min-width="200">
          <template #default="scope">
            <el-input v-model="scope.row.fjgzgsbm" maxlength="255" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="职工人数" prop="fjggzs" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.fjggzs" type="number" min="0" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="月工资总额" prop="fjggzze" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.fjggzze" type="number" min="0" step="0.01" precision="2" size="small" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" size="small" icon="el-icon-delete" @click="deleteBranch(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 操作按钮 -->
      <el-button type="success" size="small" icon="el-icon-plus" @click="addBranch" style="margin-bottom: 16px;">
        新增分支机构
      </el-button>

      <div style="text-align: right;">
        <el-button @click="handleCancel">取消</el-button>
        <el-button type="primary" @click="handleSave">保存</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { BranchDetailReqVO } from "@/api/lghjft/workflow/wfsqhzjf/index";

// 定义Props：接收主页面传递的初始数据
const props = defineProps<{
  initData: BranchDetailReqVO[]
}>()

// 定义Emits：向主页面发送事件
const emit = defineEmits<{
  (e: 'save', data: BranchDetailReqVO[]): void
  (e: 'cancel'): void
}>()

// 分支机构列表（本地维护）
const branchList = ref<BranchDetailReqVO[]>([])

// 监听初始数据变化，同步到本地
watch(
  () => props.initData,
  (newData) => {
    // 深拷贝，避免双向绑定问题
    branchList.value = JSON.parse(JSON.stringify(newData))
  },
  { immediate: true, deep: true }
)

// 新增分支机构
const addBranch = () => {
  branchList.value.push({
    fjgxyxdm: '',
    fjgdwqc: '',
    fjgzgsbm: '',
    fjggzs: 0,
    fjggzze: 0
  })
}

// 删除分支机构
const deleteBranch = (index: number) => {
  ElMessageBox.confirm(
    '确定删除该分支机构信息？',
    '提示',
    { type: 'warning' }
  ).then(() => {
    branchList.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

// 保存数据
const handleSave = () => {
  // 校验必填项
  const invalidItem = branchList.value.find(item => !item.fjgxyxdm || !item.fjgdwqc)
  if (invalidItem) {
    ElMessage.warning('请完善分支机构的社会信用代码和单位全称')
    return
  }
  // 向主页面发送保存事件
  emit('save', branchList.value)
}

// 取消操作
const handleCancel = () => {
  emit('cancel')
}
</script>

<style scoped>
.branch-detail-container {
  width: 100%;
  height: 100%;
  padding: 10px;
  box-sizing: border-box;
}

:deep(.el-card__body) {
  height: 100%;
  padding: 16px;
}
</style>