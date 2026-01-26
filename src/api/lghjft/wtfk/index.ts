import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 工会经费通-问题反馈信息 */
export interface WtfkVO {
  id: number
  feedbackId: string
  userId?: number
  userName?: string
  type?: string
  content?: string
  contactPhone: string
  contactEmail: string
  status?: number
  processorId: number
  processorName?: string
  processTime: string | Dayjs
  processNotes: string
  platformName?: string
  createTime?: string
  operatorName?: string
  fileUrls?: string[] //上传文件URL
}

/** 处理日志记录信息 */

// 工会经费通-问题反馈 API
export const WtfkApi = {
  // 查询工会经费通-问题反馈分页
  getWtfkPage: async (params: any) => {
    return await request.get({ url: `/lghjft/wtfk/page`, params })
  },

  // ''删除''接口
  deleteWtfk: (id: number) => {
    // 使用 request.delete 并将 id 拼接到 url 中
    return request.delete({ url: '/lghjft/wtfk/delete?id=' + id })
  },

  // 问题反馈详情
  getWtfk: async (id: number) => {
    return await request.get({ url: `/lghjft/wtfk/get?id=` + id })
  },

  // 创建问题反馈
  createWtfk: async (data: WtfkVO) => {
    return await request.post({ url: `/lghjft/wtfk/create`, data })
  },

  // 修改问题反馈（基础信息修改）
  updateWtfk: async (data: WtfkVO) => {
    return await request.put({ url: `/lghjft/wtfk/update`, data })
  },

  // 【核心】处理问题反馈（提交多次处理记录）
  handleProcess: async (data: { id: number; status: number; processNotes: string }) => {
    return await request.put({ url: `/lghjft/wtfk/handle-process`, data })
  },

  // 【核心】查询某个反馈的所有处理日志历史
  getWtfkLogList: async (feedbackId: number) => {
    return await request.get({ url: `/lghjft/wtfk/log/list?feedbackId=` + feedbackId })
  },






  // 导出 Excel
  exportWtfk: async (params: any) => {
    return await request.download({ url: `/lghjft/wtfk/export-excel`, params })
  }
}
