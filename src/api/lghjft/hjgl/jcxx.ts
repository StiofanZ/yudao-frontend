import request from '@/config/axios'

export interface JcxxVO {
  djxh: string
  deptId: string
  hyghbz: string
  shxydm: string
  nsrmc: string
  nsrjc: string
  zgswjDm: string
  zgswjmc: string
  zgswskfjDm: string
  zgswskfjmc: string
  ssglyDm: string
  ssglyxm: string
  zzjglxDm: string
  zzjglxmc: string
  hyDm: string
  hymc: string
  djzclxDm: string
  djzclxmc: string
  dwlsgxDm: string
  dwlsgxmc: string
  zgrs: number
  nsrztDm: string
  nsrztmc: string
  fzcrq: Date
  zxrq: Date
  zcdz: string
  yzbm: string
  lxr: string
  lxdh: string
  ghlbDm: string
  xtlbDm: string
  hjfl1Dm: string
  hjfl2Dm: string
  hjfl3Dm: string
  hjfl4Dm: string
  hjfl5Dm: string
  hjfl6Dm: string
  hjfl7Dm: Date
  hjfl8Dm: string
  hjfl9Dm: string
  hjfl10Dm: string
  sdghjgDm: string
  clghbj: string
  clghrq: Date
  jcghdm: string
  jcghmc: string
  jcghzh: string
  jcghhm: string
  jcghhh: string
  jcghyh: string
  bz: string
  jym: string
  nsrsbh: string
  fileUrl: string
  jdxzDm: string
  sjtbSj: Date
  createTime: Date
}

export interface JcxxPageReqVO extends PageParam {
  deptId?: string
  shxydm?: string
  nsrmc?: string
  jdxzDm?: string
  zgswskfjDm?: string
  jcghzh?: string
  jcghhm?: string
  jcghhh?: string
  jcghyh?: string
  ghlbDm?: string
  xtlbDm?: string
  clghbj?: string
  beginClghrq?: Date
  endClghrq?: Date
}

export interface NsrxxRespVO {
  nsrsbh: string
  djxh: string
  nsrmc: string
  shxydm: string
  fddbrxm: string
  nsrztDm: string
  existsInHj: boolean
  deptName: string
}

// 查询户籍管理/基础信息列表
export const getJcxxPage = (params: JcxxPageReqVO) => {
  return request.get({ url: '/lghjft/hjgl/jcxx/page', params })
}

// 获得户籍管理/基础信息
export const getJcxx = (id: string) => {
  return request.get({ url: '/lghjft/hjgl/jcxx/get?id=' + id })
}

// 新增户籍管理/基础信息
export const createJcxx = (data: JcxxVO) => {
  return request.post({ url: '/lghjft/hjgl/jcxx/create', data })
}

// 修改户籍管理/基础信息
export const updateJcxx = (data: JcxxVO) => {
  return request.put({ url: '/lghjft/hjgl/jcxx/update', data })
}

// 删除户籍管理/基础信息
export const deleteJcxx = (id: string) => {
  return request.delete({ url: '/lghjft/hjgl/jcxx/delete?id=' + id })
}

// 查询纳税人信息
export const queryNsrxx = (keyword: string) => {
  return request.get({ url: '/lghjft/hjgl/jcxx/query-nsrxx', params: { keyword } })
}

// 从税务机关获取最新户籍信息
export const getTaxInfo = (djxh: string) => {
  return request.get({ url: '/lghjft/hjgl/jcxx/get-tax-info', params: { djxh } })
}
