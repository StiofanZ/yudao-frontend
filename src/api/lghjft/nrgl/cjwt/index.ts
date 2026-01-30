import request from '@/config/axios'

export interface CjwtVO {
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
  wtfl?: string
  xjyy?: string
  readCount?: number
  rank?: number
}

export type CjwtResVO = CjwtVO

export interface CjwtReqVO extends PageParam {
  title?: string
  type?: string
  status?: number
  deptId?: number
}

// 查询内容发布列表
export const getCjwtfbList = (params: CjwtReqVO) => {
  return request.get({ url: '/lghjft/nrgl/cjwt/list-page', params })
}

// 查询内容发布详情
export const getCjwt = (id: number) => {
  return request.get({ url: '/lghjft/nrgl/cjwt/get?id=' + id })
}

// 新增内容发布
export const createCjwt = (data: CjwtVO) => {
  return request.post({ url: '/lghjft/nrgl/cjwt/create', data })
}

// 修改内容发布
export const updateCjwt = (data: CjwtVO) => {
  return request.put({ url: '/lghjft/nrgl/cjwt/update', data })
}

// 删除内容发布
export const deleteCjwt = (id: number) => {
  return request.delete({ url: '/lghjft/nrgl/cjwt/delete?id=' + id })
}

// 发布内容
export const publishCjwt = (id: number) => {
  return request.put({ url: '/lghjft/nrgl/cjwt/publish?id=' + id })
}



// 下架内容
export const offShelfCjwt = (id: number, reason: string) => {
  return request.put({ url: '/lghjft/nrgl/cjwt/off-shelf', params: { id, reason } })
}

// 审核内容
export const auditCjwt = (id: number, status: number) => {
  return request.put({ url: '/lghjft/nrgl/cjwt/audit', params: { id, status } })
}
