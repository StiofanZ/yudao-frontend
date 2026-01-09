import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 年度任务信息 */
export interface Rws {
          rwid: number; // 任务id
          rwlx: string; // 任务类型	
          nd: string; // 年度
          dwdm: string; // 单位代码
          dwmc: string; // 单位名称
          rws: number; // 任务数
          wcs: string; // 完成数
  }

// 年度任务 API
export const RwsApi = {
  // 查询年度任务分页
  getRwsPage: async (params: any) => {
    return await request.get({ url: `/lghjft/rws/page`, params })
  },

  // 查询年度任务详情
  getRws: async (id: number) => {
    return await request.get({ url: `/lghjft/rws/get?id=` + id })
  },

  // 新增年度任务
  createRws: async (data: Rws) => {
    return await request.post({ url: `/lghjft/rws/create`, data })
  },

  // 修改年度任务
  updateRws: async (data: Rws) => {
    return await request.put({ url: `/lghjft/rws/update`, data })
  },

  // 删除年度任务
  deleteRws: async (id: number) => {
    return await request.delete({ url: `/lghjft/rws/delete?id=` + id })
  },

  /** 批量删除年度任务 */
  deleteRwsList: async (ids: number[]) => {
    return await request.delete({ url: `/lghjft/rws/delete-list?ids=${ids.join(',')}` })
  },

  // 导出年度任务 Excel
  exportRws: async (params) => {
    return await request.download({ url: `/lghjft/rws/export-excel`, params })
  }
}