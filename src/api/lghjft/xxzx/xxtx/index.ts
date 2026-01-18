import request from '@/config/axios'

export interface XxtxVO {
  id: number
  title: string
  content: string
  messageType: number
  senderId?: number
  senderName?: string
  sendTime?: Date
  status: number
  createTime?: Date
}

// 查询消息分页列表
export const getXxtxPage = async (params: any) => {
  return await request.get({ url: '/lghjft/xxzx/xxtx/page', params })
}

// 查询消息详情
export const getXxtx = async (id: number) => {
  return await request.get({ url: '/lghjft/xxzx/xxtx/get?id=' + id })
}

// 创建消息
export const createXxtx = async (data: XxtxVO) => {
  return await request.post({ url: '/lghjft/xxzx/xxtx/create', data })
}

// 修改消息
export const updateXxtx = async (data: XxtxVO) => {
  return await request.put({ url: '/lghjft/xxzx/xxtx/update', data })
}

// 删除消息
export const deleteXxtx = async (id: number) => {
  return await request.delete({ url: '/lghjft/xxzx/xxtx/delete?id=' + id })
}

// 批量删除消息
export const deleteXxtxList = async (ids: number[]) => {
  return await request.delete({ url: '/lghjft/xxzx/xxtx/delete-list?ids=' + ids.join(',') })
}

// 发送消息
export const sendXxtx = async (data: any) => {
  return await request.post({ url: '/lghjft/xxzx/xxtx/send', data })
}

// 撤回消息
export const recallXxtx = async (id: number) => {
  return await request.put({ url: '/lghjft/xxzx/xxtx/recall?id=' + id })
}

// 标记消息为已读
export const markXxtxRead = async (messageId: number, userId: number) => {
  return await request.put({ url: `/lghjft/xxzx/xxtx/mark-read?messageId=${messageId}&userId=${userId}` })
}
