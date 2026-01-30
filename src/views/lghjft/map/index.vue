<template>
  <div class="map-wrapper">
    <!-- 地图显示 -->
    <div id="container"></div>

    <!-- 搜索地址 -->
    <div class="drawer_search">
      <el-autocomplete v-model="searchKeyword" placeholder="请输入地点名称或地址" style="width: 200px;"
        :fetch-suggestions="querySearch" :trigger-on-focus="false" @select="handleSelect"
        @keyup.enter.prevent="searchLocation" class="map-page-autocomplete">
        <!-- 自定义下拉项：显示名称 + 完整地址 -->
        <template #default="{ item }">
          <div class="autocomplete-item">
            <div class="item-name">{{ item.value }}</div>
            <div v-if="item.address" class="item-address">📍{{ item.address }}</div>
          </div>
        </template>
      </el-autocomplete>
    </div>

    <!-- 标记点名称列表 -->
    <div class="marker-list">
      <el-scrollbar height="700px">
        <el-card shadow="hover">
          <div class="marker-names-container">
            <div v-for="marker in markerListForDisplay" :key="marker.id"
              @click="navigateToMarker(marker.name, marker.id)" class="marker-name-item">
              {{ marker.name }}
            </div>
          </div>
        </el-card>
      </el-scrollbar>
    </div>

    <!-- 添加标注 -->
    <el-button class="drawer-btn" type="primary" @click="handleAdd">
      添加标注
    </el-button>
  </div>

  <!-- 标注点信息弹窗 -->
  <el-dialog v-model="infoDialogVisible" title="详细信息" width="400px" class="custom-info-dialog" @close="resetMarkerIcon">
    <div v-if="currentMarker" class="marker-info">
      <p><strong>地点名称：</strong>{{ currentMarker.name }}</p>
      <p><strong>联系电话：</strong>{{ currentMarker.phone }}</p>
      <p><strong>详细地址：</strong>{{ currentMarker.address }}</p>
      <p><strong>上班时间：</strong>{{ currentMarker.jobtime || '周一至周五 09:00-18:00' }}</p>
      <p><strong> 级 别：</strong>
        <dict-tag :type="DICT_TYPE.GH_MARKER_TYPE" :value="currentMarker.grade" class="reset-dict-tag" />
      </p>
    </div>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="danger" @click="handleDelete(currentMarker?.id)">删除</el-button>
        <el-button type="primary" @click="handleEdit(currentMarker?.id)">修改</el-button>
      </span>
    </template>
  </el-dialog>

  <!-- 共用的添加/修改标注抽屉 -->
  <el-drawer v-model="formDrawerVisible" :title="formTitle" size="500px">
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="80px" style="padding: 20px;">
      <el-form-item label="地点名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入地点名称" />
      </el-form-item>

      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="formData.phone" placeholder="请输入联系电话" />
      </el-form-item>

      <el-form-item label="详细地址" prop="address">
        <el-input v-model="formData.address" type="textarea" :rows="2" placeholder="请输入详细地址" />
      </el-form-item>

      <el-form-item label="工作时间" prop="jobtime">
        <el-input v-model="formData.jobtime" placeholder="请输入格式：周一至周五 9:00-17:00" />
      </el-form-item>

      <el-form-item label="级别" prop="grade">
        <el-select v-model="formData.grade" placeholder="请选择级别">
          <el-option v-for="dict in getStrDictOptions(DICT_TYPE.GH_MARKER_TYPE)" :key="dict.value" :label="dict.label"
            :value="dict.value" />
        </el-select>
      </el-form-item>

      <el-form-item label="地理坐标" required>
        <div style="display: flex; gap: 10px;">
          <el-form-item prop="lng" style="margin-bottom: 0; flex: 1;">
            <el-input v-model="formData.lng" placeholder="经度" />
          </el-form-item>
          <el-form-item prop="lat" style="margin-bottom: 0; flex: 1;">
            <el-input v-model="formData.lat" placeholder="纬度" />
          </el-form-item>
        </div>
      </el-form-item>

      <el-form-item label="行政区划代码">
        <el-input v-model="formData.xzqhDm" placeholder="请输入行政区划代码" />
      </el-form-item>
    </el-form>

    <div style="padding: 0 20px 20px; text-align: right;">
      <el-button @click="formDrawerVisible = false">取消</el-button>
      <el-button type="primary" @click="submitForm" :loading="formLoading">
        {{ formType === 'create' ? '添加标注' : '保存修改' }}
      </el-button>
    </div>
  </el-drawer>
</template>

