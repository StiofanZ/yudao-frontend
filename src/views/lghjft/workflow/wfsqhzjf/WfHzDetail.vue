<template>
  <div class="print-wrapper">
    <!-- 主申请表区域：打印在第一页A4 -->
    <div class="main-form-container" id="print-area-main">
      <div class="title-section">
        <h1 class="form-title">甘肃省工会经费汇总缴纳申请表</h1>
      </div>

      <!-- 1. 基础信息表格 -->
      <table class="form-table form-table_info">
        <tr>
          <th>申请汇总缴费单位<br />社会信用代码</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.xyxdm" disabled class="form-input" />
            <span v-else class="form-input">{{ data.xyxdm || '' }}</span>
          </td>
          <th>申请汇总缴费<br />单位全称</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.dwqc" disabled class="form-input" />
            <span v-else class="form-input">{{ data.dwqc || '' }}</span>
          </td>
        </tr>
        <tr>
          <th>主管税务部门</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.zgsbm" disabled class="form-input" />
            <span v-else class="form-input">{{ data.zgsbm || '' }}</span>
          </td>
          <th>缴费单位地址</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.dwdz" disabled class="form-input" />
            <span v-else class="form-input">{{ data.dwdz || '' }}</span>
          </td>
        </tr>
        <tr>
          <th>工会法人<br />登记证件号码</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.ghfrdjzjh" disabled class="form-input" />
            <span v-else class="form-input">{{ data.ghfrdjzjh || '' }}</span>
          </td>
          <th>缴费单位<br />工会全称</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.ghqc" disabled class="form-input" />
            <span v-else class="form-input">{{ data.ghqc || '' }}</span>
          </td>
        </tr>
        <tr>
          <th>职工总人数</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.zzgzs" disabled class="form-input" type="number" />
            <span v-else class="form-input">{{ data.zzgzs || '' }}</span>
          </td>
          <th>工会会员数</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.ghyhs" disabled class="form-input" type="number" />
            <span v-else class="form-input">{{ data.ghyhs || '' }}</span>
          </td>
        </tr>
        <tr>
          <th>工会负责人</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.ghfzr" disabled class="form-input" />
            <span v-else class="form-input">{{ data.ghfzr || '' }}</span>
          </td>
          <th>联系电话</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.lxdh" disabled class="form-input" />
            <span v-else class="form-input">{{ data.lxdh || '' }}</span>
          </td>
        </tr>
        <tr>
          <th>工会账户账号</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.ghzhzh" disabled class="form-input" />
            <span v-else class="form-input">{{ data.ghzhzh || '' }}</span>
          </td>
          <th>开户银行名称</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.khyhmc" disabled class="form-input" />
            <span v-else class="form-input">{{ data.khyhmc || '' }}</span>
          </td>
        </tr>
        <tr>
          <th>工会账户户名</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.ghzhhm" disabled class="form-input" />
            <span v-else class="form-input">{{ data.ghzhhm || '' }}</span>
          </td>
          <th>开户银行<br />网点代码</th>
          <td>
            <input v-if="!printModeFlag" v-model="data.khyhwdm" disabled class="form-input" placeholder="非必填" />
            <span v-else class="form-input">{{ data.khyhwdm || '' }}</span>
          </td>
        </tr>
      </table>

      <!-- 2. 汇总申报原因 → 只改这里布局风格，样式完全不变 -->
      <table class="form-table">
        <tr>
          <th width="18%">汇总申报缴纳原因</th>
          <td colspan="3" width="82%">
            <textarea v-if="!printModeFlag" v-model="data.hzbsjygy" disabled class="form-textarea" rows="5"></textarea>
            <span v-else class="form-textarea">{{ data.hzbsjygy || '' }}</span>

            <div class="sign-block">
              <div>(盖章)</div>
              <div>负责人：
                <input v-if="!printModeFlag" v-model="data.fzrxm" disabled class="sign-input" />
                <span v-else class="sign-input">{{ data.fzrxm || '' }}</span>
              </div>
              <div>经办人及联系电话：
                <input v-if="!printModeFlag" v-model="data.jbrxm" disabled class="sign-input" />
                <span v-else class="sign-input">{{ data.jbrxm || '' }}</span>
                <span v-if="data.jbrdh" style="margin-left: 10px;">/</span>
                <input v-if="!printModeFlag && data.jbrdh" v-model="data.jbrdh" disabled class="sign-input"
                  style="width: 100px;" />
                <span v-else-if="data.jbrdh" class="sign-input" style="width: 100px;">{{ data.jbrdh || '' }}</span>
              </div>
              <div class="date-line">
                <span class="mini-input">{{ formatDatePart(data.sqrq, 'year') }}</span> 年
                <span class="mini-input">{{ formatDatePart(data.sqrq, 'month') }}</span> 月
                <span class="mini-input">{{ formatDatePart(data.sqrq, 'day') }}</span> 日
              </div>
            </div>
          </td>
        </tr>
      </table>

      <!-- 3. 附件资料说明 -->
      <div class="attachment-note" style="text-align: center; border-top:none;">
        附件资料：共
        <input v-if="!printModeFlag" v-model="data.fjgzs" disabled class="mini-input" type="number" />
        <span v-else class="mini-input">{{ data.fjgzs || 0 }}</span>
        户分支机构（下属企业、子公司）申请汇总缴纳工会经费。
      </div>

      <!-- 4. 审核意见区 → 完全保持你原来的样子 -->
      <table class="form-table">
        <tr>
          <th width="20%">主管工会<br />审核意见</th>
          <td width="30%">
            <div style="text-align: center;">（盖章）</div>
            <textarea v-if="!printModeFlag" v-model="data.zgghsjy" disabled class="approval-textarea" rows="2"
              style="margin-top:20px;font-weight: bolder; font-size: 20px;"></textarea>
            <span v-else class="approval-textarea" style="min-height: 60px;">{{ data.zgghsjy || '' }}</span>

            <div>负责人：
              <input v-if="!printModeFlag" v-model="data.zgghsfzr" disabled class="sign-input" />
              <span v-else class="sign-input">{{ data.zgghsfzr || '' }}</span>
            </div>
            <div>经办人及联系电话：<br />
              <input v-if="!printModeFlag" v-model="data.zgghsjbr" disabled class="sign-input" style="width:80px;" />
              <span v-else class="sign-input" style="width:60px;">{{ data.zgghsjbr || '' }}</span>
              <span v-if="data.zgghsjbrdh" style="margin-left: 10px;">/</span>
              <input v-if="!printModeFlag && data.zgghsjbrdh" v-model="data.zgghsjbrdh" disabled class="sign-input"
                style="width: 100px;" />
              <span v-else-if="data.zgghsjbrdh" class="sign-input" style="width: 100px;"> {{ data.zgghsjbrdh || ''
              }}</span>
            </div>
            <div class="date-line">
              <span class="mini-input">{{ formatDatePart(data.zgghsrq, 'year') }}</span> 年
              <span class="mini-input">{{ formatDatePart(data.zgghsrq, 'month') }}</span> 月
              <span class="mini-input">{{ formatDatePart(data.zgghsrq, 'day') }}</span> 日
            </div>
          </td>
          <th width="20%">省总工会<br />审核意见</th>
          <td width="30%">
            <div style="text-align: center;">（盖章）</div>
            <textarea v-if="!printModeFlag" v-model="data.sghzsjy" disabled class="approval-textarea" rows="2"
              style="margin-top:20px; font-weight: bolder; font-size: 20px;"></textarea>
            <span v-else class="approval-textarea" style="min-height: 60px; ">{{ data.sghzsjy || '' }}</span>

            <div>负责人：
              <input v-if="!printModeFlag" v-model="data.sghsfzr" disabled class="sign-input" />
              <span v-else class="sign-input">{{ data.sghsfzr || '' }}</span>
            </div> <br />
            <br />
            <div class="date-line">
              <span class="mini-input">{{ formatDatePart(data.sghsrq, 'year') }}</span> 年
              <span class="mini-input">{{ formatDatePart(data.sghsrq, 'month') }}</span> 月
              <span class="mini-input">{{ formatDatePart(data.sghsrq, 'day') }}</span> 日
            </div>
          </td>
        </tr>
      </table>

      <!-- 按钮区 -->
      <div v-if="!printModeFlag" class="btn-group">
        <el-button type="success" class="print-btn" @click="openBranchDialog">查看机构明细</el-button>
      </div>
    </div>

    <!-- 分支机构明细附件表：打印在第二页A4 -->
    <div v-if="printModeFlag && branchList.length > 0" class="attachment-form-container" id="print-area-attachment">
      <div class="title-section">
        <h1 class="form-title">汇总缴纳分支机构（下属企业、子公司）明细表</h1>
      </div>
      <div style="transform: scale(0.97); transform-origin: top left; width: 103%;">
        <table class="form-table form-table-fb" style="width: 100%;">
          <tr style="background: #f5f5f5; ">
            <th style="width: 8%;">序号</th>
            <th style="width: 20%;">社会信用代码</th>
            <th style="width: 25%;">分支机构全称</th>
            <th style="width: 22%;">主管税务部门</th>
            <th style="width: 10%;">职工人数</th>
            <th style="width: 15%;">月工资总额</th>
          </tr>
          <tr v-for="(item, index) in branchList" :key="item.id || index">
            <td style="text-align: center;">{{ index + 1 }}</td>
            <td>{{ item.fjgxyxdm || '' }}</td>
            <td>{{ item.fjgdwqc || '' }}</td>
            <td>{{ item.fjgzgsbm || '' }}</td>
            <td style="text-align: center;">{{ item.fjggzs || 0 }}</td>
            <td style="text-align: center;">{{ item.fjggzze || 0 }}</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- 分支机构明细弹窗 -->
    <el-dialog v-model="branchDialogVisible" title="分支机构明细" width="80%" height="90vh" top="10px" destroy-on-close
      append-to-body>
      <mxDetail :branch-list="branchList" @close="branchDialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { getHZFDetail, HzApplyDetailRespVO } from '@/api/lghjft/workflow/wfsqhzjf/index'
