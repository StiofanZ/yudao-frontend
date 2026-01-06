import request from '@/config/axios'
import type { Dayjs } from 'dayjs'

/** 税务机关信息 */
export interface Swjg {
  swjgDm: string // 税务机关代码
  swjgmc?: string // 税务机关名称
  swjgjc?: string // 税务机关简称
  dz: string // 地址
  yzbm: string // 邮政编码
  lxr: string // 联系人
  lxdh: string // 联系电话
  sxfzh: string // 手续费账号
  sxfhm: string // 户名
  sxfhh: string // 行号
  sxfyh: string // 银行
  sjswjgDm?: string // 上级税务机关代码
  jcjbj?: string // 稽查局标记
  ghjgDm?: string // 工会机构代码
  sxh: number // 顺序号
  jym?: string // 校验码
  children?: Swjg[]
}

// 税务机关 API
export const SwjgApi = {
  // 查询税务机关列表
  getSwjgList: async (params) => {
    return await request.get({ url: `/dm/swjg/list`, params })
  },

  // 查询税务机关详情
  getSwjg: async (swjgDm: String) => {
    return await request.get({ url: `/dm/swjg/get?swjgDm=${swjgDm}` })
  },

  // 新增税务机关
  createSwjg: async (data: Swjg) => {
    return await request.post({ url: `/dm/swjg/create`, data })
  },

  // 修改税务机关
  updateSwjg: async (data: Swjg) => {
    return await request.put({ url: `/dm/swjg/update`, data })
  },

  // 删除税务机关
  deleteSwjg: async (swjgDm: String) => {
    return await request.delete({ url: `/dm/swjg/delete?id=` + swjgDm })
  },

  // 导出税务机关 Excel
  exportSwjg: async (params) => {
    return await request.download({ url: `/dm/swjg/export-excel`, params })
  }
}