<script setup>
import { onMounted, ref, reactive, computed, nextTick } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";
import { ElMessage } from "element-plus";
import { MarkerInfoApi } from '@/api/lghjft/markerinfo/index'
import { getStrDictOptions, DICT_TYPE } from '@/utils/dict'
import { ElMessageBox } from "element-plus";

// ========== 统一的数据存储 ==========
const allMarkersData = ref(new Map()); // 存储所有标记点的完整数据，key为id
const markerNameList = ref([]); // 存储标记点名称列表
const markerListForDisplay = ref([]); // 用于显示的名称列表，包含id用于导航

// 地图实例
let map = null;
const markers = new Map(); // 存储地图标记实例

// 搜索相关变量
const searchKeyword = ref('')

// 状态
const infoDialogVisible = ref(false); // 信息弹窗
const formDrawerVisible = ref(false); // 表单抽屉
const currentMarker = ref(null);      // 当前选中的标注
const formLoading = ref(false);       // 表单提交加载状态
const formType = ref('');             // 表单类型：create / update
const formRef = ref();                // 表单引用

// ========== 高亮标记管理 ==========
const highlightMarker = ref(null); // 存储当前高亮的标记
const markerIcon = {
  default: '//webapi.amap.com/theme/v1.3/markers/b/mark_bs.png',
  green: '//webapi.amap.com/theme/v1.3/markers/n/mark_r.png'
};

// ========== 搜索联想功能 ==========
const querySearch = async (queryString, cb) => {
  if (!queryString.trim()) {
    cb([]);
    return;
  }

  try {
    const res = await MarkerInfoApi.getMarkerInfoPage({
      pageNo: 1,
      pageSize: 10,
      searchKey: queryString.trim() // 使用 searchKey 参数
    });

    const list = res.list || res.records || [];
    const suggestions = list.map(item => ({
      value: item.name,
      address: item.address,
      id: item.id
    }));

    cb(suggestions);
  } catch (error) {
    cb([]);
  }
};

// ========== 选中提示项 ==========
const handleSelect = (item) => {
  searchKeyword.value = item.value;
  navigateToMarker(item.value, item.id);
}

// ========== 列表项点击导航 ==========
const navigateToMarker = (name, id) => {
  searchKeyword.value = name;

  if (id) {
    // 如果有id，直接使用统一存储中的数据
    const markerData = allMarkersData.value.get(id);
    if (markerData) {
      highlightAndShowMarker(markerData);
      return;
    }
  }

  // 如果没有id或找不到数据，执行搜索
  searchLocation();
}

// ========== 高亮并显示标记 ==========
const highlightAndShowMarker = (markerData) => {
  const lng = parseFloat(markerData.lng);
  const lat = parseFloat(markerData.lat);

  if (isNaN(lng) || isNaN(lat)) {
    ElMessage.error('该标注点坐标格式错误！');
    return;
  }

  // 地图定位
  map.panTo([lng, lat]);

  // 高亮标记
  const targetMarker = markers.get(markerData.id);
  if (targetMarker) {
    if (highlightMarker.value) {
      resetMarkerIcon();
    }
    setMarkerGreen(targetMarker);
  }

  // 设置当前标记并显示弹窗
  currentMarker.value = markerData;

  // 延时打开弹窗，确保地图定位完成
  setTimeout(() => {
    infoDialogVisible.value = true;
  }, 300);
}

// ========== 计算标题 ==========
const formTitle = computed(() => {
  return formType.value === 'create' ? '添加标注' : '修改标注';
})

// ========== 表单数据 ==========
const formData = ref({
  id: undefined,
  name: '',
  phone: '',
  address: '',
  lng: '',
  lat: '',
  xzqhDm: '',
  jobtime: '',
  grade: '',
  isDeleted: 0
})

// ========== 工作时间格式校验 ==========
const validateJobtimeFormat = (rule, value, callback) => {
  if (!value || value.trim() === '') {
    return callback();
  }

  const reg = /^(周一至周五|周一至周六|周日|全天)\s\d{1,2}:\d{2}-\d{1,2}:\d{2}$/;

  if (!reg.test(value.trim())) {
    callback(new Error('工作时间格式错误！请按示例：周一至周五 9:00-17:00 输入'));
  } else {
    callback();
  }
};

