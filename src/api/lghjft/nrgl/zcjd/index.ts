import request from '@/config/axios'

export interface ZcjdVO {
  id: number
  parentId: number
  title: string

  content: string
  sort: number
  status: number
  createTime: string
  updateTime?: string
  creator?: string
  updater?: string
  deleted?: boolean
  deptId: number
  deptName: string
  kjfw: number
  fjlj?: string
  fbbm?: number
  xjyy?: string
  jdbm?: string
  fbrq?: string
  glzcId?: number
  readCount?: number
  rank?: number
}

export type ZcjdResVO = ZcjdVO

export interface ZcjdReqVO extends PageParam {
  title?: string
  type?: string
  status?: number
  deptId?: number
}

// 查询内容发布列表
export const getZcjdfbList = (params: ZcjdReqVO) => {
  return request.get({ url: '/lghjft/nrgl/zcjd/list-page', params })
}

// 查询内容发布详情
export const getZcjd = (id: number) => {
  return request.get({ url: '/lghjft/nrgl/zcjd/get?id=' + id })
}

// 新增内容发布
export const createZcjd = (data: ZcjdVO) => {
  return request.post({ url: '/lghjft/nrgl/zcjd/create', data })
}

// 修改内容发布
export const updateZcjd = (data: ZcjdVO) => {
  return request.put({ url: '/lghjft/nrgl/zcjd/update', data })
}

// 删除内容发布
export const deleteZcjd = (id: number) => {
  return request.delete({ url: '/lghjft/nrgl/zcjd/delete?id=' + id })
}

// 发布内容
export const publishZcjd = (id: number) => {
  return request.put({ url: '/lghjft/nrgl/zcjd/publish?id=' + id })
}

// 下架内容
export const offShelfZcjd = (id: number, reason: string) => {
  return request.put({ url: '/lghjft/nrgl/zcjd/off-shelf', params: { id, reason } })
}

// 审核内容
export const auditZcjd = (id: number, status: number) => {
  return request.put({ url: '/lghjft/nrgl/zcjd/audit', params: { id, status } })
}
