import request from '@/config/axios'

export interface BsznVO {
  id: number
  parentId: number
  title: string
  
  content: string
  sort: number
  status: number
  createTime: string
  deptId: number
  deptName: string
  kjfw: number
  blck?: string
  zxdh?: string
  fdsx?: string
  cnsx?: string
  sfbz?: string
}

export interface BsznPageReqVO {
  title?: string
  type?: string
  status?: number
}

// 查询内容发布列表
export const getBsznfbList = (params: BsznPageReqVO) => {
  return request.get({ url: '/lghjft/nrgl/bszn/list', params })
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
  return request.get({ url: '/lghjft/nrgl/bszn/public/list?deptId=' + deptId })
}
