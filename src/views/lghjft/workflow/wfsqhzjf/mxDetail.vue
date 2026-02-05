<template>
  <el-card shadow="never" border="false" class="detail-print-card">
    <!-- 移除固定高度，改为自适应 -->
    <el-table :data="branchList" border stripe :scrollbar-always-on="false">
      <el-table-column label="序号" prop="id" width="80" />
      <el-table-column label="社会信用代码" prop="fjgxyxdm" min-width="200" />
      <el-table-column label="分支机构全称" prop="fjgdwqc" min-width="200" />
      <el-table-column label="主管税务部门" prop="fjgzgsbm" min-width="200" />
      <el-table-column label="职工人数" prop="fjggzs" width="120">
        <template #default="scope">
          {{ scope.row.fjggzs || 0 }}
        </template>
      </el-table-column>
      <el-table-column label="月工资总额" prop="fjggzze" width="150">
        <template #default="scope">
          {{ scope.row.fjggzze || 0 }}
        </template>
      </el-table-column>
    </el-table>


    <div style="text-align: right; margin-top: 16px;">
      <el-button @click="handleClose">关闭</el-button>
    </div>
  </el-card>
</template>

<script setup lang="ts">

interface BranchDetail {
  fjgxyxdm: string
  fjgdwqc: string
  fjgzgsbm: string
  fjggzs: number
  fjggzze: number
  hzId?: number
  id?: number
}

const props = defineProps<{
  branchList: BranchDetail[]
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
/* 打印样式优化 */
@media print {
  :deep(.el-card) {
    border: none !important;
    box-shadow: none !important;
  }

  :deep(.el-table) {
    page-break-inside: avoid;
    width: 100% !important;
  }

  /* 打印时确保表格列宽足够 */
  :deep(.el-table-column--min-width) {
    width: auto !important;
    min-width: 200px !important;
  }
}
</style>