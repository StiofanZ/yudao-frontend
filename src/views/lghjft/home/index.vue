<template>
  <div>
    <el-card shadow="never">
      <el-skeleton :loading="loading" animated>
        <el-row :gutter="16" justify="space-between">
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="flex items-center">
              <el-avatar :src="avatar" :size="70" class="mr-16px">
                <img src="@/assets/imgs/avatar.gif" alt="" />
              </el-avatar>
              <div>
                <div class="text-20px">
                  {{ t('workplace.welcome') }} {{ username }} {{ t('workplace.happyDay') }}
                </div>
              </div>
            </div>
          </el-col>
          <el-col :xl="12" :lg="12" :md="12" :sm="24" :xs="24">
            <div class="h-70px flex items-center justify-end lt-sm:mt-10px">
              <el-button link type="danger" @click="handleLogout">退出登录</el-button>
            </div>
          </el-col>
        </el-row>
      </el-skeleton>
    </el-card>

    <el-row :gutter="20" class="mt-20px">
      <!-- 通知公告 -->
      <el-col :span="12" :xs="24" class="mb-20px">
        <el-card class="h-full" shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-bold">通知公告</span>
              <el-link :underline="false" type="primary" @click="handleMore('/xxzx/tzgg')">
                更多
              </el-link>
            </div>
          </template>
          <el-skeleton :loading="loading" :rows="5" animated>
            <div v-if="tzggList.length > 0">
              <div
                v-for="item in tzggList"
                :key="item.id"
                class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
              >
                <div :title="item.title" class="truncate flex-1 text-14px text-gray-700">
                  {{ item.title }}
                </div>
                <div class="text-12px text-gray-400 ml-4 w-80px text-right">
                  {{ formatTime(item.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
            </div>
            <el-empty v-else :image-size="60" description="暂无通知公告" />
          </el-skeleton>
        </el-card>
      </el-col>

      <!-- 政策法规 -->
      <el-col :span="12" :xs="24" class="mb-20px">
        <el-card class="h-full" shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-bold">政策法规</span>
              <el-link :underline="false" type="primary" @click="handleMore('/nrgl/zcjd')">
                更多
              </el-link>
            </div>
          </template>
          <el-skeleton :loading="loading" :rows="5" animated>
            <div v-if="zcjdList.length > 0">
              <div
                v-for="item in zcjdList"
                :key="item.id"
                class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
              >
                <div :title="item.title" class="truncate flex-1 text-14px text-gray-700">
                  {{ item.title }}
                </div>
                <div class="text-12px text-gray-400 ml-4 w-80px text-right">
                  {{ formatTime(item.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
            </div>
            <el-empty v-else :image-size="60" description="暂无政策法规" />
          </el-skeleton>
        </el-card>
      </el-col>

      <!-- 办事指南 -->
      <el-col :span="12" :xs="24" class="mb-20px">
        <el-card class="h-full" shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-bold">办事指南</span>
              <el-link :underline="false" type="primary" @click="handleMore('/nrgl/bszn')">
                更多
              </el-link>
            </div>
          </template>
          <el-skeleton :loading="loading" :rows="5" animated>
            <div v-if="bsznList.length > 0">
              <div
                v-for="item in bsznList"
                :key="item.id"
                class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
              >
                <div :title="item.sxmc" class="truncate flex-1 text-14px text-gray-700">
                  {{ item.sxmc }}
                </div>
                <div class="text-12px text-gray-400 ml-4 w-80px text-right">
                  {{ formatTime(item.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
            </div>
            <el-empty v-else :image-size="60" description="暂无办事指南" />
          </el-skeleton>
        </el-card>
      </el-col>

      <!-- 版本发布 -->
      <el-col :span="12" :xs="24" class="mb-20px">
        <el-card class="h-full" shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-bold">版本发布</span>
              <el-link :underline="false" type="primary" @click="handleMore('/nrgl/bbfb')">
                更多
              </el-link>
            </div>
          </template>
          <el-skeleton :loading="loading" :rows="5" animated>
            <div v-if="bbfbList.length > 0">
              <div
                v-for="item in bbfbList"
                :key="item.id"
                class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
              >
                <div :title="item.title" class="truncate flex-1 text-14px text-gray-700">
                  <el-tag class="mr-2" size="small" type="primary">{{ item.version }}</el-tag>
                  {{ item.title }}
                </div>
                <div class="text-12px text-gray-400 ml-4 w-80px text-right">
                  {{ formatTime(item.fbsj || item.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
            </div>
            <el-empty v-else :image-size="60" description="暂无版本发布" />
          </el-skeleton>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>
import { formatTime } from '@/utils'
import { ElMessageBox } from 'element-plus'
import { useUserStore } from '@/store/modules/user'
import { useTagsViewStore } from '@/store/modules/tagsView'
import { useRouter } from 'vue-router'
import { getTzggPage, TzggVO } from '@/api/lghjft/xxzx/tzgg'
import { BsznVO, getBsznfbList } from '@/api/lghjft/nrgl/bszn'
import { getZcjdfbList, ZcjdVO } from '@/api/lghjft/nrgl/zcjd'
import { BbfbVO, getPublicBbfbList } from '@/api/lghjft/nrgl/bbfb'

defineOptions({ name: 'LghjftHome' })

const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const tagsViewStore = useTagsViewStore()
const loading = ref(true)
const avatar = userStore.getUser.avatar
const username = userStore.getUser.nickname

// Data lists
const tzggList = ref<TzggVO[]>([])
const zcjdList = ref<ZcjdVO[]>([])
const bsznList = ref<BsznVO[]>([])
const bbfbList = ref<BbfbVO[]>([])

const getTzgg = async () => {
  try {
    const res = await getTzggPage({ pageNo: 1, pageSize: 6 })
    tzggList.value = res.list
  } catch (e) {
    console.error('Failed to fetch tzgg', e)
  }
}

const getZcjd = async () => {
  try {
    const res = await getZcjdfbList({})
    // Take top 6
    zcjdList.value = res.slice(0, 6)
  } catch (e) {
    console.error('Failed to fetch zcjd', e)
  }
}

const getBszn = async () => {
  try {
    const res = await getBsznfbList({})
    // Take top 6
    bsznList.value = res.slice(0, 6)
  } catch (e) {
    console.error('Failed to fetch bszn', e)
  }
}

const getBbfb = async () => {
  try {
    const res = await getPublicBbfbList()
    // Take top 6
    bbfbList.value = res.slice(0, 6)
  } catch (e) {
    console.error('Failed to fetch bbfb', e)
  }
}

const getAllApi = async () => {
  loading.value = true
  await Promise.all([getTzgg(), getZcjd(), getBszn(), getBbfb()])
  loading.value = false
}

const handleMore = (path: string) => {
  router.push(path)
}

const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(t('common.loginOutMessage'), t('common.reminder'), {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      type: 'warning'
    })
    await userStore.loginOut()
    tagsViewStore.delAllViews()
    router.replace('/login?redirect=/index')
  } catch {}
}

getAllApi()
</script>

<style scoped>
.text-14px {
  font-size: 14px;
}
.text-12px {
  font-size: 12px;
}
</style>
