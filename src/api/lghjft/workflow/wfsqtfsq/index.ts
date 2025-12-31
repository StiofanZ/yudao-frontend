import request from '@/config/axios'

/** 可退费信息 */
export interface WfSqTfsqKtfxx {
  spuuid: string; // 税票UUID
  shxydm: string; // 社会信用代码
  nsrmc: string; // 纳税人名称
  skssqq: string; // 税款所属期起
  skssqz: string; // 税款所属期止
  ktfje: number; // 可退费金额
}

// 申请-退费申请 API
export const WfSqTfsqApi = {
  // 获得可退费信息列表
  getKtfxxList: async (djxh: string, skssqq?: string, skssqz?: string) => {
    return await request.get({
      url: `/lghjft/workflow/wfsqtfsq/ktfxx`,
      params: { djxh, skssqq, skssqz }
    })
  },

  // 申请退费
  save: async (data: any[]) => {
    return await request.post({ url: `/lghjft/workflow/wfsqtfsq/save`, data })
  },

  // 获得申请退费信息
  getWfSqTfsq: async (id: number) => {
    return await request.get({ url: `/lghjft/workflow/wfsqtfsq/get?id=` + id })
  }
}
