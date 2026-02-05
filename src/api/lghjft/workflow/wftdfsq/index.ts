import request from '@/config/axios'

// ----------------- 请求 DTO -----------------
// 申请提交参数
export interface ApplyRefundReqVO {
  situationDesc: string
  shxydm: string
  nsrmc: string
  unitLeader?: string
  handler?: string
  contactPhone?: string
  accountName: string
  bankName: string
  accountNo: string
  bankCode?: string
  applyDate: string // 与前端表单一致的申请日期字段
  attachments: { type: string; fileId: number }[]
}

// 审批操作参数
export interface ApproveReqVO {
  applyId: number
  taskKey: string // 'managerAudit' | 'provinceAudit' 主管/省总工会审批标识
  result: 'AGREE' | 'REJECT' // 审批结果
  opinion: string // 审批意见
  refundMethod?: number // 仅省总工会审批需要 1-差额 2-全额 3-抵扣欠费 4-抵扣下期
  approveTime: string // 审批日期 YYYY-MM-DD
  leaderName: string // 审批负责人
  handlerName: string // 审批经办人
}

// ----------------- 响应 VO -----------------
// 申请/审批详情返回数据
export interface ApplyDetailRespVO {
  id: number
  situationDesc: string
  shxydm: string
  nsrmc: string
  unitLeader?: string
  handler?: string
  contactPhone?: string
  accountName: string
  bankName: string
  accountNo: string
  bankCode?: string
  status: number // 0-草稿 1-审批中 2-通过 3-拒绝
  applyTime: string // 接口返回的创建时间
  applyDate?: string // 兼容字段，防止接口直接返回applyDate

  // 主管工会审批信息
  managerOpinion?: string
  managerLeaderName?: string
  managerHandlerName?: string
  managerApproveTime?: string

  // 省总工会审批信息
  provinceOpinion?: string
  provinceLeaderName?: string
  provinceHandlerName?: string
  provinceApproveTime?: string
  refundMethod?: number

  // 附件（带文件名，用于回显）
  attachments: {
    type: string
    fileId: number
    name: string
  }[]
}

// ----------------- API 方法 -----------------
// 创建工会经费退还申请
export const createApply = (data: ApplyRefundReqVO) =>
  request.post({ url: '/lghjft/workflow/wftdfsq/create', data })

// 获取申请/审批详情（修复：删除多余+号 + 模板字符串优化URL）
export const getApplyDetail = (id: number) =>
  request.get<ApplyDetailRespVO>({ url: `/lghjft/workflow/wftdfsq/get?id=${id}` })

// 审批操作（同意/拒绝）
export const approveApply = (data: ApproveReqVO) =>
  request.post({ url: '/lghjft/workflow/wftdfsq/approve', data })
