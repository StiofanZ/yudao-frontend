import request from '@/config/axios'

export interface Dlzh {
  id?: number
  yhzh?: string
  password?: string
  yhxm?: string
  yhbz?: string
  lxdh?: string
  yhyx?: string
  shxydm?: string
  yhxb?: number
  txdz?: string
  status?: number
  loginIp?: string
  loginDate?: string
  creator?: string
  createTime?: string
  updater?: string
  updateTime?: string
}

export const DlzhApi = {
  getDlzhPage: async (params: any) => {
    return await request.get({ url: `/lghjft/qx/dlzh/page`, params })
  },

  getDlzh: async (id: number) => {
    return await request.get({ url: `/lghjft/qx/dlzh/get?id=` + id })
  },

  createDlzh: async (data: Dlzh) => {
    return await request.post({ url: `/lghjft/qx/dlzh/create`, data })
  },

  updateDlzh: async (data: Dlzh) => {
    return await request.put({ url: `/lghjft/qx/dlzh/update`, data })
  },

  resetPassword: async (id: number, password: string) => {
    return await request.put({ url: `/lghjft/qx/dlzh/reset-password`, data: { id, password } })
  },

  deleteDlzh: async (id: number) => {
    return await request.delete({ url: `/lghjft/qx/dlzh/delete?id=` + id })
  },

  deleteDlzhList: async (ids: number[]) => {
    return await request.delete({ url: `/lghjft/qx/dlzh/delete-list?ids=${ids.join(',')}` })
  }
}
