<!-- <script setup lang="ts">
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { useUserStore } from '@/store/modules/user'
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { decodeFields } from '@/utils/formCreate'

const userStore = useUserStore()

const visible = ref(false)
const loading = ref(false)

const printData = ref()
const userName = computed(() => userStore.user.nickname ?? '')
const printTime = ref(formatDate(new Date(), 'YYYY-MM-DD HH:mm'))
const formFields = ref()
const printDataMap = ref({})

const open = async (id: string) => {
  loading.value = true
  try {
    printData.value = await ProcessInstanceApi.getProcessInstancePrintData(id)
    initPrintDataMap()
    parseFormFields()
  } finally {
    loading.value = false
  }
  visible.value = true
}
defineExpose({ open })

const parseFormFields = () => {
  if (!printData.value) return

  const formFieldsObj = decodeFields(
    printData.value.processInstance.processDefinition?.formFields || []
  )
  const processVariables = printData.value.processInstance.formVariables
  let res: any = []
  for (const item of formFieldsObj) {
    const id = item['field']
    const name = item['title']
    const variable = processVariables[item['field']]
    let html = variable
    switch (item['type']) {
      case 'UploadImg': {
        let imgEl = document.createElement('img')
        imgEl.setAttribute('src', variable)
        imgEl.setAttribute('style', 'max-width: 600px;')
        html = imgEl.outerHTML
        break
      }
      case 'radio':
      case 'checkbox':
      case 'select': {
        const options = item['options'] || []
        const temp: any = []
        if (Array.isArray(variable)) {
          const labels = options.filter((o) => variable.includes(o.value)).map((o) => o.label)
          temp.push(...labels)
        } else {
          const opt = options.find((o) => o.value === variable)
          temp.push(opt.label)
        }
        html = temp.join(',')
      }
      // TODO 更多表单打印展示
    }
    printDataMap.value[item['field']] = html
    res.push({ id, name, html })
  }
  formFields.value = res
}

const initPrintDataMap = () => {
  printDataMap.value['startUser'] = printData.value.processInstance.startUser.nickname
  printDataMap.value['startUserDept'] = printData.value.processInstance.startUser.deptName
  printDataMap.value['processName'] = printData.value.processInstance.name
  printDataMap.value['processNum'] = printData.value.processInstance.id
  printDataMap.value['startTime'] = formatDate(printData.value.processInstance.startTime)
  printDataMap.value['endTime'] = formatDate(printData.value.processInstance.endTime)
  printDataMap.value['processStatus'] = getDictLabel(
    DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS,
    printData.value.processInstance.status
  )
  printDataMap.value['printUser'] = userName.value
  printDataMap.value['printTime'] = printTime.value
}

const getPrintTemplateHTML = () => {
  const parser = new DOMParser()
  let doc = parser.parseFromString(printData.value.printTemplateHtml, 'text/html')
  // table 添加border
  let tables = doc.querySelectorAll('table')
  tables.forEach((item) => {
    item.setAttribute('border', '1')
    item.setAttribute('style', (item.getAttribute('style') || '') + 'border-collapse:collapse;')
  })
  // 替换 mentions
  let mentions = doc.querySelectorAll('[data-w-e-type="mention"]')
  mentions.forEach((item) => {
    const mentionId = JSON.parse(decodeURIComponent(item.getAttribute('data-info') ?? ''))['id']
    item.innerHTML = printDataMap.value[mentionId] ?? ''
  })
  // 替换流程记录
  let processRecords = doc.querySelectorAll('[data-w-e-type="process-record"]')
  let processRecordTable: Element = document.createElement('table')
  if (processRecords.length > 0) {
    // 构建流程记录html
    processRecordTable.setAttribute('border', '1')
    processRecordTable.setAttribute('style', 'width:100%;border-collapse:collapse;')
    const headTr = document.createElement('tr')
    const headTd = document.createElement('td')
    headTd.setAttribute('colspan', '2')
    headTd.setAttribute('width', 'auto')
    headTd.setAttribute('style', 'text-align: center;')
    headTd.innerHTML = '流程节点'
    headTr.appendChild(headTd)
    processRecordTable.appendChild(headTr)
    printData.value.tasks.forEach((item) => {
      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
      td1.innerHTML = item.name
      const td2 = document.createElement('td')
      td2.innerHTML = item.description
      tr.appendChild(td1)
      tr.appendChild(td2)
      processRecordTable.appendChild(tr)
    })
  }
  processRecords.forEach((item) => {
    item.innerHTML = processRecordTable.outerHTML
  })
  // 返回 html
  return doc.body.innerHTML
}

