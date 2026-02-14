<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="1200px">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="140px"
    >
      <el-row>
        <el-col :span="24" style="text-align: right; margin-bottom: 20px">
          <el-button type="primary" @click="handleSelectNsr">选择纳税人</el-button>
          <el-button type="warning" @click="handleUpdateFromTax"
            >从税务机关获取更新户籍信息</el-button
          >
        </el-col>
      </el-row>

      <el-divider content-position="left">基础信息</el-divider>

      <el-row>
        <el-col :span="8">
          <el-form-item label="登记序号" prop="djxh">
            <el-input
              v-model="formData.djxh"
              :disabled="formType === 'update'"
              placeholder="请输入登记序号"
            />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="纳税人识别号" prop="nsrsbh">
            <el-input v-model="formData.nsrsbh" disabled placeholder="请输入纳税人识别号" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="社会信用代码" prop="shxydm">
            <el-input v-model="formData.shxydm" disabled placeholder="请输入社会信用代码" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="12">
          <el-form-item label="单位名称" prop="nsrmc">
            <el-input v-model="formData.nsrmc" disabled placeholder="请输入单位名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="纳税人简称" prop="nsrjc">
            <el-input v-model="formData.nsrjc" disabled placeholder="请输入纳税人简称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="主管税务机关" prop="zgswjmc">
            <el-input v-model="formData.zgswjmc" disabled placeholder="请输入主管税务机关" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="科所分局代码" prop="zgswskfjDm">
            <el-input v-model="formData.zgswskfjDm" disabled placeholder="请输入科所分局代码" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="科所分局名称" prop="zgswskfjmc">
            <el-input v-model="formData.zgswskfjmc" disabled placeholder="请输入科所分局名称" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">工会信息</el-divider>

      <el-row>
        <el-col :span="8">
          <el-form-item label="工会机构代码" prop="deptId">
            <el-input v-model="formData.deptId" placeholder="请输入工会机构代码" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="工会类别" prop="ghlbDm">
            <el-select v-model="formData.ghlbDm" clearable placeholder="请选择工会类别">
              <el-option
                v-for="dict in getDictOptions(DICT_TYPE.SYS_GHLX)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="系统类别" prop="xtlbDm">
            <el-select v-model="formData.xtlbDm" clearable placeholder="请选择系统类别">
              <el-option
                v-for="dict in getDictOptions(DICT_TYPE.SYS_GHZT)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="职工人数" prop="zgrs">
            <el-input-number v-model="formData.zgrs" :min="0" placeholder="请输入职工人数" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="财务联系人" prop="lxr">
            <el-input v-model="formData.lxr" placeholder="请输入财务联系人" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="联系电话" prop="lxdh">
            <el-input v-model="formData.lxdh" placeholder="请输入联系电话" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="行业工会标志" prop="hyghbz">
            <el-select v-model="formData.hyghbz" clearable placeholder="请选择行业工会标志">
              <el-option
                v-for="dict in getDictOptions(DICT_TYPE.SYS_JHBZ)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="户籍分类1" prop="hjfl1Dm">
            <el-input v-model="formData.hjfl1Dm" placeholder="请输入户籍分类1" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="户籍分类2" prop="hjfl2Dm">
            <el-input v-model="formData.hjfl2Dm" placeholder="请输入户籍分类2" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="属地工会机构" prop="sdghjgDm">
            <!-- Use TreeSelect for Dept if possible, assuming deptId is used -->
            <el-input v-model="formData.sdghjgDm" placeholder="请输入属地工会机构" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成立工会标志" prop="clghbj">
            <el-select v-model="formData.clghbj" clearable placeholder="请选择成立工会标志">
              <el-option
                v-for="dict in getDictOptions(DICT_TYPE.SYS_YES_NO)"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="成立工会日期" prop="clghrq">
            <el-date-picker
              v-model="formData.clghrq"
              placeholder="选择成立工会日期"
              type="date"
              value-format="x"
            />
          </el-form-item>
        </el-col>
      </el-row>

      <el-divider content-position="left">账户信息</el-divider>

      <el-row>
        <el-col :span="8">
          <el-form-item label="基层工会代码" prop="jcghdm">
            <el-input v-model="formData.jcghdm" placeholder="请输入基层工会代码" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="基层工会名称" prop="jcghmc">
            <el-input v-model="formData.jcghmc" placeholder="请输入基层工会名称" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="基层工会账号" prop="jcghzh">
            <el-input v-model="formData.jcghzh" placeholder="请输入基层工会账号" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="8">
          <el-form-item label="基层工会户名" prop="jcghhm">
            <el-input v-model="formData.jcghhm" placeholder="请输入基层工会户名" />
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="基层工会行号" prop="jcghhh">
            <el-input v-model="formData.jcghhh" placeholder="请输入基层工会行号" />
            <!-- <el-button type="primary" link>选择银行</el-button> -->
          </el-form-item>
        </el-col>
        <el-col :span="8">
          <el-form-item label="基层工会银行" prop="jcghyh">
            <el-input v-model="formData.jcghyh" placeholder="请输入基层工会银行" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row>
        <el-col :span="24">
          <el-form-item label="备注" prop="bz">
            <Editor v-model="formData.bz" height="150px" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>

  <!-- 纳税人选择组件 -->
  <NsrxxQuery ref="nsrxxQueryRef" v-model="nsrSelectVisible" @confirm="confirmNsrSelection" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
