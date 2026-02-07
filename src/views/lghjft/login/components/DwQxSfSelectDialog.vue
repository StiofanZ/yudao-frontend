<template>
  <el-dialog
    v-model="dialogVisible"
    title="请选择登录身份"
    width="500px"
    :close-on-click-modal="canClose"
    :close-on-press-escape="canClose"
    :show-close="canClose"
    center
  >
    <div class="flex flex-col gap-4 max-h-400px overflow-y-auto">
      <div
        v-for="(item, index) in options"
        :key="index"
        class="p-4 border rounded cursor-pointer hover:border-primary transition-colors"
        :class="{ 'border-primary bg-blue-50': selectedIndex === index }"
        @click="handleSelect(index)"
      >
        <div class="font-bold text-lg">{{ item.dwmc }}</div>
        <div class="mt-2 text-gray-600">
          <span class="mr-4">姓名: {{ item.ryxm }}</span>
          <span>身份: {{ item.sflx }}</span>
        </div>
        <div class="mt-1 text-gray-500 text-sm">
          <span>{{ item.zgghMc }}</span>
        </div>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button v-if="canClose" @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :disabled="selectedIndex === -1" @click="handleConfirm">
          确认进入
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, watch, computed, PropType } from 'vue'

defineOptions({ name: 'DwQxSfSelectDialog' })

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  options: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  canClose: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const dialogVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const selectedIndex = ref(-1)

const handleSelect = (index: number) => {
  selectedIndex.value = index
}

const handleConfirm = () => {
  if (selectedIndex.value !== -1) {
    emit('confirm', props.options[selectedIndex.value])
    dialogVisible.value = false
  }
}

// Reset selection when dialog opens
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      selectedIndex.value = -1
    }
  }
)
</script>

<style scoped>
</style>
