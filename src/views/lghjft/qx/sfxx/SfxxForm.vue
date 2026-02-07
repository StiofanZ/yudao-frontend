<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="登录账号ID" prop="dlzhId">
        <el-input
          v-model="formData.dlzhId"
          class="!w-240px"
          placeholder="请输入登录账号ID"
          :disabled="isDlzhIdDisabled"
        />
      </el-form-item>
      <el-form-item label="社会信用代码">
        <el-input v-model="searchShxydm" placeholder="请输入社会信用代码或纳税人识别号" class="!w-240px">
          <template #append>
            <el-button @click="handleQueryNsrxx">查询</el-button>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item label="纳税人名称" v-if="currentNsrmc">
        <el-input v-model="currentNsrmc" readonly class="!w-240px" />
      </el-form-item>
      <el-form-item label="登记序号" prop="djxh">
        <el-input v-model="formData.djxh" readonly placeholder="请查询社会信用代码获取" />
      </el-form-item>
      <el-form-item label="身份类型" prop="sflx">
        <el-select v-model="formData.sflx" class="!w-240px" placeholder="请选择身份类型">
          <el-option label="法定代表人" value="01" />
          <el-option label="财务负责人" value="02" />
        </el-select>
      </el-form-item>
      <el-form-item label="工会类型" prop="ghlx">
        <el-select v-model="formData.ghlx" class="!w-240px" placeholder="请选择工会类型">
          <el-option label="基层工会" value="01" />
          <el-option label="缴费单位" value="02" />
          <el-option label="联合工会" value="03" />
          <el-option label="集团工会" value="04" />
          <el-option label="产业系统工会" value="05" />
          <el-option label="县区总工会" value="06" />
          <el-option label="市总工会" value="07" />
          <el-option label="省总工会" value="08" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限类型" prop="qxlx">
        <el-select v-model="formData.qxlx" class="!w-240px" placeholder="请选择权限类型">
          <el-option label="管理员" value="01" />
          <el-option label="一般人" value="02" />
        </el-select>
      </el-form-item>
      <el-form-item label="授权原因" prop="sqyy">
        <el-input
          v-model="formData.sqyy"
          type="textarea"
          class="!w-240px"
          placeholder="请输入授权原因"
        />
      </el-form-item>
      <el-form-item label="部门编号" prop="deptId">
        <el-input
          v-model="formData.deptId"
          class="!w-240px"
          placeholder="请输入部门编号"
          readonly
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 纳税人选择弹窗 -->
  <Dialog v-model="nsrxxDialogVisible" title="选择纳税人" width="60%">
    <el-table :data="nsrxxList" border @row-click="handleSelectNsrxx">
      <el-table-column label="纳税人识别号" prop="nsrsbh" />
      <el-table-column label="纳税人名称" prop="nsrmc" />
      <el-table-column label="登记序号" prop="djxh" />
      <el-table-column label="社会信用代码" prop="shxydm" />
      <el-table-column label="操作" width="100" align="center">
        <template #default="scope">
          <el-button type="primary" link @click.stop="handleSelectNsrxx(scope.row)">选择</el-button>
        </template>
      </el-table-column>
    </el-table>
  </Dialog>
</template>

<script lang="ts" setup>
import { type Sfxx, SfxxApi } from '@/api/lghjft/qx/sfxx'
import { NsrxxApi, type NsrxxResVO } from '@/api/lghjft/nsrxx'

defineOptions({ name: 'SfxxForm' })

const { t } = useI18n()
const message = useMessage()

const dialogVisible = ref(false)
const dialogTitle = ref('')
const formLoading = ref(false)
const formType = ref('')
const formData = ref<Sfxx>({
  id: undefined,
  dlzhId: undefined,
  djxh: undefined,
  sflx: undefined,
  ghlx: undefined,
  qxlx: undefined,
  sqyy: undefined,
  jbyy: undefined,
  deptId: undefined
})
const formRules = reactive({
  dlzhId: [{ required: true, message: '登录账号ID不能为空', trigger: 'blur' }],
  djxh: [{ required: true, message: '登记序号不能为空', trigger: 'blur' }],
  sflx: [{ required: true, message: '身份类型不能为空', trigger: 'change' }],
  qxlx: [{ required: true, message: '权限类型不能为空', trigger: 'change' }]
})
const formRef = ref()

