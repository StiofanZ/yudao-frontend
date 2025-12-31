<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <nsrxx-query @success="handleNsrxxSuccess" />
  </ContentWrap>

  <!-- 可退费信息列表弹窗 -->
  <WfSqTfsqKtfxxDialog ref="ktfxxDialogRef" @success="handleKtfxxSelect" />

  <!-- 申请-退费申请列表（展示选中的可退费信息） -->
  <ContentWrap v-if="list.length > 0">
    <div class="mb-4 font-bold text-lg">退费信息</div>
    <el-table :data="list" :show-overflow-tooltip="true" :stripe="true">
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
      <el-table-column align="center" label="退费金额" min-width="150">
        <template #default="{ row }">
          <el-input-number
            v-model="row.tfje"
            :max="row.ktfje"
            :min="0"
            :precision="2"
            :step="0.01"
            class="w-full"
            controls-position="right"
            placeholder="请输入退费金额"
          />
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作">
        <template #default="scope">
          <el-button link type="danger" @click="handleRemove(scope.$index)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="mt-4" justify="center">
      <el-button
        :disabled="isSaved"
        :loading="submitLoading"
        type="primary"
        @click="handleApplyRefund"
      >
        {{ isSaved ? '已申请' : '申请退费' }}
      </el-button>
    </el-row>
  </ContentWrap>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { WfSqTfsqApi, WfSqTfsqKtfxx } from '@/api/lghjft/workflow/wfsqtfsq'
import WfSqTfsqKtfxxDialog from './WfSqTfsqKtfxxDialog.vue'
import { dateFormatter2 } from '@/utils/formatTime'
import { ElMessage } from 'element-plus'

/** 申请-退费申请 列表 */
defineOptions({ name: 'WfSqTfsq' })

const message = useMessage() // 消息弹窗

const ktfxxDialogRef = ref()
const submitLoading = ref(false)
const isSaved = ref(false) // 是否已保存
// 扩展类型以包含 tfje
interface WfSqTfsqKtfxxWithAmount extends WfSqTfsqKtfxx {
  tfje: number
}
const list = ref<WfSqTfsqKtfxxWithAmount[]>([]) // 选中的退费申请列表

/** 纳税人查询成功回调 */
const handleNsrxxSuccess = async (nsrxx: any) => {
  if (!nsrxx.djxh) {
    message.warning('该纳税人缺少登记序号，无法查询可退费信息')
    return
  }
  // 清空已选的退费列表及保存状态
  list.value = []
  isSaved.value = false
  ktfxxDialogRef.value.open(nsrxx.djxh)
}

/** 可退费信息选择回调 */
const handleKtfxxSelect = (row: WfSqTfsqKtfxx, callback?: (isAdded: boolean) => void) => {
  if (isSaved.value) {
    ElMessage.warning('当前已申请退费，请重新查询以发起新申请')
    callback && callback(false)
    return
  }

  // 检查是否已存在
  const exists = list.value.some((item) => item.spuuid === row.spuuid)
  if (exists) {
    ElMessage.warning('该记录已在列表中')
    callback && callback(false)
    return
  }

  // 添加并初始化退费金额为可退费金额
  list.value.push({
    ...row,
    tfje: row.ktfje
  })
  callback && callback(true)
}

/** 移除操作 */
const handleRemove = (index: number) => {
  if (isSaved.value) {
    return // 已保存状态下禁止移除
  }
  list.value.splice(index, 1)
}

/** 申请退费操作 */
const handleApplyRefund = async () => {
  if (list.value.length === 0) {
    message.warning('请至少选择一条退费信息')
    return
  }
  try {
    submitLoading.value = true
    await WfSqTfsqApi.save(list.value)
    message.success('申请退费成功')
    isSaved.value = true // 标记为已保存
    // list.value = [] // 不再清空列表
  } finally {
    submitLoading.value = false
  }
}
</script>