import mxDetail from './mxDetail.vue'

// 定义后端可能返回的日期类型（数组/字符串）
type DateType = string | number[]

// 扩展接口
interface HzApplyDetailRespVOExt extends Omit<HzApplyDetailRespVO, 'detailList' | 'branchList'> {
  detailList?: Array<{
    fjgxyxdm: string
    fjgdwqc: string
    fjgzgsbm: string
    fjggzs: number
    fjggzze: number
    hzId?: number
    id?: number
  }>
  sqrq: string
  zgghsrq?: string
  sghsrq?: string
  fjgzs?: number
  hzbsjygy: string
  fzrxm?: string
  jbrxm?: string
  jbrdh?: string
  zgghsjy?: string
  zgghsfzr?: string
  zgghsjbr?: string
  zgghsjbrdh?: string
  sghzsjy?: string
  sghsfzr?: string
}

// 接收父组件参数（ID + 打印模式）
const props = defineProps<{
  id: number
  isPrintMode?: boolean
}>()

// 初始化表单数据
const data = ref<HzApplyDetailRespVOExt>({
  id: 0,
  xyxdm: '',
  dwqc: '',
  zgsbm: '',
  dwdz: '',
  ghfrdjzjh: '',
  ghqc: '',
  zzgzs: 0,
  ghyhs: 0,
  ghfzr: '',
  lxdh: '',
  ghzhzh: '',
  khyhmc: '',
  ghzhhm: '',
  khyhwdm: '',
  hzbsjygy: '',
  fzrxm: '',
  jbrxm: '',
  jbrdh: '',
  sqrq: '',
  fjgzs: 0,
  gzzt: '',
  attachments: [],
  detailList: [],
  zgghsjy: '',
  zgghgzz: '',
  zgghsfzr: '',
  zgghsjbr: '',
  zgghsjbrdh: '',
  zgghsrq: '',
  sghzsjy: '',
  sghgzz: '',
  sghsfzr: '',
  sghsrq: ''
})