// ========== 表单验证规则 ==========
const formRules = reactive({
  name: [{ required: true, message: '地点名称不能为空', trigger: 'blur' }],
  phone: [{ required: true, message: '联系电话不能为空', trigger: 'blur' }],
  address: [{ required: true, message: '详细地址不能为空', trigger: 'blur' }],
  grade: [{ required: true, message: '部门级别不能为空', trigger: 'blur' }],
  jobtime: [
    { message: '工作时间不能为空', trigger: 'blur' },
    { validator: validateJobtimeFormat, trigger: ['blur', 'change'] }
  ],
  lng: [
    { required: true, message: '经度不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && isNaN(parseFloat(value))) {
          callback(new Error('经度必须是数字'));
        } else if (value && (parseFloat(value) < 73 || parseFloat(value) > 135)) {
          callback(new Error('经度范围应在73-135之间'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ],
  lat: [
    { required: true, message: '纬度不能为空', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value && isNaN(parseFloat(value))) {
          callback(new Error('纬度必须是数字'));
        } else if (value && (parseFloat(value) < 3 || parseFloat(value) > 54)) {
          callback(new Error('纬度范围应在3-54之间'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
})

// ========== 打开添加表单 ==========
const handleAdd = () => {
  formType.value = 'create';
  resetForm();

  // 设置默认坐标为地图中心
  if (map) {
    const center = map.getCenter();
    formData.value.lng = center.lng.toFixed(6);
    formData.value.lat = center.lat.toFixed(6);
  }

  formDrawerVisible.value = true;
}

// ========== 删除标记 ==========
const handleDelete = async (id) => {
  if (!id) return;

  try {
    await ElMessageBox.confirm(
      '确定要删除该标注点吗？',
      '删除确认',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    );

    await MarkerInfoApi.deleteMarkerInfo(id);
    ElMessage.success('删除成功');

    // 移除地图标记
    const marker = markers.get(id);
    if (marker) {
      marker.setMap(null);
      markers.delete(id);
    }

    // 从统一存储中移除
    allMarkersData.value.delete(id);

    // 更新显示列表
    updateMarkerDisplayList();

    infoDialogVisible.value = false;
    currentMarker.value = null;
    resetMarkerIcon();

  } catch (error) {
    if (error !== 'cancel') {

      ElMessage.error('删除失败');
    }
  }
}

// ========== 打开修改表单 ==========
const handleEdit = async (id) => {
  if (!id) return;

  formType.value = 'update';
  formLoading.value = true;

  try {
    // 从统一存储中获取数据，确保数据一致性
    let marker = allMarkersData.value.get(id);

    // 如果统一存储中没有，从接口获取
    if (!marker) {
      const response = await MarkerInfoApi.getMarkerInfo(id);
      console.log(response);

      marker = response;
    }

    // 填充表单数据
    formData.value = {
      id: marker.id,
      name: marker.name || '',
      phone: marker.phone || '',
      address: marker.address || '',
      lng: marker.lng ? String(marker.lng) : '',
      lat: marker.lat ? String(marker.lat) : '',
      xzqhDm: marker.xzqhDm || '',
      isDeleted: marker.isDeleted || 0,
      jobtime: marker.jobtime || '',
      grade: marker.grade || ''
    };

    infoDialogVisible.value = false;
    formDrawerVisible.value = true;

  } catch (error) {
    ElMessage.error('获取标注信息失败');
  } finally {
    formLoading.value = false;
  }
}

// ========== 提交表单 ==========
const submitForm = async () => {
  try {
    await formRef.value.validate();
  } catch (error) {

    return;
  }

  formLoading.value = true;

  try {
    const submitData = {
      ...formData.value,
      lng: parseFloat(formData.value.lng),
      lat: parseFloat(formData.value.lat)
    };

    if (formType.value === 'create') {
      // 新增
      const response = await MarkerInfoApi.createMarkerInfo(submitData);
      const newMarkerId = response;
      const newMarker = await MarkerInfoApi.getMarkerInfo(newMarkerId);

      // 添加到地图和统一存储
      addMarkerToMap(newMarker);

      // 更新统一存储
      allMarkersData.value.set(newMarker.id, newMarker);

      // 更新显示列表
      updateMarkerDisplayList();

      ElMessage.success('添加成功');
    } else {
      // 修改
      await MarkerInfoApi.updateMarkerInfo(submitData);
      ElMessage.success('修改成功');

      // 获取更新后的完整数据
      const updatedMarker = await MarkerInfoApi.getMarkerInfo(submitData.id);

      // 更新统一存储
      allMarkersData.value.set(submitData.id, updatedMarker);

      // 更新地图标记
      const marker = markers.get(submitData.id);
      if (marker) {
        marker.setPosition([submitData.lng, submitData.lat]);
        marker.setTitle(submitData.name);

        // 更新标记实例绑定的数据
        marker.setExtData(updatedMarker);
      }

      // 如果当前正在显示该标记，更新显示数据
      if (currentMarker.value && currentMarker.value.id === submitData.id) {
        currentMarker.value = updatedMarker;
      }

      // 更新显示列表
      updateMarkerDisplayList();
    }

    formDrawerVisible.value = false;
    resetForm();

  } catch (error) {

    ElMessage.error('操作失败');
  } finally {
    formLoading.value = false;
  }
}

// ========== 重置表单 ==========
const resetForm = () => {
  formData.value = {
    id: undefined,
    name: '',
    phone: '',
    address: '',
    lng: '',
    lat: '',
    xzqhDm: '',
    isDeleted: 0,
    jobtime: '',
    grade: ''
  };

  if (formRef.value) {
    nextTick(() => {
      formRef.value.resetFields();
    });
  }
}

// ========== 添加标记到地图 ==========
const addMarkerToMap = (markerData) => {
  if (!map || !window.AMap || !markerData || !markerData.id) {
    return;
  }

  const AMap = window.AMap;
  const lng = parseFloat(markerData.lng);
  const lat = parseFloat(markerData.lat);

  if (isNaN(lng) || isNaN(lat)) {
    return;
  }

  try {
    // 创建标记图标
    const defaultIcon = new AMap.Icon({
      size: new AMap.Size(19, 32),
      image: markerIcon.default,
      imageSize: new AMap.Size(19, 32)
    });

    // 创建标记实例
    const marker = new AMap.Marker({
      position: [lng, lat],
      title: markerData.name || '未命名标注点',
      map: map,
      icon: defaultIcon,
      offset: new AMap.Pixel(-13, -30)
    });

    // 绑定完整数据到标记实例
    marker.setExtData(markerData);

    // 标记点击事件
    marker.on("click", () => {
      // 获取标记绑定的数据
      const markerData = marker.getExtData();
      if (markerData) {
        // 重置之前的高亮标记
        if (highlightMarker.value) {
          resetMarkerIcon();
        }

        // 当前标记高亮
        setMarkerGreen(marker);

        // 打开详情弹窗
        currentMarker.value = markerData;
        infoDialogVisible.value = true;
      }
    });

    // 存入标记集合
    markers.set(markerData.id, marker);

  } catch (error) {
    console.error('创建标记失败:', error);
  }
}

// ========== 更新显示列表 ==========
const updateMarkerDisplayList = () => {
  // 从统一存储中获取所有标记，生成显示列表
  markerListForDisplay.value = Array.from(allMarkersData.value.values())
    .filter(marker => marker.name)
    .map(marker => ({
      id: marker.id,
      name: marker.name
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

// ========== 加载标注数据 ==========
const loadMarkers = async () => {
  try {
    // 1. 调用接口获取分页数据（直接返回 {list: [...], total: xx}）
    const response = await MarkerInfoApi.getMarkerInfoPage({
      pageNo: 1,
      pageSize: 100
    });
    console.log(response);

    // 2. 精简解析逻辑：优先提取list/records/data，兜底数组
    const markerList = (() => {
      if (response?.list && Array.isArray(response.list)) return response.list;
      if (response?.records && Array.isArray(response.records)) return response.records;
      if (response?.data && Array.isArray(response.data)) return response.data;
      return Array.isArray(response) ? response : [];
    })();

    // 3. 清空现有标注
    markers.forEach(marker => marker?.setMap?.(null));
    markers.clear();
    allMarkersData.value.clear();

    // 4. 遍历处理标注点（精简判空和类型转换）
    markerList.forEach(marker => {
      const lng = parseFloat(marker.lng);
      const lat = parseFloat(marker.lat);
      if (!isNaN(lng) && !isNaN(lat)) {
        allMarkersData.value.set(marker.id, { ...marker, lng, lat });
        addMarkerToMap({ ...marker, lng, lat });
      }
    });

    // 5. 更新显示列表
    updateMarkerDisplayList();
  } catch (error) {
    ElMessage.error('加载标注点失败');
  }
};
// ========== 图标变色相关方法 ==========
const setMarkerGreen = (marker) => {
  if (!marker || !window.AMap) return;
  const AMap = window.AMap;

  const greenIcon = new AMap.Icon({
    size: new AMap.Size(19, 32),
    image: markerIcon.green,
    imageSize: new AMap.Size(19, 32)
  });

  marker.setIcon(greenIcon);
  highlightMarker.value = marker;
};

const resetMarkerIcon = () => {
  if (!highlightMarker.value || !window.AMap) return;
  const AMap = window.AMap;

  const defaultIcon = new AMap.Icon({
    size: new AMap.Size(19, 32),
    image: markerIcon.default,
    imageSize: new AMap.Size(19, 32)
  });

  highlightMarker.value.setIcon(defaultIcon);
  highlightMarker.value = null;
};

// ========== 搜索定位方法 ==========
const searchLocation = async () => {
  const keyword = searchKeyword.value.trim();
  if (!keyword) {
    ElMessage.warning('请输入名称或地址');
    return;
  }

  try {
    const res = await MarkerInfoApi.getMarkerInfoPage({
      pageNo: 1,
      pageSize: 1,
      searchKey: keyword // 使用 searchKey 参数
    });

    const list = res.list || res.records || [];
    if (list.length > 0) {
      highlightAndShowMarker(list[0]);
    } else {
      ElMessage.warning('未找到相关结果');
    }
  } catch (error) {
    ElMessage.error('搜索失败');
  }
};

// ========== 初始化地图 ==========
onMounted(async () => {
  window._AMapSecurityConfig = {
    securityJsCode: "ed43bf56c1ec0c263c3ccc2e0fda82ce",
  }

  try {
    const AMap = await AMapLoader.load({
      key: "e3e9c66c6113d52b62daacbdadeabd2a",
      version: "2.0",
      plugins: ["AMap.Marker", "AMap.Scale", "AMap.ToolBar"],
    })

    window.AMap = AMap;

    map = new AMap.Map("container", {
      viewMode: "3D",
      zoom: 11,
      center: [103.834304, 36.061089],
      mapStyle: 'amap://styles/macaron',
    })

    // 添加比例尺
    const scale = new AMap.Scale({
      position: "LB",
    });
    map.addControl(scale);

    // 添加工具条
    const toolBar = new AMap.ToolBar({
      position: {
        right: "40px",
        top: "105px",
      },
    });
    map.addControl(toolBar);

    // 等待地图渲染完成
    await new Promise(resolve => setTimeout(resolve, 500));

    // 加载标注数据
    await loadMarkers();

  } catch (error) {

    ElMessage.error("地图加载失败");
  }
})
</script>

<style scoped lang="scss">
// 标记点列表容器基础样式
.marker-list {
  width: 200px;
  position: absolute;
  top: 50px;
  z-index: 1000;
  height: 100%;
  box-sizing: border-box;
}

// 滚动容器适配
::v-deep .el-scrollbar {
  width: 100%;

  .el-scrollbar__view {}
}

// 标记点卡片美化
::v-deep .el-card {
  width: 100% !important;
  border-radius: 8px !important;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.06) !important;

  .el-card__body {
    padding: 16px !important;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
  }
}

// 标记点名称容器间距
.marker-names-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

// 核心：标记点项样式（合并重复，保留最终hover/点击交互）
.marker-name-item {
  padding: 6px 12px;
  border-radius: 4px;
  margin: 1px 0;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  background-color: #fff;
  border: 1px solid #e5e6eb;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f9ff;
    border-color: #409eff;
    color: #1989fa;
  }

  &:active {
    background-color: #e6f4ff;
  }
}

// 响应式适配
@media (max-width: 1200px) {
  .marker-list {
    width: 220px;
  }
}

@media (max-width: 992px) {
  .marker-list {
    width: 200px;
  }
}

.autocomplete-item {
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.4;
  border-bottom: 1px solid #eee;

  &:last-child {
    border-bottom: none;
  }

  .item-name {
    font-weight: bold;
    color: #333;
    margin-bottom: 2px;
  }

  .item-address {
    font-size: 12px;
    color: #666;
    white-space: normal;
    /* 允许换行 */
    word-wrap: break-word;
  }
}

// 地图容器及布局
.map-wrapper {
  position: relative;
  width: 100%;
  height: 700px;
}

#container {
  width: 100%;
  height: 100%;
}

// 搜索框+添加按钮定位
.drawer_search {
  z-index: 1000;
  position: absolute;
  top: 10px;
}

.drawer-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1000;
}

// 弹窗相关样式（合并重复，整合所有弹窗效果）
.marker-info {
  line-height: 1.8;
  color: #333;

  strong {
    font-weight: bold;
    display: inline-block;
    width: 80px;
    text-align: right;
    margin-right: 5px;
  }
}

.dialog-footer {
  text-align: right;
}

// 弹窗标题加粗居中
:deep(.el-dialog__title) {
  font-weight: bold;
  text-align: center;
  width: 100%;
}
</style>