import {
  createJcxx,
  getJcxx,
  getTaxInfo,
  JcxxVO,
  NsrxxRespVO,
  updateJcxx
} from '@/api/lghjft/hjgl/jcxx'
import { ElMessageBox } from 'element-plus'

import NsrxxQuery from '@/views/lghjft/components/NsrxxQuery/index.vue'

defineOptions({ name: 'JcxxForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  djxh: '',
  deptId: '',
  hyghbz: '',
  shxydm: '',
  nsrmc: '',
  nsrjc: '',
  zgswjDm: '',
  zgswjmc: '',
  zgswskfjDm: '',
  zgswskfjmc: '',
  ssglyDm: '',
  ssglyxm: '',
  zzjglxDm: '',
  zzjglxmc: '',
  hyDm: '',
  hymc: '',
  djzclxDm: '',
  djzclxmc: '',
  dwlsgxDm: '',
  dwlsgxmc: '',
  zgrs: 0,
  nsrztDm: '',
  nsrztmc: '',
  fzcrq: undefined,
  zxrq: undefined,
  zcdz: '',
  yzbm: '',
  lxr: '',
  lxdh: '',
  ghlbDm: '',
  xtlbDm: '',
  hjfl1Dm: '',
  hjfl2Dm: '',
  hjfl3Dm: '',
  hjfl4Dm: '',
  hjfl5Dm: '',
  hjfl6Dm: '',
  hjfl7Dm: undefined,
  hjfl8Dm: '',
  hjfl9Dm: '',
  hjfl10Dm: '',
  sdghjgDm: '',
  clghbj: '',
  clghrq: undefined,
  jcghdm: '',
  jcghmc: '',
  jcghzh: '',
  jcghhm: '',
  jcghhh: '',
  jcghyh: '',
  bz: '',
  jym: '',
  nsrsbh: '',
  fileUrl: '',
  jdxzDm: '',
  sjtbSj: undefined
})
const formRules = reactive({
  djxh: [{ required: true, message: '登记序号不能为空', trigger: 'blur' }],
  deptId: [{ required: true, message: '工会机构代码不能为空', trigger: 'blur' }],
  jcghzh: [{ required: true, message: '基层工会账号不能为空', trigger: 'blur' }],
  jcghhm: [{ required: true, message: '基层工会户名不能为空', trigger: 'blur' }],
  hyghbz: [{ required: true, message: '行业工会标志不能为空', trigger: 'change' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: string) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await getJcxx(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  if (!formRef.value) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as JcxxVO
    if (formType.value === 'create') {
      await createJcxx(data)
      message.success(t('common.createSuccess'))
    } else {
      await updateJcxx(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    djxh: '',
    deptId: '',
    hyghbz: '',
    shxydm: '',
    nsrmc: '',
    nsrjc: '',
    zgswjDm: '',
    zgswjmc: '',
    zgswskfjDm: '',
    zgswskfjmc: '',
    ssglyDm: '',
    ssglyxm: '',
    zzjglxDm: '',
    zzjglxmc: '',
    hyDm: '',
    hymc: '',
    djzclxDm: '',
    djzclxmc: '',
    dwlsgxDm: '',
    dwlsgxmc: '',
    zgrs: 0,
    nsrztDm: '',
    nsrztmc: '',
    fzcrq: undefined,
    zxrq: undefined,
    zcdz: '',
    yzbm: '',
    lxr: '',
    lxdh: '',
    ghlbDm: '',
    xtlbDm: '',
    hjfl1Dm: '',
    hjfl2Dm: '',
    hjfl3Dm: '',
    hjfl4Dm: '',
    hjfl5Dm: '',
    hjfl6Dm: '',
    hjfl7Dm: undefined,
    hjfl8Dm: '',
    hjfl9Dm: '',
    hjfl10Dm: '',
    sdghjgDm: '',
    clghbj: '',
    clghrq: undefined,
    jcghdm: '',
    jcghmc: '',
    jcghzh: '',
    jcghhm: '',
    jcghhh: '',
    jcghyh: '',
    bz: '',
    jym: '',
    nsrsbh: '',
    fileUrl: '',
    jdxzDm: '',
    sjtbSj: undefined
  }
  formRef.value?.resetFields()
}

// --- 纳税人选择逻辑 ---
const nsrSelectVisible = ref(false)
const nsrxxQueryRef = ref()

/** 选择纳税人 */
const handleSelectNsr = () => {
  nsrSelectVisible.value = true
  // 重置组件状态
  nextTick(() => {
    nsrxxQueryRef.value?.reset()
  })
}

const confirmNsrSelection = async (selectedNsr: NsrxxRespVO) => {
  if (!selectedNsr) return
  if (selectedNsr.existsInHj) {
    // 1. 如果已存在，转为修改模式，加载已有户籍信息
    await ElMessageBox.confirm(
      '该纳税人已存在户籍信息，将切换为【修改模式】并加载已有数据。',
      '提示',
      {
        type: 'info'
      }
    )
    formLoading.value = true
    try {
      const existingData = await getJcxx(selectedNsr.djxh)
      resetForm()
      formData.value = existingData
      formType.value = 'update'
      dialogTitle.value = t('action.update')
    } finally {
      formLoading.value = false
    }
  } else {
    // 2. 如果不存在，保持新增模式，从税务接口获取信息
    const fullInfo = await getTaxInfo(selectedNsr.djxh)
    resetForm()
    // 确保 djxh 被设置（防止 getTaxInfo 返回的数据中 djxh 缺失或不一致）
    formData.value.djxh = selectedNsr.djxh
    // 合并税务数据
    Object.assign(formData.value, fullInfo)
    // 强制为新增模式
    formType.value = 'create'
    dialogTitle.value = t('action.create')
  }
  nsrSelectVisible.value = false
  message.success(selectedNsr.existsInHj ? '已加载现有户籍信息' : '已回填税务信息')
}

/** 从税务机关获取更新户籍信息 */
const handleUpdateFromTax = async () => {
  if (!formData.value.djxh) {
    message.warning('当前没有登记序号，无法更新')
    return
  }
  try {
    await ElMessageBox.confirm(
      '此操作将从税务局获取最新公共信息（如名称、地址等）覆盖当前表单，工会独有信息将保留。是否继续？',
      '提示',
      {
        type: 'warning'
      }
    )

    const taxData = await getTaxInfo(formData.value.djxh)

    // 定义公共信息字段列表（即来自 dj_nsrxx/dj_nsrxx_kz 的字段）
    // 注意：需要确保这些字段在 taxData 中存在且有效
    const publicFields = [
      'nsrsbh',
      'nsrmc',
      'nsrjc',
      'shxydm',
      'zgswjDm',
      'zgswjmc',
      'zgswskfjDm',
      'zgswskfjmc',
      'ssglyDm',
      'ssglyxm',
      'zzjglxDm',
      'zzjglxmc',
      'hyDm',
      'hymc',
      'djzclxDm',
      'djzclxmc',
      'dwlsgxDm',
      'dwlsgxmc',
      'zgrs',
      'nsrztDm',
      'nsrztmc',
      'fzcrq',
      'zxrq',
      'zcdz',
      'yzbm',
      'lxr',
      'lxdh',
      'jdxzDm' // 街道乡镇通常也来自税务或基础库
    ]

    let updateCount = 0
    publicFields.forEach((key) => {
      // 只有当税务数据中包含该字段且不为 undefined 时才覆盖
      // 如果需要覆盖为 null (例如税务局清空了该字段)，则去掉 !== null 判断
      if (taxData[key] !== undefined) {
        formData.value[key] = taxData[key]
        updateCount++
      }
    })

    message.success(`税务信息更新成功，共更新 ${updateCount} 个字段`)
  } catch (e) {
    // cancelled or failed
    console.error(e)
  }
}
</script>
