import request from '@/config/axios'

export interface BqglRespVO {
  bqDm: string
  bqMc: string
  deptId: number
  deptMc: string
  level: number
}

export interface BqglCreateReqVO {
  bqMc: string
}

export const BqglApi = {
  // 查询标签信息列表
  getBqxx: async () => {
    return await request.get({ url: '/lghjft/hj/bqgl/getBqxx' })
  },
  
  // 创建标签
  createBqxx: async (data: BqglCreateReqVO) => {
    return await request.post({ url: '/lghjft/hj/bqgl/createBqxx', data })
  },

  // 删除标签
  deleteBqxx: async (id: string) => {
    return await request.delete({ url: '/lghjft/hj/bqgl/deleteBqxx', params: { id } })
  }
}
