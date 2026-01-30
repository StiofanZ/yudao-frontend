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
      <el-col :span="24" :xs="24" class="mb-20px">
        <div
          class="flex items-center px-16px py-10px border border-gray-100 rounded-8px bg-white hover:shadow-sm transition-shadow"
        >
          <div class="flex items-center text-16px font-bold mr-12px">
            <Icon icon="ep:bell" class="mr-6px" />
            通知公告
          </div>
          <el-divider direction="vertical" />
          <el-skeleton :loading="loading" animated class="flex-1">
            <template #default>
              <el-carousel
                v-if="tzggList.length > 0"
                height="24px"
                direction="vertical"
                :autoplay="true"
                :interval="3000"
                indicator-position="none"
                class="flex-1"
              >
                <el-carousel-item v-for="item in tzggList" :key="item.id">
                  <div
                    class="h-24px leading-24px truncate cursor-pointer text-14px text-gray-700 hover:text-primary"
                    :title="item.title"
                    @click="router.push(`/xxzx/tzgg/detail?id=${item.id}`)"
                  >
                    <el-tag v-if="item.rank && item.rank <= 10" type="danger">🔥</el-tag>
                    <el-tag v-else-if="item.rank && item.rank <= 20" type="warning">⚡</el-tag>
                    <el-tag v-else-if="item.rank && item.rank <= 30" type="info">❄️</el-tag>
                    {{ item.title }}
                  </div>
                </el-carousel-item>
              </el-carousel>
              <div v-else class="h-24px leading-24px text-14px text-gray-400">暂无通知公告</div>
            </template>
          </el-skeleton>
          <el-link
            class="ml-12px"
            :underline="false"
            type="primary"
            @click="handleMore('/xxzx/tzgg')"
          >
            更多
            <Icon icon="ep:arrow-right" class="ml-4px" />
          </el-link>
        </div>
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
                @click="router.push(`/nrgl/zcjd/detail?id=${item.id}`)"
              >
                <div :title="item.title" class="truncate flex-1 text-14px text-gray-700">
                  <el-tag v-if="item.rank && item.rank <= 10" type="danger">🔥</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 20" type="warning">⚡</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 30" type="info">❄️</el-tag>
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
                @click="router.push(`/nrgl/bszn/detail?id=${item.id}`)"
              >
                <div :title="item.sxmc" class="truncate flex-1 text-14px text-gray-700">
                  <el-tag v-if="item.rank && item.rank <= 10" type="danger">🔥</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 20" type="warning">⚡</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 30" type="info">❄️</el-tag>
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
                @click="router.push(`/nrgl/bbfb/detail?id=${item.id}`)"
              >
                <div :title="item.title" class="truncate flex-1 text-14px text-gray-700">
                  <el-tag v-if="item.rank && item.rank <= 10" type="danger">🔥</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 20" type="warning">⚡</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 30" type="info">❄️</el-tag>
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

      <!-- 常见问题 -->
      <el-col :span="12" :xs="24" class="mb-20px">
        <el-card class="h-full" shadow="hover">
          <template #header>
            <div class="flex justify-between items-center">
              <span class="text-16px font-bold">常见问题</span>
              <el-link :underline="false" type="primary" @click="handleMore('/nrgl/cjwt')">
                更多
              </el-link>
            </div>
          </template>
          <el-skeleton :loading="loading" :rows="5" animated>
            <div v-if="cjwtList.length > 0">
              <div
                v-for="item in cjwtList"
                :key="item.id"
                class="flex justify-between items-center py-2 border-b border-gray-100 last:border-0 cursor-pointer hover:bg-gray-50"
                @click="router.push(`/nrgl/cjwt/detail?id=${item.id}`)"
              >
                <div :title="item.title" class="truncate flex-1 text-14px text-gray-700">
                  <el-tag v-if="item.rank && item.rank <= 10" type="danger">🔥</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 20" type="warning">⚡</el-tag>
                  <el-tag v-else-if="item.rank && item.rank <= 30" type="info">❄️</el-tag>
                  {{ item.title }}
                </div>
                <div class="text-12px text-gray-400 ml-4 w-80px text-right">
                  {{ formatTime(item.createTime, 'yyyy-MM-dd') }}
                </div>
              </div>
            </div>
            <el-empty v-else :image-size="60" description="暂无常见问题" />
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
import { BsznResVO, getBsznfbList } from '@/api/lghjft/nrgl/bszn'
import { getZcjdfbList, ZcjdResVO } from '@/api/lghjft/nrgl/zcjd'
import { BbfbResVO, getBbfbList } from '@/api/lghjft/nrgl/bbfb'
import { CjwtResVO, getCjwtfbList } from '@/api/lghjft/nrgl/cjwt'

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
const zcjdList = ref<ZcjdResVO[]>([])
const bsznList = ref<BsznResVO[]>([])
const bbfbList = ref<BbfbResVO[]>([])
const cjwtList = ref<CjwtResVO[]>([])

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
    const res = await getZcjdfbList({ pageNo: 1, pageSize: 6 })
    zcjdList.value = res.list
  } catch (e) {
    console.error('Failed to fetch zcjd', e)
  }
}

const getBszn = async () => {
  try {
    // 首页展示公共内容，传入 deptId (例如 620000 临港环境)
    // 注意：这里需要根据实际业务需求传入 deptId，假设为 620000
    // 如果不传 deptId，getBsznfbList 会调用 /list-page。
    // 如果当前用户登录，则返回用户管理列表；如果未登录，则返回空（因为没有 deptId）
    // 但首页通常是展示给登录用户的，或者展示特定部门的公共信息
    // 原逻辑使用的是 getBsznfbList({})，这在原 /list 接口是查询管理列表
    // 但这里看起来像是展示公共信息？
    // 原代码中使用的是 getBsznfbList({})，这其实是调用 /list 接口。
    // 如果是首页展示，可能是展示当前用户能看到的，或者是展示公共的。
    // 根据之前的逻辑，首页展示的是 "办事指南"，并且有 "更多" 链接。
    // 如果想展示公共排名，应该传入 deptId。
    // 但如果不传，且用户已登录，则返回管理列表。
    // 为了保持一致性，如果这是公共门户首页，应该传 deptId。
    // 如果是管理后台首页，则保持不传（默认使用登录用户上下文）。
    const res = await getBsznfbList({
      pageNo: 1,
      pageSize: 6
    })
    // Take top 6
    bsznList.value = res.list
  } catch (e) {
    console.error('Failed to fetch bszn', e)
  }
}

const getBbfb = async () => {
  try {
    const res = await getBbfbList({ pageNo: 1, pageSize: 6 })
    bbfbList.value = res.list
  } catch (e) {
    console.error('Failed to fetch bbfb', e)
  }
}

const getCjwt = async () => {
  try {
    const res = await getCjwtfbList({ pageNo: 1, pageSize: 6 })
    cjwtList.value = res.list
  } catch (e) {
    console.error('Failed to fetch cjwt', e)
  }
}

const getAllApi = async () => {
  loading.value = true
  await Promise.all([getTzgg(), getZcjd(), getBszn(), getBbfb(), getCjwt()])
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
