import request from '@/config/axios'

export interface LoginAuthCodeVO {
  authCode: string
}

export interface LoginVO {
  yhzh?: string
  password: string
  lxdh?: string
  yhyx?: string
  shxydm?: string
  captchaVerification?: string
}

// 账号密码登录
export const login = (data: LoginVO) => {
  return request.post({ url: '/lghjft/login', data })
}

// LGH 授权登录
export const loginAuthCode = (data: LoginAuthCodeVO) => {
  return request.post({ url: '/lghjft/login/login-by-lgh', data })
}