const printObj = ref({
  id: 'printDivTag',
  popTitle: '&nbsp',
  extraCss: '/print.css',
  extraHead: '',
  zIndex: 20003
})
</script>

<template>
  <el-dialog v-loading="loading" v-model="visible" :show-close="false">
    <div id="printDivTag" style="word-break: break-all">
      <div v-if="printData.printTemplateEnable" v-html="getPrintTemplateHTML()"></div>
      <div v-else>
        <h2 class="text-center">{{ printData.processInstance.name }}</h2>
        <div class="text-right text-15px">{{ '打印人员: ' + userName }}</div>
        <div class="flex justify-between">
          <div class="text-15px">{{ '流程编号: ' + printData.processInstance.id }}</div>
          <div class="text-15px">{{ '打印时间: ' + printTime }}</div>
        </div>
        <table class="mt-20px w-100%" border="1" style="border-collapse: collapse">
          <tbody>
            <tr>
              <td class="p-5px w-25%">发起人</td>
              <td class="p-5px w-25%">{{ printData.processInstance.startUser.nickname }}</td>
              <td class="p-5px w-25%">发起时间</td>
              <td class="p-5px w-25%">{{ formatDate(printData.processInstance.startTime) }}</td>
            </tr>
            <tr>
              <td class="p-5px w-25%">所属部门</td>
              <td class="p-5px w-25%">{{ printData.processInstance.startUser.deptName }}</td>
              <td class="p-5px w-25%">流程状态</td>
              <td class="p-5px w-25%">
                {{
                  getDictLabel(
                    DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS,
                    printData.processInstance.status
                  )
                }}
              </td>
            </tr>
            <tr>
              <td class="p-5px w-100% text-center" colspan="4">
                <h4>表单内容</h4>
              </td>
            </tr>
            <tr v-for="item in formFields" :key="item.id">
              <td class="p-5px w-20%">
                {{ item.name }}
              </td>
              <td class="p-5px w-80%" colspan="3">
                <div v-html="item.html"></div>
              </td>
            </tr>
            <tr>
              <td class="p-5px w-100% text-center" colspan="4">
                <h4>流程节点</h4>
              </td>
            </tr>
            <tr v-for="item in printData.tasks" :key="item.id">
              <td class="p-5px w-20%">
                {{ item.name }}
              </td>
              <td class="p-5px w-80%" colspan="3">
                {{ item.description }}
                <div v-if="item.signPicUrl && item.signPicUrl.length > 0">
                  <img class="w-90px h-40px" :src="item.signPicUrl" alt="" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" v-print="printObj"> 打 印</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
/* 修复打印只显示一页 */
@media print {
  @page {
    size: auto;
  }

  body,
  html,
  div {
    height: auto !important;
  }
}
</style> -->


<script setup lang="ts">
import * as ProcessInstanceApi from '@/api/bpm/processInstance'
import { useUserStore } from '@/store/modules/user'
import { formatDate } from '@/utils/formatTime'
import { DICT_TYPE, getDictLabel } from '@/utils/dict'
import { decodeFields } from '@/utils/formCreate'
// 新增：自定义表单所需依赖
import { BpmModelFormType } from '@/utils/constants'
import { registerComponent } from '@/utils/routerHelper'
import { useMessage } from '@/hooks/web/useMessage'

const userStore = useUserStore()
const message = useMessage() // 初始化消息提示

const visible = ref(false)
const loading = ref(false)

const printData = ref()
const userName = computed(() => userStore.user.nickname ?? '')
const printTime = ref(formatDate(new Date(), 'YYYY-MM-DD HH:mm'))
const formFields = ref()
const printDataMap = ref({})

