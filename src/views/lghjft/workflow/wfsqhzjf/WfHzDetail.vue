<template>
  <div class="apply-form-container" id="print-area">
    <div class="a4-paper" id="print-target-apply">
      <!-- 申请表标题 -->
      <div class="form-title">工会经费汇总缴纳申请表</div>

      <!-- 1. 基本信息模块 -->
      <div class="form-module">
        <div class="vertical-label-box" style="height: 74mm;">
          <div class="vertical-label">基本信息</div>
        </div>
        <div class="module-content" style="height: 74mm;">
          <!-- 社会信用代码 + 单位全称 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">社会信用代码：</span>
              <el-input v-if="!isPrintMode" v-model="data.xyxdm" disabled class="form-input" />
              <span v-else class="print-text">{{ data.xyxdm || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">申请单位全称：</span>
              <el-input v-if="!isPrintMode" v-model="data.dwqc" disabled class="form-input" />
              <span v-else class="print-text">{{ data.dwqc || '————————————————————' }}</span>
            </div>
          </div>
          <!-- 主管税务部门 + 单位地址 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">主管税务部门：</span>
              <el-input v-if="!isPrintMode" v-model="data.zgsbm" disabled class="form-input" />
              <span v-else class="print-text">{{ data.zgsbm || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">缴费单位地址：</span>
              <el-input v-if="!isPrintMode" v-model="data.dwdz" disabled class="form-input" />
              <span v-else class="print-text">{{ data.dwdz || '————————————————————' }}</span>
            </div>
          </div>
          <!-- 工会法人登记证号 + 工会全称 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">工会法人登记证件号码：</span>
              <el-input v-if="!isPrintMode" v-model="data.ghfrdjzjh" disabled class="form-input" />
              <span v-else class="print-text">{{ data.ghfrdjzjh || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">缴费单位工会全称：</span>
              <el-input v-if="!isPrintMode" v-model="data.ghqc" disabled class="form-input" />
              <span v-else class="print-text">{{ data.ghqc || '————————————————————' }}</span>
            </div>
          </div>
          <!-- 职工总人数 + 工会会员数 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">职工总人数：</span>
              <el-input v-if="!isPrintMode" v-model="data.zzgzs" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ data.zzgzs || '————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">工会会员数：</span>
              <el-input v-if="!isPrintMode" v-model="data.ghyhs" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ data.ghyhs || '————————' }}</span>
            </div>
          </div>
          <!-- 工会负责人 + 联系电话 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">工会负责人：</span>
              <el-input v-if="!isPrintMode" v-model="data.ghfzr" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ data.ghfzr || '————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">联系电话：</span>
              <el-input v-if="!isPrintMode" v-model="data.lxdh" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ data.lxdh || '————————' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. 账户信息模块 -->
      <div class="form-module">
        <div class="vertical-label-box double-item-box" style="height: 30mm;">
          <div class="vertical-label">账户信息</div>
        </div>
        <div class="module-content" style="height: 30mm;">
          <!-- 工会账户账号 + 开户银行名称 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">工会账户账号：</span>
              <el-input v-if="!isPrintMode" v-model="data.ghzhzh" disabled class="form-input" />
              <span v-else class="print-text">{{ data.ghzhzh || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">开户银行名称：</span>
              <el-input v-if="!isPrintMode" v-model="data.khyhmc" disabled class="form-input" />
              <span v-else class="print-text">{{ data.khyhmc || '————————————————————' }}</span>
            </div>
          </div>
          <!-- 工会账户户名 + 开户银行网点代码 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">工会账户户名：</span>
              <el-input v-if="!isPrintMode" v-model="data.ghzhhm" disabled class="form-input" />
              <span v-else class="print-text">{{ data.ghzhhm || '————————————————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">开户银行网点代码：</span>
              <el-input v-if="!isPrintMode" v-model="data.khyhwdm" placeholder="非必填" disabled class="form-input" />
              <span v-else class="print-text">{{ data.khyhwdm || '————————————————————' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. 申请信息模块 -->
      <div class="form-module">
        <div class="vertical-label-box">
          <div class="vertical-label">申请信息</div>
        </div>
        <div class="module-content attachment-module" style="height: 30mm;">
          <!-- 汇总申报缴纳原因 -->
          <div class="form-row single-item">
            <span class="item-label">汇总申报缴纳原因：</span>
            <el-input v-if="!isPrintMode" v-model="data.hzbsjygy" type="textarea" :rows="4" disabled
              class="form-textarea" />
            <span v-else class="print-textarea">{{ data.hzbsjygy ||
              '————————————————————————————————————————————————————————————————————————————————————————————————————'
            }}</span>
          </div>
          <!-- 负责人+经办人 -->
          <div class="form-row double-item" style="margin-top: 2mm;">
            <div class="form-item">
              <span class="item-label">负责人：</span>
              <el-input v-if="!isPrintMode" v-model="data.fzrxm" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ data.fzrxm || '————————' }}</span>
            </div>
            <div class="form-item">
              <span class="item-label">经办人姓名：</span>
              <el-input v-if="!isPrintMode" v-model="data.jbrxm" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ data.jbrxm || '————————' }}</span>
            </div>
          </div>
          <!-- 经办人电话+申请日期 -->
          <div class="form-row double-item">
            <div class="form-item">
              <span class="item-label">经办人联系电话：</span>
              <el-input v-if="!isPrintMode" v-model="data.jbrdh" disabled class="form-input short-input" />
              <span v-else class="print-text short-text">{{ data.jbrdh || '————————' }}</span>
            </div>
            <div class="form-item date-item">
              <span class="item-label">申请日期：</span>
              <el-date-picker v-if="!isPrintMode" v-model="data.sqrq" type="date" format="YYYY-MM-DD"
                value-format="YYYY-MM-DD" disabled class="form-date" />
              <span v-else class="print-text short-text">{{ data.sqrq || '____年__月__日' }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. 分支机构信息模块 -->
      <div class="form-module">
        <div class="vertical-label-box">
          <div class="vertical-label">分支机构</div>
        </div>
        <div class="module-content attachment-module" style="height: 20mm;">
          <div class="branch-info">
            <span>共 {{ data.fjgzs || 0 }} 户分支机构申请汇总缴纳工会经费。</span>
            <el-button v-if="!isPrintMode" type="primary" size="small" icon="el-icon-edit" @click="openBranchDialog"
              style="margin-left: 16px;">
              查看分支机构明细
            </el-button>
          </div>
          <!-- 附件信息 -->
          <div class="uploaded-attachment" v-if="attachmentList.length > 0 && attachmentList[0].label !== '无'">
            <div class="upload-title">已上传附件：</div>
            <el-table :data="attachmentList" :show-header="false" border style="width: 100%; margin-top: 8px;">
              <el-table-column prop="label" width="300" />
              <el-table-column prop="name">
                <template #default="scope">
                  <a :href="scope.row.url" target="_blank" class="file-link">{{ scope.row.name }}</a>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>

      <!-- 5. 受理情况模块 -->
      <div class="form-module last-module" v-if="showHandleSection">
        <!-- 左侧标签高度动态计算 -->
        <div class="vertical-label-box vertical-button-box" :style="{ height: handleModuleHeight + 'mm' }">
          <div class="vertical-label">受理情况</div>
        </div>

        <div class="module-content handle-module" :style="{ height: handleModuleHeight + 'mm' }">
          <!-- 主管工会审批盒子 -->
          <div v-if="showManagerSection" class="approve-box">
            <div class="approve-title">主管工会审批意见：</div>
            <el-input v-if="!isPrintMode" v-model="data.zgghsjy" type="textarea" :rows="4" disabled
              class="approve-textarea" />
            <span v-else class="print-approve-text">{{ data.zgghsjy ||
              '————————————————————————————————————————————————————————————————————————————————————————————————————'
            }}</span>
            <div class="approve-footer">
              <div class="footer-item">
                <span class="footer-label">负责人：</span>
                <el-input v-if="!isPrintMode" v-model="data.zgghsfzr" disabled class="footer-input" />
                <span v-else class="print-footer-text">{{ data.zgghsfzr || '————————' }}</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">经办人：</span>
                <el-input v-if="!isPrintMode" v-model="data.zgghsjbr" disabled class="footer-input" />
                <span v-else class="print-footer-text">{{ data.zgghsjbr || '————————' }}</span>
              </div>
              <div class="footer-item">
                <span class="footer-label">经办人电话：</span>
                <el-input v-if="!isPrintMode" v-model="data.zgghsjbrdh" disabled class="footer-input" />
                <span v-else class="print-footer-text">{{ data.zgghsjbrdh || '————————' }}</span>
              </div>
              <div class="footer-item date-footer">
                <span class="item-label">审批日期：</span>
                <el-date-picker v-if="!isPrintMode" v-model="data.sqrq" type="date" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" disabled class="form-date" />
                <span v-else class="print-text short-text">{{ data.sqrq || '____年__月__日' }}</span>
              </div>
              <div class="footer-item seal-item">(盖章)</div>
            </div>
          </div>
          <!-- 省总工会审批盒子 -->
          <div v-if="showProvinceSection" class="approve-box">
            <div class="approve-title">省总工会审核意见：</div>
            <el-input v-if="!isPrintMode" v-model="data.sghzsjy" type="textarea" :rows="4" disabled
              class="approve-textarea" />
            <span v-else class="print-approve-text">{{ data.sghzsjy ||
              '————————————————————————————————————————————————————————————————————————————————————————————————————'
            }}</span>
            <div class="approve-footer">
              <div class="footer-item">
                <span class="footer-label">负责人：</span>
                <el-input v-if="!isPrintMode" v-model="data.sghsfzr" disabled class="footer-input" />
                <span v-else class="print-footer-text">{{ data.sghsfzr || '————————' }}</span>
              </div>
              <div class="footer-item date-footer">
                <span class="item-label">审批日期：</span>
                <el-date-picker v-if="!isPrintMode" v-model="data.sqrq" type="date" format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD" disabled class="form-date" />
                <span v-else class="print-text short-text">{{ data.sqrq || '____年__月__日' }}</span>
              </div>
              <div class="footer-item seal-item">(盖章)</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 打印按钮 -->
    <div class="no-print print-btn-box">
      <el-button type="primary" size="large" @click="handlePrint">打印申请表</el-button>
    </div>

    <!-- 分支机构明细弹窗（引用 mxDetail 组件） -->
    <el-dialog v-model="branchDialogVisible" title="分支机构明细" width="80%" height="90vh" top="10px" destroy-on-close
      append-to-body>
      <mxDetail :branch-list="branchList" @close="branchDialogVisible = false" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import { getHZFDetail, HzApplyDetailRespVO } from '@/api/lghjft/workflow/wfsqhzjf/index'
// 导入分支机构明细组件（mxDetail.vue）
import mxDetail from './mxDetail.vue'

// 扩展接口类型，适配实际返回的字段结构
interface HzApplyDetailRespVOExt extends HzApplyDetailRespVO {
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
  zgghsrq: string
  sghsrq: string
}

// 附件数据类型
interface AttachmentItem {
  label: string
  name: string
  url?: string
}

// 接收父组件传递的ID参数
const props = defineProps<{ id: number }>()

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
  branchList: [],
  detailList: [], // 实际返回的分支机构明细字段
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

// 附件列表
const attachmentList = ref<AttachmentItem[]>([])
// 分支机构明细数据
const branchList = ref<any[]>([])
// 打印模式标识
const isPrintMode = ref(false)
// 分支机构弹窗显示状态
const branchDialogVisible = ref(false)

// 页面加载时获取详情数据
onMounted(async () => {
  await loadDetail()
})

// 加载详情数据的核心函数
const loadDetail = async () => {
  try {
    // 调用接口获取数据
    const res = await getHZFDetail(props.id)
    const resData = res as HzApplyDetailRespVOExt
    data.value = resData

    // 处理分支机构明细数据（核心：读取 detailList 字段）
    if (resData.detailList && Array.isArray(resData.detailList)) {
      branchList.value = JSON.parse(JSON.stringify(resData.detailList))
      console.log('分支机构明细数据：', branchList.value) // 调试用日志
    } else {
      branchList.value = []
      ElMessage.info('暂无分支机构明细数据')
    }

    // 处理申请日期格式（数组转字符串）
    if (Array.isArray(resData.sqrq) && resData.sqrq.length === 3) {
      const [year, month, day] = resData.sqrq
      data.value.sqrq = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }
    // 新增：复用相同逻辑处理主管工会审批日期
    if (Array.isArray(resData.zgghsrq) && resData.zgghsrq.length === 3) {
      const [year, month, day] = resData.zgghsrq
      resData.zgghsrq = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }

    // 新增：复用相同逻辑处理省总工会审核日期
    if (Array.isArray(resData.sghsrq) && resData.sghsrq.length === 3) {
      const [year, month, day] = resData.sghsrq
      resData.sghsrq = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
    }

    // 处理附件数据
    const attachments: AttachmentItem[] = []
    if (resData.attachments && resData.attachments.length > 0) {
      resData.attachments.forEach((item, index) => {
        attachments.push({
          label: `附件${index + 1}`,
          name: item.name || `附件${index + 1}`,
          url: item.fileId ? `/file/download?id=${item.fileId}` : ''
        })
      })
    } else {
      attachments.push({ label: '无', name: '未上传任何附件' })
    }
    attachmentList.value = attachments

  } catch (error) {
    console.error('数据加载失败：', error)
    ElMessage.error('申请表详情加载失败，请刷新重试')
  }
}

// 打开分支机构明细弹窗
const openBranchDialog = () => {
  branchDialogVisible.value = true
}

// 打印申请表
const handlePrint = () => {
  isPrintMode.value = true
  // 延迟执行打印，确保DOM渲染完成
  setTimeout(() => {
    window.print()
    isPrintMode.value = false
  }, 100)
}
// 新增：判断是否显示整个受理情况模块
const showHandleSection = computed(() => showManagerSection.value || showProvinceSection.value)
// 计算是否显示主管工会审批区域
const showManagerSection = computed(() => !!(
  data.value.zgghsjy || data.value.zgghsfzr || data.value.zgghsjbr ||
  data.value.zgghsjbrdh || data.value.zgghsrq
))

// 计算是否显示省总工会审批区域
const showProvinceSection = computed(() => !!(
  data.value.sghzsjy || data.value.sghsfzr || data.value.sghsrq
))

// 动态计算受理情况模块的高度
const handleModuleHeight = computed(() => {
  let height = 0
  if (showManagerSection.value) height += 65
  if (showProvinceSection.value) height += 65
  if (showManagerSection.value && showProvinceSection.value) height += 2
  return height > 0 ? height : 60
})
</script>

<style scoped>
/* 全局样式重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 页面容器样式 */
.apply-form-container {
  width: 100%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'SimSun', '宋体', sans-serif;
  background-color: #f9f9f9;
}

/* A4纸张样式 */
.a4-paper {
  width: 210mm;
  min-height: 297mm;
  padding: 15mm 10mm;
  border: 1px solid #e0e0e0;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background: #fff;
  margin-bottom: 20px;
}

/* 打印按钮样式 */
.print-btn-box {
  margin-top: 20px;
}

/* 表单标题样式 */
.form-title {
  font-size: 22px;
  font-weight: bold;
  text-align: center;
  margin-bottom: 10mm;
  letter-spacing: 2px;
  color: #333;
}

/* 表单模块容器 */
.form-module {
  display: flex;
  width: 100%;
  position: relative;
}

/* 最后一个模块取消底部间距 */
.last-module {
  margin-bottom: 0;
}

/* 左侧垂直标签盒子 */
.vertical-label-box {
  width: 10mm;
  height: 60mm;
  border: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  background-color: #f5f5f5;
}

/* 垂直标签文字 */
.vertical-label {
  writing-mode: vertical-rl;
  text-orientation: mixed;
  font-size: 18px;
  font-weight: bold;
  letter-spacing: 4px;
  color: #333;
}

/* 模块内容区域 */
.module-content {
  flex: 1;
  height: 60mm;
  border: 1px solid #000;
  padding: 5mm;
  background-color: #fff;
}

/* 附件/分支机构模块高度自适应 */
.attachment-module,
.handle-module {
  height: auto;
  min-height: 60mm;
}

/* 受理情况模块样式 */
.handle-module {
  display: flex;
  flex-direction: column;
  padding: 2mm;
  justify-content: flex-start;
}

/* 审批盒子样式 */
.approve-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2mm;
  padding: 3mm;
  min-height: 60mm;
}

/* 审批标题样式 */
.approve-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 2mm;
  color: #333;
}

/* 审批文本域样式 */
.approve-textarea {
  width: 100%;
  --el-input-border-color: #000;
  flex: 1;
  resize: none;
}

/* 审批底部信息栏 */
.approve-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: auto;
  padding-top: 3mm;
  border-top: 1px solid #eee;
  flex-wrap: wrap;
  gap: 2mm;
}

/* 底部信息项 */
.footer-item {
  display: flex;
  align-items: center;
  gap: 2mm;
}

/* 底部标签文字 */
.footer-label {
  font-size: 12px;
  font-weight: bold;
  white-space: nowrap;
  color: #333;
}

/* 底部输入框样式 */
.footer-input {
  width: 30mm;
  height: 6mm;
  --el-input-border-color: #000;
}

/* 底部日期选择器样式 */
.footer-date {
  width: 40mm;
  height: 6mm;
  --el-input-border-color: #000;
}

/* 盖章提示文字 */
.seal-item {
  font-weight: bold;
  font-size: 14px;
  margin-left: 2mm;
  color: #333;
}

/* 表单行样式 */
.form-row {
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 3mm;
}

/* 最后一行取消底部间距 */
.form-row:last-child {
  margin-bottom: 0;
}

/* 双列布局 */
.double-item {
  justify-content: space-between;
}

/* 单列布局 */
.single-item {
  flex-direction: column;
  align-items: flex-start;
}

/* 表单项样式 */
.form-item {
  display: flex;
  align-items: center;
  gap: 2mm;
  width: 100%;
}

/* 双列表单项宽度 */
.double-item .form-item {
  width: 48%;
}

/* 表单项标签 */
.item-label {
  font-size: 14px;
  font-weight: bold;
  white-space: nowrap;
  color: #333;
}

/* 表单输入框样式 */
.form-input {
  flex: 1;
  height: 8mm;
  --el-input-border-color: #000;
}

/* 短输入框样式 */
.short-input {
  width: 40mm;
}

/* 文本域样式 */
.form-textarea {
  width: 100%;
  --el-input-border-color: #000;
  margin-top: 2mm;
  resize: none;
}

/* 日期选择器样式 */
.form-date {
  width: 40mm;
  height: 8mm;
  --el-input-border-color: #000;
}

/* 日期项对齐方式 */
.date-item {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2mm;
}

/* 分支机构信息样式 */
.branch-info {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin: 10px 0;
}

/* 附件标题样式 */
.upload-title {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
}

/* 附件链接样式 */
.file-link {
  color: #0066cc;
  text-decoration: underline;
}

/* 打印模式文本样式 */
.print-text {
  display: inline-block;
  border-bottom: 1px solid #000;
  height: 8mm;
  line-height: 8mm;
  padding: 0 2mm;
  width: calc(100% - 60px);
  color: #333;
}

/* 短文本打印样式 */
.print-text.short-text {
  width: 40mm;
}

/* 文本域打印样式 */
.print-textarea {
  display: block;
  width: 100%;
  min-height: 30mm;
  border-bottom: 1px solid #000;
  padding: 2mm;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
}

/* 审批文本打印样式 */
.print-approve-text {
  display: block;
  width: 100%;
  min-height: 25mm;
  border-bottom: 1px solid #000;
  padding: 2mm;
  white-space: pre-wrap;
  line-height: 1.5;
  color: #333;
}

/* 底部文本打印样式 */
.print-footer-text {
  display: inline-block;
  border-bottom: 1px solid #000;
  height: 6mm;
  line-height: 6mm;
  padding: 0 2mm;
  width: 30mm;
  color: #333;
}

/* 打印样式适配 */
@media print {
  body {
    margin: 0;
    padding: 0;
    background: #fff;
    font-family: 'SimSun', '宋体', sans-serif;
  }

  .apply-form-container {
    padding: 0;
    background: #fff;
  }

  .a4-paper {
    border: none;
    box-shadow: none;
    padding: 0;
    min-height: 297mm;
    margin-bottom: 0;
  }

  /* 打印时隐藏非打印元素 */
  .no-print {
    display: none !important;
  }

  /* 打印时隐藏输入框/按钮等交互元素 */
  :deep(.el-input),
  :deep(.el-textarea),
  :deep(.el-date-picker),
  :deep(.el-radio-group),
  :deep(.el-button) {
    display: none !important;
  }

  /* 打印时边框颜色加深 */
  .vertical-label-box,
  .module-content,
  .approve-box {
    border-color: #000;
  }
}

/* 响应式适配 */
@media screen and (max-width: 1200px) {
  .a4-paper {
    width: 100%;
    min-height: auto;
    border: none;
    box-shadow: none;
    padding: 20px;
  }

  .vertical-label-box {
    width: 60px;
    height: auto;
  }

  .form-module {
    margin-bottom: 20px;
  }

  .module-content {
    height: auto;
    min-height: 120px;
  }

  .vertical-label {
    writing-mode: horizontal-tb;
    text-orientation: mixed;
  }
}
</style>