// 响应式变量
const branchList = ref<Array<{
  fjgxyxdm: string
  fjgdwqc: string
  fjgzgsbm: string
  fjggzs: number
  fjggzze: number
  hzId?: number
  id?: number
}>>([])

const printModeFlag = ref<boolean>(false)
const branchDialogVisible = ref<boolean>(false)

// 监听打印模式
watch(() => props.isPrintMode, (val) => {
  printModeFlag.value = val || false
}, { immediate: true })

// 页面挂载加载数据
onMounted(async () => {
  await loadDetail()
})

// 加载详情数据
const loadDetail = async () => {
  try {
    const res = await getHZFDetail(props.id)
    console.log(res)

    const resData = res as HzApplyDetailRespVOExt
    data.value = { ...data.value, ...resData }

    if (resData.detailList && Array.isArray(resData.detailList) && resData.detailList.length > 0) {
      branchList.value = JSON.parse(JSON.stringify(resData.detailList))
    } else {
      branchList.value = []
      ElMessage.info('暂无分支机构明细数据')
    }
  } catch (error) {
    console.error('数据加载失败：', error)
    ElMessage.error('申请表详情加载失败，请刷新重试')
  }
}

// 格式化日期字段
const formatDatePart = (date: DateType | undefined, type: 'year' | 'month' | 'day'): string => {
  if (!date) return ''
  if (Array.isArray(date) && date.length === 3) {
    const [year, month, day] = date
    if (type === 'year') return year.toString()
    if (type === 'month') return month.toString().padStart(2, '0')
    if (type === 'day') return day.toString().padStart(2, '0')
  }
  if (typeof date === 'string' && date.includes('-')) {
    const [year, month, day] = date.split('-')
    if (type === 'year') return year
    if (type === 'month') return month
    if (type === 'day') return day
  }
  return ''
}

