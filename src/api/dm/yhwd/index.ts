import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 银行网点信息 */
export interface Yhwd {
          yhhbDm?: string; // 银行行别代码
          yhwdDm?: string; // 网点代码
          yhwdmc?: string; // 网点名称
          yhwdjc?: string; // 网点简称
          wdhh?: string; // 网点行号
          qshh?: string; // 清算行号
          xzqhDm?: string; // 行政区划代码
          sxh: number; // 顺序号
          yxqz: string | Dayjs; // 有效期止
          wddz: string; // 网点地址
          wddh: string; // 网点电话
          yhhbId: number; // 银行行别ID
  }

// 银行网点 API
export const YhwdApi = {
  // 查询银行网点分页
  getYhwdPage: async (params: any) => {
    return await request.get({ url: `/dm/yhwd/page`, params })
  },

  // 查询银行网点详情
  getYhwd: async (id: number) => {
    return await request.get({ url: `/dm/yhwd/get?id=` + id })
  },

  // 新增银行网点
  createYhwd: async (data: Yhwd) => {
    return await request.post({ url: `/dm/yhwd/create`, data })
  },

  // 修改银行网点
  updateYhwd: async (data: Yhwd) => {
    return await request.put({ url: `/dm/yhwd/update`, data })
  },

  // 删除银行网点
  deleteYhwd: async (id: number) => {
    return await request.delete({ url: `/dm/yhwd/delete?id=` + id })
  },

  /** 批量删除银行网点 */
  deleteYhwdList: async (ids: number[]) => {
    return await request.delete({ url: `/dm/yhwd/delete-list?ids=${ids.join(',')}` })
  },

  // 导出银行网点 Excel
  exportYhwd: async (params) => {
    return await request.download({ url: `/dm/yhwd/export-excel`, params })
  }
}