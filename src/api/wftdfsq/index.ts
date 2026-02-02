import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 退抵费申请信息 */
export interface WfTdfsq {
          id: number; // id
          situationDesc?: string; // 情况说明
          shxydm?: string; // 社会信用代码
          nsrmc?: string; // 纳税人名称
          unitLeader?: string; // 单位负责人
          handler?: string; // 经办人
          contactPhone?: string; // 联系电话
          accountName?: string; // 户名
          bankName?: string; // 开户行名称
          accountNo?: string; // 账号
          bankCode?: string; // 开户行行号
          attachments: string; // 附件列表(JSON)
          fileUrls: string; // 文件URL(JSON)
          processInstanceId: string; // 流程实例ID
          createBy?: number; // 1
  }

// 退抵费申请 API
export const WfTdfsqApi = {
  // 查询退抵费申请分页
  getWfTdfsqPage: async (params: any) => {
    return await request.get({ url: `/lghjft/wf-tdfsq/page`, params })
  },

  // 查询退抵费申请详情
  getWfTdfsq: async (id: number) => {
    return await request.get({ url: `/lghjft/wf-tdfsq/get?id=` + id })
  },

  // 新增退抵费申请
  createWfTdfsq: async (data: WfTdfsq) => {
    return await request.post({ url: `/lghjft/wf-tdfsq/create`, data })
  },

  // 修改退抵费申请
  updateWfTdfsq: async (data: WfTdfsq) => {
    return await request.put({ url: `/lghjft/wf-tdfsq/update`, data })
  },

  // 删除退抵费申请
  deleteWfTdfsq: async (id: number) => {
    return await request.delete({ url: `/lghjft/wf-tdfsq/delete?id=` + id })
  },

  /** 批量删除退抵费申请 */
  deleteWfTdfsqList: async (ids: number[]) => {
    return await request.delete({ url: `/lghjft/wf-tdfsq/delete-list?ids=${ids.join(',')}` })
  },

  // 导出退抵费申请 Excel
  exportWfTdfsq: async (params) => {
    return await request.download({ url: `/lghjft/wf-tdfsq/export-excel`, params })
  }
}