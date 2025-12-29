import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 申请-退费申请明细信息 */
export interface WfSqTfsqmx {
          id: number; // 退费申请明细ID
          xh: number; // 退费申请明细序号
          spuuid?: string; // 税票UUID
          rkje?: number; // 入库金额
          tfsqJe?: number; // 退费审批金额
          xybz?: number; // 有效标志
}

/** 申请-退费申请信息 */
export interface WfSqTfsq {
          id: number; // 退费申请ID
          tfsqmxId?: number; // 退费申请明细ID
          sqtflxDm?: number; // 申请退费类型代码
          processInstanceId: string; // 流程实例的编号
          status?: number; // 审批结果
            wfsqtfsqmxs?: WfSqTfsqmx[]
}

// 申请-退费申请 API
export const WfSqTfsqApi = {
  // 查询申请-退费申请分页
  getWfSqTfsqPage: async (params: any) => {
    return await request.get({ url: `/lghjft/wf-sq-tfsq/page`, params })
  },

  // 查询申请-退费申请详情
  getWfSqTfsq: async (id: number) => {
    return await request.get({ url: `/lghjft/wf-sq-tfsq/get?id=` + id })
  },

  // 新增申请-退费申请
  createWfSqTfsq: async (data: WfSqTfsq) => {
    return await request.post({ url: `/lghjft/wf-sq-tfsq/create`, data })
  },

  // 修改申请-退费申请
  updateWfSqTfsq: async (data: WfSqTfsq) => {
    return await request.put({ url: `/lghjft/wf-sq-tfsq/update`, data })
  },

  // 删除申请-退费申请
  deleteWfSqTfsq: async (id: number) => {
    return await request.delete({ url: `/lghjft/wf-sq-tfsq/delete?id=` + id })
  },

  /** 批量删除申请-退费申请 */
  deleteWfSqTfsqList: async (ids: number[]) => {
    return await request.delete({ url: `/lghjft/wf-sq-tfsq/delete-list?ids=${ids.join(',')}` })
  },

  // 导出申请-退费申请 Excel
  exportWfSqTfsq: async (params) => {
    return await request.download({ url: `/lghjft/wf-sq-tfsq/export-excel`, params })
  },

// ==================== 子表（申请-退费申请明细） ====================

  // 获得申请-退费申请明细列表
  getWfSqTfsqmxListById: async (id) => {
    return await request.get({ url: `/lghjft/wf-sq-tfsq/wf-sq-tfsqmx/list-by-id?id=` + id })
  }
}