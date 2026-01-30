import request from '@/config/axios'

export interface BsznVO {
  id: number
  parentId: number
  sxmc: string

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
  blbm?: string
  zxdh?: string
  fdsx?: string
  cnsx?: string
  sfbz?: string
  ywfl?: number
  blzt?: number
  fbsj?: string
  xjyy?: string
  readCount?: number
  rank?: number
}

export type BsznResVO = BsznVO

export interface BsznReqVO extends PageParam {
  sxmc?: string
  type?: string
  status?: number
  deptId?: number
  ywfl?: number
}

// 查询内容发布列表
export const getBsznfbList = (params: BsznReqVO) => {
  return request.get({ url: '/lghjft/nrgl/bszn/list-page', params })
}

// 查询内容发布详情
export const getBszn = (id: number) => {
  return request.get({ url: '/lghjft/nrgl/bszn/get?id=' + id })
}

// 新增内容发布
export const createBszn = (data: BsznVO) => {
  return request.post({ url: '/lghjft/nrgl/bszn/create', data })
}

// 修改内容发布
export const updateBszn = (data: BsznVO) => {
  return request.put({ url: '/lghjft/nrgl/bszn/update', data })
}

// 删除内容发布
export const deleteBszn = (id: number) => {
  return request.delete({ url: '/lghjft/nrgl/bszn/delete?id=' + id })
}

// 发布内容
export const publishBszn = (id: number) => {
  return request.put({ url: '/lghjft/nrgl/bszn/publish?id=' + id })
}

// 查询公开内容列表
export const getPublicBsznList = (deptId: number) => {
  return request.get({ url: '/lghjft/nrgl/bszn/list-page', params: { deptId } })
}

// 下架内容
export const offShelfBszn = (id: number, reason: string) => {
  return request.put({ url: '/lghjft/nrgl/bszn/off-shelf', params: { id, reason } })
}

// 审核内容
export const auditBszn = (id: number, status: number) => {
  return request.put({ url: '/lghjft/nrgl/bszn/audit', params: { id, status } })
}
