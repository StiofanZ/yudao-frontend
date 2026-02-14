import request from '@/config/axios'

export interface BqglRespVO {
  id: string
  bqMc: string
  deptId: number
  createTime: string
}

export interface BqglCreateReqVO {
  bqMc: string
}

export interface BqglUpdateReqVO extends BqglCreateReqVO {
  id: string
}

export interface BqglPageReqVO extends PageParam {
  bqMc?: string
}

export interface BqglHjxxRespVO {
  djxh: string
  shxydm: string
  nsrmc: string
  bqId?: string
  yxqq?: string
  yxqz?: string
}

export interface BqglHjxxPageReqVO extends PageParam {
  bqId: string
  nsrmc?: string
}

export interface BqglHjxxSaveReqVO {
  bqDm: string
  djxhList: string[]
  deleted?: boolean
}

export const BqglApi = {
  // 获得标签分页
  listBqdm: async (params: BqglPageReqVO) => {
    return await request.get({url: '/lghjft/hjgl/bqgl/list-bqdm', params})
  },

  // 创建标签
  createBqdm: async (data: BqglCreateReqVO) => {
    return await request.post({url: '/lghjft/hjgl/bqgl/create-bqdm', data})
  },

  // 更新标签
  updateBqdm: async (data: BqglUpdateReqVO) => {
    return await request.put({url: '/lghjft/hjgl/bqgl/update-bqdm', data})
  },

  // 删除标签
  deleteBqdm: async (id: string) => {
    return await request.delete({url: '/lghjft/hjgl/bqgl/delete-bqdm', params: {id}})
  },

  // 查询标签关联的户籍信息
  listHjxx: async (params: BqglHjxxPageReqVO) => {
    return await request.get({url: '/lghjft/hjgl/bqgl/list-hjxx', params})
  },

  // 保存户籍标签信息
  saveHjxx: async (data: BqglHjxxSaveReqVO) => {
    return await request.post({url: '/lghjft/hjgl/bqgl/save-hjxx', data})
  }
}
