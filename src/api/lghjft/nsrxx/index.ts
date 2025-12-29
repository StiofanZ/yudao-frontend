import request from '@/config/axios'

export interface NsrxxRespVO {
  id?: number
  nsrsbh: string
  djxh: string
  nsrmc: string
  // Add other fields if necessary
}

export const NsrxxApi = {
  // 根据纳税人识别号查询纳税人信息
  getNsrxxByNsrsbh: async (nsrsbh: string) => {
    return await request.get({
      url: '/lghjft/nsrxx/query',
      params: { nsrsbh }
    })
  }
}
