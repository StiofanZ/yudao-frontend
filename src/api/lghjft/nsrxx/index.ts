import request from '@/config/axios'
import { type Sfxx } from '@/api/lghjft/qx/sfxx'

export interface NsrxxResVO {
  id?: number
  nsrsbh: string
  djxh: string
  nsrmc: string
  shxydm?: string
  frdb?: string
  zcdz?: string
  lxdh?: string
  fddbrxm?: string
  fddbryddh?: string
  cwfzrxm?: string
  cwfzryddh?: string
  sfxx?: Sfxx
  deptId?: number
}


export const NsrxxApi = {
  // 根据纳税人识别号查询纳税人信息
  getNsrxxByNsrsbh: async (nsrsbh: string) => {
    return await request.get({
      url: '/lghjft/nsrxx/query',
      params: { nsrsbh }
    })
  },

  // 根据社会信用代码或纳税人识别号查询纳税人信息列表
  getNsrxxList: async (code: string) => {
    return await request.get({
      url: '/lghjft/nsrxx/list',
      params: { code }
    })
  }
}
