import request from '@/config/axios'

/** MinIO 文件信息 */
export interface FileInfoVO {
  fileId: string
  fileOriginName: string
  fileUrl: string
  bizId?: string
}

/** 文件项（用于前端展示） */
export interface FileItem {
  fileId: string
  name: string
  url: string
  bizId?: string
}

// MinIO 文件管理 API
export const MinioApi = {
  /** 删除文件 */
  removeFile: async (fileId: string) => {
    return await request.get({
      url: '/common/minio/removeFile/',
      params: { fileId }
    })
  },

  /** 下载文件 */
  downloadFile: async (fileId: string) => {
    return await request.get({
      url: '/common/minio/downloadFile/',
      params: { fileId }
    })
  },

  /** 上传二进制文件 */
  uploadBinaryFile: async (data: FormData) => {
    return await request.post({
      url: '/common/minio/uploadFile',
      headers: { 'Content-Type': 'multipart/form-data' },
      data
    })
  },

  /** 将 FileInfoVO 转换为 FileItem */
  getFileItem: (fileInfoVO: FileInfoVO): FileItem => {
    return {
      fileId: fileInfoVO.fileId,
      name: fileInfoVO.fileOriginName,
      url: fileInfoVO.fileUrl,
      bizId: fileInfoVO.bizId
    }
  },

  /** 将 FileInfoVO 数组转换为 FileItem 数组 */
  getFileData: (fileInfoVOList: FileInfoVO[]): FileItem[] => {
    return fileInfoVOList?.map(item => ({
      fileId: item.fileId,
      name: item.fileOriginName,
      url: item.fileUrl,
      bizId: item.bizId
    })) || []
  },

  /** 将 FileItem 数组转换为 FileInfoVO 数组 */
  getFileInfoVOList: (fileList: FileItem[]): FileInfoVO[] => {
    return fileList?.map(item => ({
      fileId: item.fileId,
      fileOriginName: item.name,
      fileUrl: item.url,
      bizId: item.bizId
    })) || []
  }
}