// 新增：自定义表单相关状态
const formType = ref<number | ''>('') // 允许空字符串 + 数字类型
const businessKey = ref('') // 自定义表单的业务主键
const businessFormComponent = ref<any>(null) // 动态加载的自定义业务组件

const open = async (id: string) => {
  loading.value = true
  try {
    // 1. 原有逻辑：获取打印基础数据
    printData.value = await ProcessInstanceApi.getProcessInstancePrintData(id)
    // 2. 新增：查询流程详情，获取表单类型、自定义表单路径、businessKey
    const processDetail = await ProcessInstanceApi.getApprovalDetail({ processInstanceId: id })
    if (!processDetail || !processDetail.processDefinition) {
      message.error('查询流程表单类型失败！')
      return
    }
    formType.value = processDetail.processDefinition.formType // 记录表单类型
    // 3. 区分处理：内置表单/自定义表单
    if (formType.value === BpmModelFormType.NORMAL) {
      // 内置表单：沿用原有逻辑
      initPrintDataMap()
      parseFormFields()
    } else if (formType.value === BpmModelFormType.CUSTOM) {
      // 自定义表单：加载业务组件（核心新增）
      businessKey.value = processDetail.processInstance.businessKey // 业务主键
      // 动态加载流程定义中配置的自定义表单组件
      businessFormComponent.value = registerComponent(processDetail.processDefinition.formCustomViewPath)
      // 自定义表单无需解析formFields，清空原有字段避免干扰
      formFields.value = []
    } else {
      // 其他类型：沿用原有逻辑
      initPrintDataMap()
      parseFormFields()
    }
  } finally {
    loading.value = false
  }
  visible.value = true
}
defineExpose({ open })

const parseFormFields = () => {
  if (!printData.value) return

  const formFieldsObj = decodeFields(
    printData.value.processInstance.processDefinition?.formFields || []
  )
  const processVariables = printData.value.processInstance.formVariables
  let res: any = []
  for (const item of formFieldsObj) {
    const id = item['field']
    const name = item['title']
    const variable = processVariables[item['field']]
    let html = variable
    switch (item['type']) {
      case 'UploadImg': {
        let imgEl = document.createElement('img')
        imgEl.setAttribute('src', variable)
        imgEl.setAttribute('style', 'max-width: 600px;')
        html = imgEl.outerHTML
        break
      }
      case 'radio':
      case 'checkbox':
      case 'select': {
        const options = item['options'] || []
        const temp: any = []
        if (Array.isArray(variable)) {
          const labels = options.filter((o) => variable.includes(o.value)).map((o) => o.label)
          temp.push(...labels)
        } else {
          const opt = options.find((o) => o.value === variable)
          temp.push(opt ? opt.label : '')
        }
        html = temp.join(',')
      }
      // TODO 更多表单打印展示
    }
    printDataMap.value[item['field']] = html
    res.push({ id, name, html })
  }
  formFields.value = res
}

const initPrintDataMap = () => {
  printDataMap.value['startUser'] = printData.value.processInstance.startUser.nickname
  printDataMap.value['startUserDept'] = printData.value.processInstance.startUser.deptName
  printDataMap.value['processName'] = printData.value.processInstance.name
  printDataMap.value['processNum'] = printData.value.processInstance.id
  printDataMap.value['startTime'] = formatDate(printData.value.processInstance.startTime)
  printDataMap.value['endTime'] = formatDate(printData.value.processInstance.endTime)
  printDataMap.value['processStatus'] = getDictLabel(
    DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS,
    printData.value.processInstance.status
  )
  printDataMap.value['printUser'] = userName.value
  printDataMap.value['printTime'] = printTime.value
}

