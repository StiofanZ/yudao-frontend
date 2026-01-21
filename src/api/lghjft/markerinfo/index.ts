import request from '@/config/axios'
import type { Dayjs } from 'dayjs';

/** 高德地图标注点信息信息 */
export interface MarkerInfo {
          id: number; // 主键ID
          name?: string; // 地点名称
          phone: string; // 联系电话
          address?: string; // 详细地址
          lng?: number; // 经度（保留6位小数，满足高德地图精度）
          lat?: number; // 纬度（保留6位小数，满足高德地图精度）
          remark: string; // 备注信息
          isDeleted?: number; // 是否删除（0-未删，1-已删）
  }

// 高德地图标注点信息 API
export const MarkerInfoApi = {
  // 查询高德地图标注点信息分页
  getMarkerInfoPage: async (params: any) => {
    return await request.get({ url: `/lghjft/marker-info/page`, params })
  },

  // 查询高德地图标注点信息详情
  getMarkerInfo: async (id: number) => {
    return await request.get({ url: `/lghjft/marker-info/get?id=` + id })
  },

  // 新增高德地图标注点信息
  createMarkerInfo: async (data: MarkerInfo) => {
    return await request.post({ url: `/lghjft/marker-info/create`, data })
  },

  // 修改高德地图标注点信息
  updateMarkerInfo: async (data: MarkerInfo) => {
    return await request.put({ url: `/lghjft/marker-info/update`, data })
  },

  // 删除高德地图标注点信息
  deleteMarkerInfo: async (id: number) => {
    return await request.delete({ url: `/lghjft/marker-info/delete?id=` + id })
  },

  /** 批量删除高德地图标注点信息 */
  deleteMarkerInfoList: async (ids: number[]) => {
    return await request.delete({ url: `/lghjft/marker-info/delete-list?ids=${ids.join(',')}` })
  },

  // 导出高德地图标注点信息 Excel
  exportMarkerInfo: async (params) => {
    return await request.download({ url: `/lghjft/marker-info/export-excel`, params })
  }
}