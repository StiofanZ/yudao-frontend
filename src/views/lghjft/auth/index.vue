<template>
  <div class="flex items-center justify-center h-full bg-gray-100">
    <div class="text-center p-8 bg-white rounded-lg shadow-md w-96">
      <div v-if="loading" class="flex flex-col items-center">
        <div class="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p class="text-gray-600 text-lg">正在登录中...</p>
        <p class="text-gray-400 text-sm mt-2">请稍候，正在验证您的身份</p>
      </div>

      <div v-else-if="errorMsg" class="flex flex-col items-center">
        <div class="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mb-4 text-2xl">
          !
        </div>
        <p class="text-red-600 text-lg mb-2">登录失败</p>
        <p class="text-gray-500 text-sm mb-6">{{ errorMsg }}</p>
        <button 
          @click="handleRetry" 
          class="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          重试
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { loginAuthCode } from '@/api/lghjft/auth'
import { setToken } from '@/utils/auth'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const errorMsg = ref('')

const handleAuthCodeLogin = async () => {
  loading.value = true
  errorMsg.value = ''
  
  const authCode = route.query.authCode as string
  if (!authCode) {
    loading.value = false
    errorMsg.value = '缺少授权码 (authCode)'
    return
  }

  try {
    const res = await loginAuthCode({ authCode })
    if (res) {
      setToken(res)
      await router.push({ path: '/' })
    } else {
      throw new Error('未获取到有效的登录凭证')
    }
  } catch (error: any) {
    console.error('Login failed:', error)
    loading.value = false
    errorMsg.value = error.message || '授权登录过程中发生错误，请联系管理员'
  }
}

const handleRetry = () => {
  handleAuthCodeLogin()
}

onMounted(() => {
  handleAuthCodeLogin()
})
</script>
