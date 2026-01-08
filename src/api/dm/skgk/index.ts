import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 收款国库信息 */
export interface Skgk {
          gkId: number; // 国库ID
          skgkDm?: string; // 税款国库代码
          skgkmc?: string; // 税款国库名称
          skgkjc?: string; // 税款国库简称
          xzqhDm: string; // 行政区划代码
  }

// 收款国库 API
export const SkgkApi = {
  // 查询收款国库分页
  getSkgkPage: async (params: any) => {
    return await request.get({ url: `/dm/skgk/page`, params })
  },

  // 查询收款国库详情
  getSkgk: async (id: number) => {
    return await request.get({ url: `/dm/skgk/get?id=` + id })
  },

  // 新增收款国库
  createSkgk: async (data: Skgk) => {
    return await request.post({ url: `/dm/skgk/create`, data })
  },

  // 修改收款国库
  updateSkgk: async (data: Skgk) => {
    return await request.put({ url: `/dm/skgk/update`, data })
  },

  // 删除收款国库
  deleteSkgk: async (id: number) => {
    return await request.delete({ url: `/dm/skgk/delete?id=` + id })
  },

  /** 批量删除收款国库 */
  deleteSkgkList: async (ids: number[]) => {
    return await request.delete({ url: `/dm/skgk/delete-list?ids=${ids.join(',')}` })
  },

  // 导出收款国库 Excel
  exportSkgk: async (params) => {
    return await request.download({ url: `/dm/skgk/export-excel`, params })
  }
}