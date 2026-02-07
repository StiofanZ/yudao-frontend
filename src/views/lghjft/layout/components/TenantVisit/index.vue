<template>
  <div class="flex items-center gap-4">
    <el-select
      filterable
      placeholder="请选择租户"
      class="!w-180px"
      v-model="value"
      @change="handleChange"
      clearable
    >
      <el-option v-for="item in tenants" :key="item.id" :label="item.name" :value="item.id" />
    </el-select>

    <!-- 单位权限身份显示区域 -->
    <div v-if="currentDwQxSf" class="flex items-center gap-2 text-sm">
      <div class="flex flex-col leading-tight">
        <span class="font-bold">{{ currentDwQxSf.dwmc }}</span>
        <span class="text-xs text-gray-500">{{ currentDwQxSf.ryxm }} ({{ currentDwQxSf.sflx }})</span>
      </div>
      <el-button type="primary" link size="small" @click="handleSwitchIdentity">
        切换身份
      </el-button>
    </div>

    <DwQxSfSelectDialog
      v-model="selectDialogVisible"
      :options="dwQxSfList"
      :can-close="true"
      @confirm="onSelectConfirm"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import * as TenantApi from '@/api/system/tenant'
import { getVisitTenantId, setVisitTenantId, getDwQxSf, getDwQxSfList, setDwQxSf } from '@/utils/auth'
import { useMessage } from '@/hooks/web/useMessage'
import { useTagsView } from '@/hooks/web/useTagsView'
import DwQxSfSelectDialog from '../../../login/components/DwQxSfSelectDialog.vue'

const message = useMessage() // 消息弹窗
const tagsView = useTagsView() // 标签页操作

const value = ref(getVisitTenantId()) // 当前选中的租户 ID
const tenants = ref<any[]>([]) // 租户列表

// 身份相关
const currentDwQxSf = ref(getDwQxSf())
const dwQxSfList = ref<any[]>([])
const selectDialogVisible = ref(false)

const handleSwitchIdentity = () => {
  const list = getDwQxSfList()
  if (list && list.length > 0) {
    dwQxSfList.value = list
    selectDialogVisible.value = true
  } else {
    message.warning('当前暂无其他身份可切换')
  }
}

const onSelectConfirm = (selectedItem: any) => {
  setDwQxSf(selectedItem)
  currentDwQxSf.value = selectedItem
  message.success(`已切换身份为: ${selectedItem.dwmc} - ${selectedItem.ryxm}`)
  // 刷新页面以应用新身份
  tagsView.closeOther()
  tagsView.refreshPage()
}

const handleChange = (id: number) => {
  // 设置访问租户 ID
  setVisitTenantId(id)
  // 关闭其他标签页，只保留当前页
  tagsView.closeOther()
  // 刷新当前页面
  tagsView.refreshPage()
  // 提示切换成功
  const tenant = tenants.value.find((item) => item.id === id)
  if (tenant) {
    message.success(`切换当前租户为: ${tenant.name}`)
  }
}

onMounted(async () => {
  tenants.value = await TenantApi.getTenantList()
})
</script>
