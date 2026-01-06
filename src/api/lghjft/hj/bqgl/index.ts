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

export interface BqglHjxxRespVO {
  djxh: string
  shxydm: string
  nsrmc: string
  bqDm: string
  bqMc: string
  yxqq: string
  yxqz: string
}

export interface BqglHjxxPageReqVO extends PageParam {
  bqDm: string
  shxydm?: string
}

export interface BqglHjxxSaveReqVO {
  bqDm: string
  djxhList: string[]
  deleted?: boolean
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
  },

  // 查询标签关联的户籍信息
  getHjxx: async (params: BqglHjxxPageReqVO) => {
    return await request.get({ url: '/lghjft/hj/bqgl/getHjxx', params })
  },

  // 保存户籍标签信息
  saveHjxx: async (data: BqglHjxxSaveReqVO) => {
    return await request.post({ url: '/lghjft/hj/bqgl/saveHjxx', data })
  }
}
