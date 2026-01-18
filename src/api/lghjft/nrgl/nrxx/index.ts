import request from '@/config/axios'

export interface NrxxVO {
  id: number
  parentId: number
  title: string
  type: string
  content: string
  sort: number
  status: number
  createTime: string
}

export interface NrxxPageReqVO {
  title?: string
  type?: string
  status?: number
}

// 查询内容发布列表
export const getNrxxfbList = (params: NrxxPageReqVO) => {
  return request.get({ url: '/lghjft/nrgl/nrxx/list', params })
}

// 查询内容发布详情
export const getNrxx = (id: number) => {
  return request.get({ url: '/lghjft/nrgl/nrxx/get?id=' + id })
}

// 新增内容发布
export const createNrxx = (data: NrxxVO) => {
  return request.post({ url: '/lghjft/nrgl/nrxx/create', data })
}

// 修改内容发布
export const updateNrxx = (data: NrxxVO) => {
  return request.put({ url: '/lghjft/nrgl/nrxx/update', data })
}

// 删除内容发布
export const deleteNrxx = (id: number) => {
  return request.delete({ url: '/lghjft/nrgl/nrxx/delete?id=' + id })
}
