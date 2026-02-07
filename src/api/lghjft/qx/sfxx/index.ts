import request from '@/config/axios'

export interface Sfxx {
  id?: number
  dlzhId?: number
  dlzh?: string
  djxh?: string
  shxydm?: string
  sflx?: string
  ghlx?: string
  qxlx?: string
  sqyy?: string
  jbyy?: string
  deptId?: number
  deptName?: string
  status?: number
  creator?: string
  createTime?: string
  updater?: string
  updateTime?: string
}

export const SfxxApi = {
  getSfxxPage: async (params: any) => {
    return await request.get({ url: `/lghjft/qx/sfxx/page`, params })
  },

  getSfxx: async (id: number) => {
    return await request.get({ url: `/lghjft/qx/sfxx/get?id=` + id })
  },

  createSfxx: async (data: Sfxx) => {
    return await request.post({ url: `/lghjft/qx/sfxx/create`, data })
  },

  updateSfxx: async (data: Sfxx) => {
    return await request.put({ url: `/lghjft/qx/sfxx/update`, data })
  },

  deleteSfxx: async (id: number) => {
    return await request.delete({ url: `/lghjft/qx/sfxx/delete?id=` + id })
  },

  deleteSfxxList: async (ids: number[]) => {
    return await request.delete({ url: `/lghjft/qx/sfxx/delete-list?ids=${ids.join(',')}` })
  },

  auditSfxx: async (id: number, status: number) => {
    return await request.put({ url: `/lghjft/qx/sfxx/audit`, params: { id, status } })
  }
}
