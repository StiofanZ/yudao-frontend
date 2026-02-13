<template>
  <ContentWrap>
    <el-form
      ref="queryFormRef"
      :inline="true"
      :model="queryParams"
      class="-mb-15px"
      label-width="80px"
    >
      <el-form-item label="账号ID" prop="dlzhId">
        <el-input
          v-model="queryParams.dlzhId"
          class="!w-240px"
          clearable
          placeholder="请输入登录账号ID"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="登记序号" prop="djxh">
        <el-input
          v-model="queryParams.djxh"
          class="!w-240px"
          clearable
          placeholder="请输入登记序号"
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item label="身份类型" prop="sflx">
        <el-select
          v-model="queryParams.sflx"
          class="!w-240px"
          clearable
          placeholder="请选择身份类型"
        >
          <el-option label="法定代表人" value="01" />
          <el-option label="财务负责人" value="02" />
        </el-select>
      </el-form-item>
      <el-form-item label="工会类型" prop="ghlx">
        <el-select
          v-model="queryParams.ghlx"
          class="!w-240px"
          clearable
          placeholder="请选择工会类型"
        >
          <el-option label="基层工会" value="01" />
          <el-option label="缴费单位" value="02" />
          <el-option label="联合工会" value="03" />
          <el-option label="集团工会" value="04" />
          <el-option label="产业系统工会" value="05" />
          <el-option label="县区总工会" value="06" />
          <el-option label="市总工会" value="07" />
          <el-option label="省总工会" value="08" />
        </el-select>
      </el-form-item>
      <el-form-item label="权限类型" prop="qxlx">
        <el-select
          v-model="queryParams.qxlx"
          class="!w-240px"
          clearable
          placeholder="请选择权限类型"
        >
          <el-option label="管理员" value="01" />
          <el-option label="一般人" value="02" />
        </el-select>
      </el-form-item>
      <el-form-item label="授权状态" prop="status">
        <el-select
          v-model="queryParams.status"
          class="!w-240px"
          clearable
          placeholder="请选择授权状态"
        >
          <el-option :value="0" label="暂未授权" />
          <el-option :value="1" label="同意授权" />
          <el-option :value="2" label="拒绝授权" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon class="mr-5px" icon="ep:search" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon class="mr-5px" icon="ep:refresh" /> 重置</el-button>
        <el-button
          v-hasPermi="['lghjft:qx-sfxx:create']"
          plain
          type="primary"
          @click="openForm('create')"
        >
          <Icon class="mr-5px" icon="ep:plus" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <ContentWrap>
    <el-table
      v-loading="loading"
      :data="list"
      :show-overflow-tooltip="true"
      :stripe="true"
      row-key="id"
    >
      <el-table-column align="center" label="ID" prop="id" width="80" />
      <el-table-column align="center" label="登录账号" prop="dlzh" min-width="150" />
      <el-table-column align="center" label="社会信用代码" prop="shxydm" min-width="180" />
      <el-table-column align="center" label="身份类型" prop="sflx" width="120">
        <template #default="scope">
          <span v-if="scope.row.sflx === '01'">法定代表人</span>
          <span v-else-if="scope.row.sflx === '02'">财务负责人</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="工会类型" prop="ghlx" width="120">
        <template #default="scope">
          <span v-if="scope.row.ghlx === '01'">基层工会</span>
          <span v-else-if="scope.row.ghlx === '02'">缴费单位</span>
          <span v-else-if="scope.row.ghlx === '03'">联合工会</span>
          <span v-else-if="scope.row.ghlx === '04'">集团工会</span>
          <span v-else-if="scope.row.ghlx === '05'">产业系统工会</span>
          <span v-else-if="scope.row.ghlx === '06'">县区总工会</span>
          <span v-else-if="scope.row.ghlx === '07'">市总工会</span>
          <span v-else-if="scope.row.ghlx === '08'">省总工会</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="权限类型" prop="qxlx" width="100">
        <template #default="scope">
          <el-tag v-if="scope.row.qxlx === '01'" type="success">管理员</el-tag>
          <el-tag v-else-if="scope.row.qxlx === '02'" type="info">一般人</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="部门" min-width="140" prop="deptName" />
      <el-table-column align="center" label="授权状态" prop="status" width="110">
        <template #default="scope">
          <el-tag v-if="scope.row.status === 0" type="warning">暂未授权</el-tag>
          <el-tag v-else-if="scope.row.status === 1" type="success">同意授权</el-tag>
          <el-tag v-else-if="scope.row.status === 2" type="danger">拒绝授权</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" label="拒绝原因" min-width="160" prop="jjyy">
        <template #default="scope">
          <span>{{ scope.row.jjyy || '-' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :formatter="dateFormatter"
        align="center"
        label="创建时间"
        prop="createTime"
        width="180"
      />
      <el-table-column align="center" fixed="right" label="操作" width="300">
        <template #default="scope">
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:update']"
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
          >
            编辑
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:audit']"
            :disabled="scope.row.status === 1"
            link
            type="success"
            @click="handleAgreeAuthorize(scope.row)"
          >
            同意授权
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:audit']"
            :disabled="scope.row.status === 2"
            link
            type="danger"
            @click="handleRejectAuthorize(scope.row)"
          >
            拒绝授权
          </el-button>
          <el-button
            v-hasPermi="['lghjft:qx-sfxx:audit']"
            :disabled="scope.row.status !== 1"
            link
            type="warning"
            @click="handleUnbind(scope.row.id)"
          >
            解绑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      v-model:limit="queryParams.pageSize"
      v-model:page="queryParams.pageNo"
      :total="total"
      @pagination="getList"
    />
  </ContentWrap>

  <SfxxForm ref="formRef" @success="getList" />
</template>

<script lang="ts" setup>
import { dateFormatter } from '@/utils/formatTime'
import { type Sfxx, SfxxApi } from '@/api/lghjft/qx/sfxx'
import SfxxForm from './SfxxForm.vue'
import { ElMessageBox } from 'element-plus'

defineOptions({ name: 'LghjftQxSfxx' })

const message = useMessage()
const { t } = useI18n()

const loading = ref(true)
const list = ref<Sfxx[]>([])
const total = ref(0)
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  dlzhId: undefined as number | undefined,
  djxh: undefined as string | undefined,
  sflx: undefined as string | undefined,
  ghlx: undefined as string | undefined,
  qxlx: undefined as string | undefined,
  status: undefined as number | undefined
})
const queryFormRef = ref()

