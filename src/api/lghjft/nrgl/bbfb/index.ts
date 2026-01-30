import request from '@/config/axios'

export interface BbfbVO {
  id: number
  version: string
  title: string
  content: string
  status: number
  fbsj?: string
  deptId?: number
  createTime?: string
  readCount?: number
  rank?: number
}

export interface BbfbPageReqVO extends PageParam {
  title?: string
  version?: string
  status?: number
}

// 查询列表
export const getBbfbList = (params: BbfbPageReqVO) => {
  return request.get({ url: '/lghjft/nrgl/bbfb/list-page', params })
}

// 查询详情
export const getBbfb = (id: number) => {
  return request.get({ url: '/lghjft/nrgl/bbfb/get?id=' + id })
}

// 新增
export const createBbfb = (data: BbfbVO) => {
  return request.post({ url: '/lghjft/nrgl/bbfb/create', data })
}

// 修改
export const updateBbfb = (data: BbfbVO) => {
  return request.put({ url: '/lghjft/nrgl/bbfb/update', data })
}

// 删除
export const deleteBbfb = (id: number) => {
  return request.delete({ url: '/lghjft/nrgl/bbfb/delete?id=' + id })
}

// 发布
export const publishBbfb = (id: number) => {
  return request.put({ url: '/lghjft/nrgl/bbfb/publish?id=' + id })
}
