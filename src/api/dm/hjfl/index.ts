import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 户籍分类信息 */
export interface Hjfl {
          deptId?: string; // 工会机构代码
          bz?: string; // 备注
          hjflDm?: string; // 户籍分类代码
          hjflmc?: string; // 户籍分类名称
          sxh: number; // 顺序号
          hjflid: number; // 户籍分类id
  }

// 户籍分类 API
export const HjflApi = {
  // 查询户籍分类分页
  getHjflPage: async (params: any) => {
    return await request.get({ url: `/dm/hjfl/page`, params })
  },

  // 查询户籍分类详情
  getHjfl: async (id: number) => {
    return await request.get({ url: `/dm/hjfl/get?id=` + id })
  },

  // 新增户籍分类
  createHjfl: async (data: Hjfl) => {
    return await request.post({ url: `/dm/hjfl/create`, data })
  },

  // 修改户籍分类
  updateHjfl: async (data: Hjfl) => {
    return await request.put({ url: `/dm/hjfl/update`, data })
  },

  // 删除户籍分类
  deleteHjfl: async (id: number) => {
    return await request.delete({ url: `/dm/hjfl/delete?id=` + id })
  },

  /** 批量删除户籍分类 */
  deleteHjflList: async (ids: number[]) => {
    return await request.delete({ url: `/dm/hjfl/delete-list?ids=${ids.join(',')}` })
  },

  // 导出户籍分类 Excel
  exportHjfl: async (params) => {
    return await request.download({ url: `/dm/hjfl/export-excel`, params })
  }
}