const getList = async () => {
  loading.value = true
  try {
    const data = await SfxxApi.getSfxxPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

const handleAgreeAuthorize = async (row: Sfxx) => {
  try {
    await ElMessageBox.confirm(
      `<div>申请原因：${row.sqyy || '无'}</div><div style="margin-top: 10px;">确认同意授权？</div>`,
      '同意授权',
      {
        dangerouslyUseHTMLString: true,
        confirmButtonText: t('common.ok'),
        cancelButtonText: t('common.cancel'),
        type: 'warning'
      }
    )
    await SfxxApi.auditSfxx(row.id!, 1)
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

const handleRejectAuthorize = async (row: Sfxx) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入拒绝授权原因', '拒绝授权', {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      inputPattern: /\S+/,
      inputErrorMessage: '拒绝授权原因不能为空'
    })
    await SfxxApi.auditSfxx(row.id!, 2, value)
    message.success(t('common.updateSuccess'))
    await getList()
  } catch {}
}

const handleUnbind = async (id: number) => {
  try {
    const { value } = await ElMessageBox.prompt('请输入解绑原因', '解绑', {
      confirmButtonText: t('common.ok'),
      cancelButtonText: t('common.cancel'),
      inputPattern: /\S+/,
      inputErrorMessage: '解绑原因不能为空'
    })
    await SfxxApi.unbindSfxx(id, value)
    message.success('解绑成功')
    await getList()
  } catch {}
}

onMounted(() => {
  getList()
})
</script>
