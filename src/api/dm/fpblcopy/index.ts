import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 分配比例信息 */
export interface FpblCopy {
          blId: number; // 比例ID
          bluuid: string; // 比例ID
          lx?: string; // 类型
          ms?: string; // 描述
          yxqq?: string | Dayjs; // 有效期起
          yxqz?: string | Dayjs; // 有效期止
          xybz?: string; // 有效标志
          jcghbl?: number; // 基层工会比例
          hyghbl?: number; // 行业工会比例
          sdghbl?: number; // 属地工会比例
          xjghbl?: number; // 县级工会比例
          sjghbl?: number; // 市级工会比例
          szghbl?: number; // 省总工会比例
          qgzghbl?: number; // 全总工会比例
          sjcjbl?: number; // 省稽查局比例
          sdsjbl?: number; // 省税局比例
          swjgbl?: number; // 主管税务机关比例
          tj?: string; // TJ
          yxj: number; // YXJ
          mrbz?: string; // MRBZ
          jym?: string; // JYM
  }

// 分配比例 API
export const FpblCopyApi = {
  // 查询分配比例分页
  getFpblCopyPage: async (params: any) => {
    return await request.get({ url: `/dm/fpbl-copy/page`, params })
  },

  // 查询分配比例详情
  getFpblCopy: async (id: number) => {
    return await request.get({ url: `/dm/fpbl-copy/get?id=` + id })
  },

  // 新增分配比例
  createFpblCopy: async (data: FpblCopy) => {
    return await request.post({ url: `/dm/fpbl-copy/create`, data })
  },

  // 修改分配比例
  updateFpblCopy: async (data: FpblCopy) => {
    return await request.put({ url: `/dm/fpbl-copy/update`, data })
  },

  // 删除分配比例
  deleteFpblCopy: async (id: number) => {
    return await request.delete({ url: `/dm/fpbl-copy/delete?id=` + id })
  },

  /** 批量删除分配比例 */
  deleteFpblCopyList: async (ids: number[]) => {
    return await request.delete({ url: `/dm/fpbl-copy/delete-list?ids=${ids.join(',')}` })
  },

  // 导出分配比例 Excel
  exportFpblCopy: async (params) => {
    return await request.download({ url: `/dm/fpbl-copy/export-excel`, params })
  }
}