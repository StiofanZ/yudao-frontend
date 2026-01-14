<template>
  <Dialog v-model="dialogVisible" title="可退费信息列表" width="70%">
    <el-form :inline="true" :model="queryParams" class="demo-form-inline">
      <el-form-item label="税款所属期">
        <el-date-picker
          v-model="queryParams.skssq"
          :default-time="[new Date(2000, 1, 1, 0, 0, 0), new Date(2000, 1, 1, 23, 59, 59)]"
          end-placeholder="结束日期"
          range-separator="至"
          start-placeholder="开始日期"
          type="daterange"
          value-format="YYYY-MM-DD"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleQuery">查询</el-button>
        <el-button @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="税票UUID" prop="spuuid" />
      <el-table-column align="center" label="社会信用代码" prop="shxydm" />
      <el-table-column align="center" label="纳税人名称" prop="nsrmc" />
      <el-table-column
        :formatter="dateFormatter2"
        align="center"
        label="税款所属期起"
        prop="skssqq"
      />
      <el-table-column
        :formatter="dateFormatter2"
        align="center"
        label="税款所属期止"
        prop="skssqz"
      />
      <el-table-column align="center" label="可退费金额" prop="ktfje" />
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button link type="primary" @click="handleSelect(scope.row)">选中</el-button>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="dialogVisible = false">关 闭</el-button>
    </template>
  </Dialog>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { Dialog } from '@/components/Dialog'
import { WfSqTfsqApi, WfSqTfsqKtfxx } from '@/api/lghjft/workflow/wfsqtfsq'
import { dateFormatter2 } from '@/utils/formatTime'
import { ElMessage } from 'element-plus'
import dayjs from 'dayjs'

const dialogVisible = ref(false)
const loading = ref(false)
const list = ref<WfSqTfsqKtfxx[]>([])
const djxh = ref<string | undefined>(undefined)

const queryParams = reactive({
  skssq: [] as string[]
})

const open = async (djxhVal: string) => {
  djxh.value = djxhVal
  dialogVisible.value = true

  // 默认查询时间范围1年内，其中时间至为本月月末，时间起为月头
  const end = dayjs().endOf('month').format('YYYY-MM-DD')
  const start = dayjs().subtract(1, 'year').startOf('month').format('YYYY-MM-DD')
  queryParams.skssq = [start, end]

  await getList()
}

const getList = async () => {
  if (!djxh.value) return
  loading.value = true
  try {
    const [skssqq, skssqz] = queryParams.skssq || []
    list.value = await WfSqTfsqApi.getKtfxxList(djxh.value, skssqq, skssqz)
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  getList()
}

const resetQuery = () => {
  queryParams.skssq = []
  getList()
}

const emit = defineEmits(['success'])

const handleSelect = (row: WfSqTfsqKtfxx) => {
  emit('success', row, (isAdded: boolean) => {
    if (isAdded) {
      ElMessage.success('已添加到申请退费列表')
    }
  })
}

defineExpose({ open })
</script>
