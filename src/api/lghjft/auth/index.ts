import request from '@/config/axios'

export interface LoginAuthCodeVO {
  authCode: string
}

// LGH 授权登录
export const loginAuthCode = (data: LoginAuthCodeVO) => {
  return request.post({ url: '/lghjft/login/login-by-lgh', data })
}