const getPrintTemplateHTML = () => {
  const parser = new DOMParser()
  let doc = parser.parseFromString(printData.value.printTemplateHtml, 'text/html')
  // table 添加border
  let tables = doc.querySelectorAll('table')
  tables.forEach((item) => {
    item.setAttribute('border', '1')
    item.setAttribute('style', (item.getAttribute('style') || '') + 'border-collapse:collapse;')
  })
  // 替换 mentions
  let mentions = doc.querySelectorAll('[data-w-e-type="mention"]')
  mentions.forEach((item) => {
    const mentionId = JSON.parse(decodeURIComponent(item.getAttribute('data-info') ?? ''))['id']
    item.innerHTML = printDataMap.value[mentionId] ?? ''
  })
  // 替换流程记录
  let processRecords = doc.querySelectorAll('[data-w-e-type="process-record"]')
  let processRecordTable: Element = document.createElement('table')
  if (processRecords.length > 0) {
    // 构建流程记录html
    processRecordTable.setAttribute('border', '1')
    processRecordTable.setAttribute('style', 'width:100%;border-collapse:collapse;')
    const headTr = document.createElement('tr')
    const headTd = document.createElement('td')
    headTd.setAttribute('colspan', '2')
    headTd.setAttribute('width', 'auto')
    headTd.setAttribute('style', 'text-align: center;')
    headTd.innerHTML = '流程节点'
    headTr.appendChild(headTd)
    processRecordTable.appendChild(headTr)
    printData.value.tasks.forEach((item) => {
      const tr = document.createElement('tr')
      const td1 = document.createElement('td')
      td1.innerHTML = item.name
      const td2 = document.createElement('td')
      td2.innerHTML = item.description
      tr.appendChild(td1)
      tr.appendChild(td2)
      processRecordTable.appendChild(tr)
    })
  }
  processRecords.forEach((item) => {
    item.innerHTML = processRecordTable.outerHTML
  })
  // 返回 html
  return doc.body.innerHTML
}

const printObj = ref({
  id: 'printDivTag',
  popTitle: '&nbsp',
  extraCss: '/print.css',
  extraHead: '',
  zIndex: 20003
})
</script>

<template>
  <el-dialog v-loading="loading" v-model="visible" :show-close="false">
    <div id="printDivTag" style="word-break: break-all">
      <!-- 新增：自定义业务表单（优先级最高） -->
      <div v-if="formType === BpmModelFormType.CUSTOM" class="custom-form-container">
        <component :is="businessFormComponent" :id="businessKey" :is-print-mode="true" />
      </div>
      <!-- 原有：打印模板渲染 -->
      <div v-else-if="printData && printData.printTemplateEnable" v-html="getPrintTemplateHTML()"></div>
      <!-- 原有：内置表单表格渲染 -->
      <div v-else-if="printData">
        <h2 class="text-center">{{ printData.processInstance.name }}</h2>
        <div class="text-right text-15px">{{ '打印人员: ' + userName }}</div>
        <div class="flex justify-between">
          <div class="text-15px">{{ '流程编号: ' + printData.processInstance.id }}</div>
          <div class="text-15px">{{ '打印时间: ' + printTime }}</div>
        </div>
        <table class="mt-20px w-100%" border="1" style="border-collapse: collapse">
          <tbody>
            <tr>
              <td class="p-5px w-25%">发起人</td>
              <td class="p-5px w-25%">{{ printData.processInstance.startUser.nickname }}</td>
              <td class="p-5px w-25%">发起时间</td>
              <td class="p-5px w-25%">{{ formatDate(printData.processInstance.startTime) }}</td>
            </tr>
            <tr>
              <td class="p-5px w-25%">所属部门</td>
              <td class="p-5px w-25%">{{ printData.processInstance.startUser.deptName }}</td>
              <td class="p-5px w-25%">流程状态</td>
              <td class="p-5px w-25%">
                {{
                  getDictLabel(
                    DICT_TYPE.BPM_PROCESS_INSTANCE_STATUS,
                    printData.processInstance.status
                  )
                }}
              </td>
            </tr>
            <tr>
              <td class="p-5px w-100% text-center" colspan="4">
                <h4>表单内容</h4>
              </td>
            </tr>
            <tr v-for="item in formFields" :key="item.id">
              <td class="p-5px w-20%">
                {{ item.name }}
              </td>
              <td class="p-5px w-80%" colspan="3">
                <div v-html="item.html"></div>
              </td>
            </tr>
            <tr>
              <td class="p-5px w-100% text-center" colspan="4">
                <h4>流程节点</h4>
              </td>
            </tr>
            <tr v-for="item in printData.tasks" :key="item.id">
              <td class="p-5px w-20%">
                {{ item.name }}
              </td>
              <td class="p-5px w-80%" colspan="3">
                {{ item.description }}
                <div v-if="item.signPicUrl && item.signPicUrl.length > 0">
                  <img class="w-90px h-40px" :src="item.signPicUrl" alt="" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- 兜底：无数据提示 -->
      <div v-else class="no-data-tip text-center text-16px text-gray-500 py-5">
        暂无可打印的表单数据
      </div>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" v-print="printObj"> 打 印</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style>
