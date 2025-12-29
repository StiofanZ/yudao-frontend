<template>
  <el-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    v-loading="formLoading"
    label-width="0px"
    :inline-message="true"
  >
    <el-table :data="formData" class="-mt-10px">
      <el-table-column label="序号" type="index" width="100" />
       <el-table-column label="税票UUID" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.spuuid`" :rules="formRules.spuuid" class="mb-0px!">
            <el-input v-model="row.spuuid" placeholder="请输入税票UUID" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="入库金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.rkje`" :rules="formRules.rkje" class="mb-0px!">
            <el-input v-model="row.rkje" placeholder="请输入入库金额" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="退费审批金额" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.tfsqJe`" :rules="formRules.tfsqJe" class="mb-0px!">
            <el-input v-model="row.tfsqJe" placeholder="请输入退费审批金额" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column label="有效标志" min-width="150">
        <template #default="{ row, $index }">
          <el-form-item :prop="`${$index}.xybz`" :rules="formRules.xybz" class="mb-0px!">
            <el-input v-model="row.xybz" placeholder="请输入有效标志" />
          </el-form-item>
        </template>
      </el-table-column>
      <el-table-column align="center" fixed="right" label="操作" width="60">
        <template #default="{ $index }">
          <el-button @click="handleDelete($index)" link>—</el-button>
        </template>
      </el-table-column>
    </el-table>
  </el-form>
  <el-row justify="center" class="mt-3">
    <el-button @click="handleAdd" round>+ 添加申请-退费申请明细</el-button>
  </el-row>
</template>
<script setup lang="ts">
import { WfSqTfsqApi } from '@/api/lghjft/wfsqtfsq'

const props = defineProps<{
  id: number // 退费申请明细ID（主表的关联字段）
}>()
const formLoading = ref(false) // 表单的加载中
const formData = ref<any[]>([])
const formRules = reactive({
  spuuid: [{ required: true, message: '税票UUID不能为空', trigger: 'blur' }],
  rkje: [{ required: true, message: '入库金额不能为空', trigger: 'blur' }],
  tfsqJe: [{ required: true, message: '退费审批金额不能为空', trigger: 'blur' }],
  xybz: [{ required: true, message: '有效标志不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 监听主表的关联字段的变化，加载对应的子表数据 */
watch(
  () => props.id,
  async (val) => {
    // 1. 重置表单
    formData.value = []
    // 2. val 非空，则加载数据
    if (!val) {
      return;
    }
    try {
      formLoading.value = true
      formData.value = await WfSqTfsqApi.getWfSqTfsqmxListById(val)
    } finally {
      formLoading.value = false
    }
  },
  { immediate: true }
)

/** 新增按钮操作 */
const handleAdd = () => {
  const row = {
    id: undefined,
    xh: undefined,
    spuuid: undefined,
    rkje: undefined,
    tfsqJe: undefined,
    xybz: undefined
  }
  row.id = props.id as any
  formData.value.push(row)
}

/** 删除按钮操作 */
const handleDelete = (index) => {
  formData.value.splice(index, 1)
}

/** 表单校验 */
const validate = () => {
  return formRef.value.validate()
}

/** 表单值 */
const getData = () => {
  return formData.value
}

defineExpose({ validate, getData })
</script>