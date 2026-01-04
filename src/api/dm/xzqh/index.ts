import request from '@/config/axios'

/** 行政区划信息 */
export interface Xzqh {
  xzqhDm: number // 行政区划代码
  xzqhmc?: string // 行政区划名称
  sjxzqhDm?: string // 上级行政区划代码
  xzqhjb?: string // 行政区划级别
  children?: Xzqh[]
}

// 行政区划 API
export const XzqhApi = {
  // 查询行政区划列表
  getXzqhList: async (params) => {
    return await request.get({ url: `/dm/xzqh/list`, params })
  },

  // 查询行政区划详情
  getXzqh: async (id: number) => {
    return await request.get({ url: `/dm/xzqh/get?id=` + id })
  },

  // 新增行政区划
  createXzqh: async (data: Xzqh) => {
    return await request.post({ url: `/dm/xzqh/create`, data })
  },

  // 修改行政区划
  updateXzqh: async (data: Xzqh) => {
    return await request.put({ url: `/dm/xzqh/update`, data })
  },

  // 删除行政区划
  deleteXzqh: async (id: number) => {
    return await request.delete({ url: `/dm/xzqh/delete?id=` + id })
  },

  // 导出行政区划 Excel
  exportXzqh: async (params) => {
    return await request.download({ url: `/dm/xzqh/export-excel`, params })
  }
}
