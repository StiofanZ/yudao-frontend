<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="100px"
    >
      <el-form-item label="社会信用代码" prop="shxydm">
        <el-input
          v-model="queryParams.shxydm"
          class="!w-240px"
          clearable
          placeholder="请输入社会信用代码"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="纳税人名称" prop="nsrmc">
        <el-input
          v-model="queryParams.nsrmc"
          class="!w-240px"
          clearable
          placeholder="请输入纳税人名称"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="街道乡镇" prop="jdxzDm">
        <el-select
          v-model="queryParams.jdxzDm"
          class="!w-240px"
          clearable
          placeholder="请选择街道乡镇"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.SYS_JDXZ)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="科所分局" prop="zgswskfjDm">
        <el-select
          v-model="queryParams.zgswskfjDm"
          class="!w-240px"
          clearable
          placeholder="请选择科所分局"
        >
          <el-option
            v-for="dict in getDictOptions(DICT_TYPE.SYS_SWGJ_TYPE)"
            :key="dict.value"
            :label="dict.label"
            :value="dict.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="基层工会账号" prop="jcghzh">
        <el-input
          v-model="queryParams.jcghzh"
          class="!w-240px"
          clearable
          placeholder="请输入基层工会账号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="基层工会户名" prop="jcghhm">
        <el-input
          v-model="queryParams.jcghhm"
          class="!w-240px"
          clearable
          placeholder="请输入基层工会户名"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon class="mr-5px" icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon class="mr-5px" icon="ep:refresh" /> 重置</el-button>
        <el-button
          v-hasPermi="['lghjft:hjgl-jcxx:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :show-overflow-tooltip="true" :stripe="true">
      <el-table-column align="center" label="登记序号" prop="djxh" width="120" />
      <el-table-column align="center" label="社会信用代码" prop="shxydm" width="180" />
      <el-table-column align="center" label="纳税人名称" min-width="200" prop="nsrmc" />
      <el-table-column align="center" label="街道乡镇" prop="jdxzDm">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.SYS_JDXZ" :value="scope.row.jdxzDm" />
        </template>
      </el-table-column>
      <el-table-column align="center" label="基层工会账号" prop="jcghzh" width="180" />
      <el-table-column align="center" label="基层工会户名" min-width="200" prop="jcghhm" />
      <el-table-column align="center" label="基层工会银行" prop="jcghyh" width="150" />
      <el-table-column align="center" fixed="right" label="操作" width="180">
        <template #default="scope">
          <el-button
            v-hasPermi="['lghjft:hjgl-jcxx:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.djxh)"
          >
            <Icon class="mr-5px" icon="ep:edit" /> 修改
          </el-button>
          <el-button
            v-hasPermi="['lghjft:hjgl-jcxx:delete']"
            link
            type="danger"
            @click="handleDelete(scope.row.djxh)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗 -->
  <JcxxForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { DICT_TYPE, getDictOptions } from '@/utils/dict'
import { deleteJcxx, getJcxxPage } from '@/api/lghjft/hjgl/jcxx'
import JcxxForm from './JcxxForm.vue'

defineOptions({ name: 'JcxxIndex' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  shxydm: undefined,
  nsrmc: undefined,
  jdxzDm: undefined,
  zgswskfjDm: undefined,
  jcghzh: undefined,
  jcghhm: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await getJcxxPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: string) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: string) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await deleteJcxx(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
