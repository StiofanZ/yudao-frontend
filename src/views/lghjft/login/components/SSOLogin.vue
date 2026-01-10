<template>
  <div v-show="ssoVisible" class="form-cont">
    <LoginFormTitle class="w-full" />
    <el-tabs class="form" style="float: none" value="uname">
      <el-tab-pane :label="client.name" name="uname" />
    </el-tabs>
    <div>
      <el-form :model="formData" class="login-form">
        此第三方应用请求获得以下权限：
        <el-form-item prop="scopes">
          <el-checkbox-group v-model="formData.scopes">
            <el-checkbox
              v-for="scope in queryParams.scopes"
              :key="scope"
              :value="scope"
              class="block mb-[-10px]"
            >
              {{ formatScope(scope) }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item class="w-full">
          <el-button
            :loading="formLoading"
            class="w-3/5"
            type="primary"
            @click.prevent="handleAuthorize(true)"
          >
            <span v-if="!formLoading">同意授权</span>
            <span v-else>授 权 中...</span>
          </el-button>
          <el-button class="w-3/10" @click.prevent="handleAuthorize(false)">拒绝</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import LoginFormTitle from './LoginFormTitle.vue'
import * as OAuth2Api from '@/api/login/oauth2'
import { LoginStateEnum, useLoginState } from './useLogin'
import type { RouteLocationNormalizedLoaded } from 'vue-router'

defineOptions({ name: 'LghjftSSOLogin' })

const route = useRoute()
const { currentRoute } = useRouter()
const { getLoginState, setLoginState } = useLoginState()

const client = ref({
  name: '',
  logo: ''
})
interface queryType {
  responseType: string
  clientId: string
  redirectUri: string
  state: string
  scopes: string[]
}
const queryParams = reactive<queryType>({
  responseType: '',
  clientId: '',
  redirectUri: '',
  state: '',
  scopes: []
})
const ssoVisible = computed(() => unref(getLoginState) === LoginStateEnum.SSO)
interface formType {
  scopes: string[]
}
const formData = reactive<formType>({
  scopes: []
})
const formLoading = ref(false)

const init = async () => {
  if (typeof route.query.client_id === 'undefined') return
  queryParams.responseType = route.query.response_type as string
  queryParams.clientId = route.query.client_id as string
  queryParams.redirectUri = route.query.redirect_uri as string
  queryParams.state = route.query.state as string
  if (route.query.scope) {
    queryParams.scopes = (route.query.scope as string).split(' ')
  }

  if (queryParams.scopes.length > 0) {
    const data = await doAuthorize(true, queryParams.scopes, [])
    if (data) {
      location.href = data
      return
    }
  }

  const data = await OAuth2Api.getAuthorize(queryParams.clientId)
  client.value = data.client
  let scopes
  if (queryParams.scopes.length > 0) {
    scopes = []
    for (const scope of data.scopes) {
      if (queryParams.scopes.indexOf(scope.key) >= 0) {
        scopes.push(scope)
      }
    }
  } else {
    scopes = data.scopes
    for (const scope of scopes) {
      queryParams.scopes.push(scope.key)
    }
  }
  for (const scope of scopes) {
    if (scope.value) {
      formData.scopes.push(scope.key)
    }
  }
}

const handleAuthorize = async (approved) => {
  let checkedScopes
  let uncheckedScopes
  if (approved) {
    checkedScopes = formData.scopes
    uncheckedScopes = queryParams.scopes.filter((item) => checkedScopes.indexOf(item) === -1)
  } else {
    checkedScopes = []
    uncheckedScopes = queryParams.scopes
  }
  formLoading.value = true
  try {
    const data = await doAuthorize(false, checkedScopes, uncheckedScopes)
    if (!data) {
      return
    }
    location.href = data
  } finally {
    formLoading.value = false
  }
}

const doAuthorize = (autoApprove, checkedScopes, uncheckedScopes) => {
  return OAuth2Api.authorize(
    queryParams.responseType,
    queryParams.clientId,
    queryParams.redirectUri,
    queryParams.state,
    autoApprove,
    checkedScopes,
    uncheckedScopes
  )
}

const formatScope = (scope) => {
  switch (scope) {
    case 'user.read':
      return '访问你的个人信息'
    case 'user.write':
      return '修改你的个人信息'
    default:
      return scope
  }
}

watch(
  () => currentRoute.value,
  (route: RouteLocationNormalizedLoaded) => {
    if (route.name === 'SSOLogin') {
      setLoginState(LoginStateEnum.SSO)
      init()
    }
  },
  { immediate: true }
)
</script>

