import request from '@/config/axios'

// ----------------- 请求 DTO -----------------
// 分支机构明细参数（明细表）
export interface BranchDetailReqVO {
  fjgxyxdm: string // 分支机构社会信用代码
  fjgdwqc: string // 分支机构（下属企业、子公司）单位全称
  fjgzgsbm?: string // 分支机构主管税务部门
  fjggzs?: number // 分支机构职工人数
  fjggzze?: string | number // 分支机构月工资总额（支持字符串/数字）
}

// 汇总缴纳申请提交参数（主表+明细表）
export interface HzApplyReqVO {
  xyxdm: string // 申请汇总缴费单位社会信用代码
  dwqc: string // 申请汇总缴费单位全称
  zgsbm?: string // 主管税务部门
  dwdz?: string // 缴费单位地址
  ghfrdjzjh?: string // 工会法人登记证件号码
  ghqc?: string // 缴费单位工会全称
  zzgzs?: number // 职工总人数
  ghyhs?: number // 工会会员数
  ghfzr?: string // 工会负责人
  lxdh?: string // 联系电话
  ghzhzh: string // 工会账户账号
  khyhmc: string // 开户银行名称
  ghzhhm: string // 工会账户户名
  khyhwdm?: string // 开户银行网点代码
  hzbsjygy: string // 汇总申报缴纳原因
  fzrxm?: string // 负责人
  jbrxm?: string // 经办人及联系电话（格式：姓名 电话）
  jbrdh?: string //经办人及联系电话电话
  // sqrq: string // 申请日期 YYYY-MM-DD
  fjgzs?: number // 分支机构总数
  // attachments: { type: string; fileId: number }[] // 附件列表
  branchList: BranchDetailReqVO[] // 分支机构明细列表
}

// 审批操作参数（主管工会/省总工会审批）
export interface HzApproveReqVO {
  applyId: number // 申请ID
  taskKey: string // 'unionAudit' | 'provinceUnionAudit' 主管工会/省总工会审批标识

  opinion: string // 审批意见
  approveTime: string // 审批日期 YYYY-MM-DD
  leaderName: string // 审批负责人
  handlerName: string // 审批经办人
  handlerPhone?: string // 审批经办人联系电话（仅主管工会审批需要）
}

// ----------------- 响应 VO -----------------
// 汇总申请/审批详情返回数据
export interface HzApplyDetailRespVO {
  id: number // 申请主键ID
  xyxdm: string // 申请汇总缴费单位社会信用代码
  dwqc: string // 申请汇总缴费单位全称
  zgsbm?: string // 主管税务部门
  dwdz?: string // 缴费单位地址
  ghfrdjzjh?: string // 工会法人登记证件号码
  ghqc?: string // 缴费单位工会全称
  zzgzs?: number // 职工总人数
  ghyhs?: number // 工会会员数
  ghfzr?: string // 工会负责人
  lxdh?: string // 联系电话
  ghzhzh: string // 工会账户账号
  khyhmc: string // 开户银行名称
  ghzhhm: string // 工会账户户名
  khyhwdm?: string // 开户银行网点代码
  hzbsjygy: string // 汇总申报缴纳原因
  gzzt: string // 盖章状态：已盖章/未盖章
  fzrxm?: string // 负责人
  jbrxm?: string // 经办人姓名
  jbrdh?: string // 经办人联系电话
  sqrq: string // 申请日期
  fjgzs?: number // 分支机构总数
  // 主管工会审批信息
  zgghsjy?: string // 主管工会审核意见
  zgghgzz?: string // 主管工会审核盖章状态
  zgghsfzr?: string // 主管工会审核负责人
  zgghsjbr?: string // 主管工会审核经办人
  zgghsjbrdh?: string // 主管工会审核经办人电话
  zgghsrq?: string // 主管工会审核日期

  // 省总工会审批信息
  sghzsjy?: string // 省总工会审核意见
  sghgzz?: string // 省总工会审核盖章状态
  sghsfzr?: string // 省总工会审核负责人
  sghsrq?: string // 省总工会审核日期

  // 附件（带文件名，用于回显）
  attachments: {
    type: string
    fileId: number
    name: string
  }[]

  // 分支机构明细列表（用于详情页回显）
  branchList: {
    xh: number // 序号
    fjgxyxdm: string // 分支机构社会信用代码
    fjgdwqc: string // 分支机构单位全称
    fjgzgsbm?: string // 分支机构主管税务部门
    fjggzs?: number // 分支机构职工人数
    fjggzze?: string // 分支机构月工资总额
  }[]
}

// ----------------- API 方法 -----------------
// 创建工会经费汇总缴纳申请
export const createApply = (data: HzApplyReqVO) =>
  request.post({ url: '/lghjft/wf-hz/create', data })

// 获取汇总申请/审批详情
export const getHZFDetail = (id: number) =>
  request.get<HzApplyDetailRespVO>({ url: `/lghjft/wf-hz/get?id=${id}` })

// // 审批操作（主管工会/省总工会）
// export const approveApply = (data: HzApproveReqVO) =>
//   request.post({ url: '/lghjft/workflow/wfsqhzjf/approve', data })