// 纳税人查询相关
const searchShxydm = ref('')
const currentNsrmc = ref('')
const nsrxxDialogVisible = ref(false)
const nsrxxList = ref<NsrxxResVO[]>([])
const isDlzhIdDisabled = ref(false)

const handleQueryNsrxx = async () => {
  if (!searchShxydm.value) {
    message.warning('请输入社会信用代码或纳税人识别号')
    return
  }
  formLoading.value = true
  try {
    const data = await NsrxxApi.getNsrxxList(searchShxydm.value)
    if (!data || data.length === 0) {
      message.warning('未找到对应的纳税人信息')
    } else if (data.length === 1) {
      handleSelectNsrxx(data[0])
    } else {
      nsrxxList.value = data
      nsrxxDialogVisible.value = true
    }
  } finally {
    formLoading.value = false
  }
}

const handleSelectNsrxx = (row: NsrxxResVO) => {
  formData.value.djxh = row.djxh
  currentNsrmc.value = row.nsrmc || ''
  
  // 自动填充部门编号
  if (row.deptId) {
    formData.value.deptId = row.deptId
  }
  
  // 自动填充已存在的身份信息（工会类型等）
  if (row.sfxx) {
    formData.value.ghlx = row.sfxx.ghlx
    // 如果存在已有的身份信息，切换为更新模式
    if (row.sfxx.id) {
      formData.value.id = row.sfxx.id
      formData.value.sflx = row.sfxx.sflx
      formData.value.qxlx = row.sfxx.qxlx
      formData.value.sqyy = row.sfxx.sqyy
      formData.value.jbyy = row.sfxx.jbyy
      formData.value.status = row.sfxx.status
      // 切换为更新操作
      formType.value = 'update'
      dialogTitle.value = '修改身份信息'
      message.info('已加载该纳税人的现有身份信息')
    }
  }
  
  // 自动匹配身份类型
  // 获取当前行用户的信息（姓名和手机号）
  if (currentRow.value) {
    const userName = currentRow.value.yhxm
    const userMobile = currentRow.value.lxdh

    console.log(userName, userMobile,row.cwfzrxm,row.cwfzryddh)
    
    // 优先匹配法定代表人 (01)
    if (userName === row.fddbrxm && userMobile === row.fddbryddh) {
      formData.value.sflx = '01'
    } 
    // 其次匹配财务负责人 (02)
    else if (userName === row.cwfzrxm && userMobile === row.cwfzryddh) {
      formData.value.sflx = '02'
    }
  }
  
  nsrxxDialogVisible.value = false
  message.success('已选择纳税人：' + row.nsrmc)
}

const currentRow = ref<any>(null)

const open = async (type: string, id?: number, dlzhId?: number, row?: any) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type) + '身份信息'
  formType.value = type
  resetForm()
  searchShxydm.value = ''
  currentNsrmc.value = ''
  if (dlzhId) {
    formData.value.dlzhId = dlzhId
    isDlzhIdDisabled.value = true
  } else {
    isDlzhIdDisabled.value = false
  }
  if (row) {
    currentRow.value = row
  }
  if (id) {
    formLoading.value = true
    try {
      formData.value = await SfxxApi.getSfxx(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open })

const emit = defineEmits(['success'])
const submitForm = async () => {
  await formRef.value.validate()
  formLoading.value = true
  try {
    const data = formData.value
    if (formType.value === 'create') {
      await SfxxApi.createSfxx(data)
      message.success(t('common.createSuccess'))
    } else {
      await SfxxApi.updateSfxx(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

const resetForm = () => {
  formData.value = {
    id: undefined,
    dlzhId: undefined,
    djxh: undefined,
    sflx: undefined,
    ghlx: undefined,
    qxlx: undefined,
    sqyy: undefined,
    jbyy: undefined,
    deptId: undefined
  }
  formRef.value?.resetFields()
}
</script>