/* 基础样式：修复打印只显示一页 + A4适配核心 */
#printDivTag {
  overflow: visible !important;
  height: auto !important;
  width: 100% !important;
  max-width: 794px !important;
  /* A4纸宽度（210mm）对应的CSS像素，核心！ */
  margin: 0 auto !important;
  /* 居中，避免左右留白不均 */
  padding: 0 10px !important;
  /* 内边距，避免内容贴边 */
  box-sizing: border-box !important;
}

/* 自定义表单容器专属样式 */
.custom-form-container {
  width: 100% !important;
  max-width: 794px !important;
  /* 和打印容器保持一致 */
  margin: 0 auto !important;
  font-family: "SimSun", "宋体", serif !important;
  /* 打印友好字体 */
  font-size: 14px !important;
  /* 标准打印字号 */
  line-height: 1.5 !important;
  /* 行高适配 */
}

@media print {

  /* 1. 基础分页配置：A4纵向，统一边距 */
  @page {
    size: A4 portrait !important;
    margin: 10mm !important;
    /* 禁用自动生成的空白页（部分浏览器的兜底） */
    orphans: 1;
    widows: 1;
  }

  /* 2. 核心修复：移除所有容器的固定高度/溢出/定位，确保打印引擎识别完整内容 */
  body,
  html,
  div,
  #app,
  .el-dialog,
  .el-dialog__body,
  .form-group,
  .main-form,
  .detail-table {
    height: auto !important;
    /* 关键：高度自适应，避免截断/空白 */
    overflow: visible !important;
    /* 移除溢出隐藏，显示全部内容 */
    position: static !important;
    /* 修复弹窗定位导致的打印异常 */
    float: none !important;
    /* 清除浮动，避免布局错乱 */
  }

  /* 1. 新增：隐藏按钮等非打印元素（核心修改） */
  button,
  .el-button,
  .btn,
  .operate-bar,
  .action-btn,
  .el-dialog__header,
  .el-dialog__footer {
    display: none !important;
  }

  /* 3. 核心需求：仅当【主表后紧跟非空明细表】时，才在明细表前分页 */
  /* 3.1 先给非空明细表标记（通过内容判断） */
  .detail-table:not(:empty) {
    --has-content: 1;
  }

  /* 3.2 仅主表 + 有内容的明细表 组合时分页 */
  .main-form+.detail-table:not(:empty) {
    page-break-before: always !important;
    break-before: page !important;
    /* 现代浏览器兼容 */
  }

  /* 4. 防空白页核心：
     - 内容不被拆分（避免跨页截断）
     - 空容器直接隐藏，不占页
  */
  /* 4.1 主表/明细表内容不被拆分 */
  .main-form,
  .detail-table {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* 4.2 空明细表直接隐藏，杜绝空白页 */
  .detail-table:empty {
    display: none !important;
  }

  /* 5. 兜底：最后一个元素永不强制分页，避免末尾空白页 */
  .form-group:last-child,
  .main-form:last-child,
  .detail-table:last-child {
    page-break-after: auto !important;
    break-after: auto !important;
  }

  /* 6. 兼容优化：保留打印样式一致性 */
  * {
    box-sizing: border-box !important;
    -webkit-print-color-adjust: exact !important;
    /* 保留颜色 */
    print-color-adjust: exact !important;
  }
}
</style>