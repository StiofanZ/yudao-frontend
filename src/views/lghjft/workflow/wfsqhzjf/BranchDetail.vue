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
        <!-- 社会信用代码：加placeholder + 18位限制 -->
        <el-table-column label="社会信用代码" prop="fjgxyxdm" min-width="200">
          <template #default="scope">
            <el-input v-model="scope.row.fjgxyxdm" maxlength="18" show-word-limit placeholder="请输入18位社会信用代码" />
          </template>
        </el-table-column>
        <!-- 分支机构全称：加placeholder -->
        <el-table-column label="分支机构全称" prop="fjgdwqc" min-width="250">
          <template #default="scope">
            <el-input v-model="scope.row.fjgdwqc" maxlength="255" placeholder="请输入分支机构完整全称" />
          </template>
        </el-table-column>
        <!-- 主管税务部门：加placeholder -->
        <el-table-column label="主管税务部门" prop="fjgzgsbm" min-width="200">
          <template #default="scope">
            <el-input v-model="scope.row.fjgzgsbm" maxlength="255" placeholder="请输入所属主管税务部门" />
          </template>
        </el-table-column>
        <!-- 职工人数：加placeholder + 正整数限制 -->
        <el-table-column label="职工人数" prop="fjggzs" width="120">
          <template #default="scope">
            <el-input v-model="scope.row.fjggzs" type="number" min="1" placeholder="请输入大于0的人数" />
          </template>
        </el-table-column>
        <!-- 月工资总额：加placeholder + 正数限制 -->
        <el-table-column label="月工资总额" prop="fjggzze" width="150">
          <template #default="scope">
            <el-input v-model="scope.row.fjggzze" type="number" min="0.01" step="0.01" precision="2"
              placeholder="请输入大于0的金额" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="100">
          <template #default="scope">
            <el-button type="danger" @click="deleteBranch(scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 操作按钮 -->
      <el-button type="success" @click="addBranch" style="margin-bottom: 16px;">
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
    '确定删除该分支机构信息？删除后不可恢复',
    '删除确认',
    { type: 'warning' }
  ).then(() => {
    branchList.value.splice(index, 1)
    ElMessage.success('删除成功')
  }).catch(() => {
    ElMessage.info('已取消删除')
  })
}

// 保存数据：增强版校验（核心改造）
const handleSave = () => {
  // 1. 校验是否为空列表
  if (branchList.value.length === 0) {
    ElMessage.warning('请至少添加一条分支机构信息')
    return
  }

  // 2. 遍历校验每一条数据的合法性
  for (let i = 0; i < branchList.value.length; i++) {
    const item = branchList.value[i]
    const serial = i + 1 // 第N条数据，方便定位提示

    // 去除首尾空格，避免纯空格提交
    item.fjgxyxdm = item.fjgxyxdm?.trim() || ''
    item.fjgdwqc = item.fjgdwqc?.trim() || ''
    item.fjgzgsbm = item.fjgzgsbm?.trim() || ''

    // 校验社会信用代码：必填 + 18位
    if (!item.fjgxyxdm) {
      ElMessage.warning(`第${serial}条：社会信用代码为必填项`)
      return
    }
    if (item.fjgxyxdm.length !== 18) {
      ElMessage.warning(`第${serial}条：社会信用代码必须为18位`)
      return
    }

    // 校验分支机构全称：必填
    if (!item.fjgdwqc) {
      ElMessage.warning(`第${serial}条：分支机构全称为必填项`)
      return
    }

    // 校验主管税务部门：必填
    if (!item.fjgzgsbm) {
      ElMessage.warning(`第${serial}条：主管税务部门为必填项`)
      return
    }

    // 校验职工人数：必填 + 大于0
    if (!item.fjggzs || item.fjggzs < 1) {
      ElMessage.warning(`第${serial}条：职工人数请输入大于0的正整数`)
      return
    }

    // 校验月工资总额：必填 + 大于0
    if (!item.fjggzze || Number(item.fjggzze) < 0.01) {
      ElMessage.warning(`第${serial}条：月工资总额请输入大于0的数值`)
      return
    }
  }

  // 4. 所有校验通过，向主页面发送保存事件
  ElMessage.success('校验通过，已保存分支机构信息')
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

/* 优化输入框样式，和表格更贴合 */
:deep(.el-input) {
  width: 100%;
}
</style>