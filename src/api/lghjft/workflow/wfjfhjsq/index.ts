import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 工会经费缓缴申请信息 */
export interface WfJfhjSq {
  id: number // 主键ID
  shxydm?: string // 社会信用代码
  nsrmc?: string // 缴费单位名称
  contact: string
  contactPhone: string // 联系人及电话
  applicableRate: number // 适用费率（%）
  employeeCount: number // 职工人数（人）
  monthlySalaryTotal: number // 月工资总额（元）
  monthlyPayAmount: number // 月拨缴金额（元）
  deferStartDate: string // 申请缓缴期限-自（年/月）
  deferEndDate: string // 申请缓缴期限-至（年/月）
  deferTotalMonth: number // 申请缓缴期限-共（月）
  totalDeferAmount: number // 累计缓缴金额（元）
  situationDesc: string // 申请缓缴情况说明

  unitLeader: string // 缴费单位-单位负责人
  handler: string // 缴费单位-经办
  applyDate: string // 缴费单位-日期

  grassrootsOpinion: string // 基层工会意见（章）
  grassrootsLeader: string // 基层工会-工会负责人
  grassrootsHandler: string // 基层工会-经办
  grassrootsApproveTime: string // 基层工会-盖章日期（年/月/日）

  managerOpinion: string // 主管工会审核意见
  managerLeaderName: string // 主管工会-工会负责人
  managerHandlerName: string // 主管工会-经办
  managerApproveTime: string // 主管工会-日期
  managerFinanceLeader: string // 主管工会-财务负责人
  processInstanceId: string // 流程实例ID（BPMN）
}
export interface WfJfhjSqSubmit {
  shxydm?: string // 社会信用代码
  nsrmc?: string // 缴费单位名称
  contact: string
  contactPhone: string // 联系人及电话
  applicableRate: number // 适用费率（%）
  employeeCount: number // 职工人数（人）
  monthlySalaryTotal: number // 月工资总额（元）
  monthlyPayAmount: number // 月拨缴金额（元）
  deferStartDate: string // 申请缓缴期限-自（年/月）
  deferEndDate: string // 申请缓缴期限-至（年/月）
  deferTotalMonth: number // 申请缓缴期限-共（月）
  totalDeferAmount: number // 累计缓缴金额（元）
  situationDesc: string // 申请缓缴情况说明
  handler: string
}

// 工会经费缓缴申请 API
export const WfJfhjSqApi = {
  // 查询工会经费缓缴申请详情
  getWfJfhjSq: async (id: number) => {
    return await request.get({ url: `/lghjft/workflow/wfjfhjsq/get?id=` + id })
  },

  // 新增工会经费缓缴申请
  createWfJfhjSq: async (data: WfJfhjSqSubmit) => {
    return await request.post({ url: `/lghjft/workflow/wfjfhjsq/create`, data })
  }
}
