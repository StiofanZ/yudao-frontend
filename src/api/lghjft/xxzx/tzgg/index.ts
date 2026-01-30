import request from '@/config/axios'

export interface TzggVO {
  id: number | undefined
  title: string
  type: number
  content: string
  status: number
  remark: string
  creator: string
  createTime: Date
  readCount?: number
  rank?: number
}

// 查询公告列表
export const getTzggPage = (params: PageParam) => {
  return request.get({ url: '/lghjft/xxzx/tzgg/page', params })
}

// 查询公告详情
export const getTzgg = (id: number) => {
  return request.get({ url: '/lghjft/xxzx/tzgg/get?id=' + id })
}

// 新增公告
export const createTzgg = (data: TzggVO) => {
  return request.post({ url: '/lghjft/xxzx/tzgg/create', data })
}

// 修改公告
export const updateTzgg = (data: TzggVO) => {
  return request.put({ url: '/lghjft/xxzx/tzgg/update', data })
}

// 删除公告
export const deleteTzgg = (id: number) => {
  return request.delete({ url: '/lghjft/xxzx/tzgg/delete?id=' + id })
}

// 批量删除公告
export const deleteTzggList = (ids: number[]) => {
  return request.delete({ url: '/lghjft/xxzx/tzgg/delete-list', params: { ids: ids.join(',') } })
}

// 推送公告
export const pushTzgg = (id: number) => {
  return request.post({ url: '/lghjft/xxzx/tzgg/push?id=' + id })
}
