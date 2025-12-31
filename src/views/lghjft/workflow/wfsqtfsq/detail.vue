<template>
  <ContentWrap>
    <el-table :data="detail.mxList" class="mt-2" stripe style="width: 100%">
      <el-table-column align="center" label="社会信用代码" prop="shxydm" />
      <el-table-column align="center" label="纳税人名称" prop="nsrmc" />
      <el-table-column align="center" label="税票UUID" prop="spuuid" />
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
      <el-table-column align="center" label="入库金额" prop="rkje" />
      <el-table-column align="center" label="退费审批金额" prop="tfsqJe" />
    </el-table>
  </ContentWrap>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { WfSqTfsqApi } from '@/api/lghjft/workflow/wfsqtfsq'
import { propTypes } from '@/utils/propTypes'
import { dateFormatter2 } from '@/utils/formatTime'

defineOptions({ name: 'WfSqTfsqDetail' })

const props = defineProps({
  id: propTypes.number.def(undefined)
})

const detail = ref<any>({})

const getDetail = async () => {
  const id = props.id
  if (!id) {
    return
  }
  detail.value = await WfSqTfsqApi.getWfSqTfsq(id)
}

onMounted(() => {
  getDetail()
})
</script>