// 打开分支机构弹窗
const openBranchDialog = () => {
  branchDialogVisible.value = true
}
</script>

<style scoped>
/* 打印容器总样式 */
.print-wrapper {
  width: 100%;
  min-height: 100vh;
}

/* 主申请表容器 */
.main-form-container {
  max-width: 850px;
  margin: 30px auto;
  padding: 0 20px;
  font-family: "SimSun", serif;
  font-size: 17px;
  page-break-after: always;
}

/* 附件表容器（仅打印模式显示） */
.attachment-form-container {
  max-width: 850px;
  margin: 0 auto;
  padding: 0 20px;
  font-family: "SimSun", serif;
  font-size: 17px;
}

.title-section {
  text-align: center;
  margin-bottom: 25px;
}

.form-title {
  font-size: 22px;
  font-weight: bold;
  margin: 0;
  margin-bottom: 15px;
}

.form-table {
  border-bottom: none;
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #000;
  page-break-inside: avoid;
}

.form-table_info th,
td {
  border: 1px solid #000;
  padding: 8px 0px;
  vertical-align: middle;
}

.form-table th,
.form-table td {
  border: 1px solid #000;
  vertical-align: middle;
}

.form-table th {

  text-align: center;
  font-weight: normal;
  width: 20%;
  min-width: 120px;
}

.form-input {
  width: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
}

.form-textarea {
  border: none;
  width: 100%;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  resize: none;
  min-height: 80px;
  padding: 0;
  margin: 0;
}

.approval-textarea {
  width: 90%;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: 20px;
  font-weight: bold;
  resize: none;
  min-height: 40px;
  margin: 10px 0;
}

.mini-input {
  width: 50px;
  border: none;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  text-align: center;
}

.sign-block {
  padding-left: 20px;
}

.sign-input {
  border: none;
  border-bottom: 1px solid #000;
  outline: none;
  background: transparent;
  font-family: inherit;
  font-size: inherit;
  width: 120px;
  margin-left: 5px;
  text-align: center;
  display: inline-block !important;
}

.date-line {
  margin-top: 15px;
  text-align: right;
}

.attachment-note {
  padding: 8px;
  border: 1px solid #000;
  border-bottom: none;
  margin-bottom: -1px;
}

.btn-group {
  display: flex;
  justify-content: center;
  gap: 30px;
  margin-top: 30px;
}

.print-btn {
  padding: 10px 20px;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  height: 40px;
  line-height: 20px;
}

/* 打印适配核心样式 */
@media print {

  :deep(.el-button),
  .btn-group,
  :deep(.el-dialog),
  :deep(.el-dialog__wrapper) {
    display: none !important;
  }

  .form-table_info th,
  td {
    border: 1px solid #000;
    padding: 4px 0px;
    vertical-align: middle;
  }

  .form-table-fb {
    border: 2px solid #000;
  }

  /* 强制打印高度，解决你说的不显示高度问题 */
  .form-textarea {
    /* border: 1px solid red; */
    min-height: 120px !important;
    height: 80px !important;
    display: block !important;
  }

  .approval-textarea {
    min-height: 60px !important;
    height: 60px !important;
    display: block !important;
  }
}
</style>