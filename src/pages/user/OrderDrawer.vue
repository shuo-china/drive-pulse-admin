<template>
  <el-drawer v-model="visible" :title="title" header-class="mb-0" size="800px" @open="handleOpen"
    :destroy-on-close="true">
    <el-tabs v-model="activeChannelId" @tab-change="handleTabChange" v-loading="loadingChannels">
      <el-tab-pane v-for="channel in channels" :key="channel.id" :label="channel.title" :name="channel.id" />
    </el-tabs>

    <pro-table v-if="channels.length > 0" ref="tableRef" :request="getOrderPaginationApi"
      :request-options="{ manual: true }">
      <el-table-column label="流向记录" min-width="350">
        <template #default="{ row }">
          <div class="flex items-center gap-x-4">
            <!-- 放人方 (操作人) -->
            <div class="flex items-center gap-x-3 flex-1 min-w-0">
              <el-avatar :src="row.user?.avatar_path" :size="40" class="shrink-0" />
              <div class="min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate" :title="row.user?.nickname">
                  {{ row.user?.nickname }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5">编号: {{ row.user?.uid }}</div>
              </div>
            </div>

            <!-- 转移指示 -->
            <div class="flex flex-col items-center px-4 shrink-0">
              <div class="text-sm font-bold text-blue-500 mb-0.5 tracking-wider italic">
                {{ row.count }} <span class="text-[9px] font-normal not-italic">人</span>
              </div>
              <div class="flex items-center w-16 relative">
                <!-- 渐变线条 -->
                <div class="h-[2px] w-full bg-gradient-to-r from-blue-200 to-blue-500 rounded-full ml-0.5"></div>
                <!-- 箭头图标 -->
                <el-icon :size="14" class="text-blue-500 absolute -right-1.5 top-1/2 -translate-y-1/2">
                  <CaretRight />
                </el-icon>
              </div>
            </div>

            <!-- 要人方 (目标人) -->
            <div class="flex items-center gap-x-3 flex-1 min-w-0">
              <el-avatar :src="row.target_user?.avatar_path" :size="40" class="shrink-0" />
              <div class="min-w-0">
                <div class="text-sm font-medium text-gray-900 truncate" :title="row.target_user?.nickname">
                  {{ row.target_user?.nickname }}
                </div>
                <div class="text-xs text-gray-500 mt-0.5">编号: {{ row.target_user?.uid }}</div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="操作时间" :width="180" align="center" />
    </pro-table>
    <el-empty v-else description="暂无群组分栏数据" />
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue';
import { getChannelOptionsApi } from '@/api/channel';
import { getOrderPaginationApi } from '@/api/order';
import type { ProTableInstance } from '@/components/ProTable/type';

const visible = defineModel<boolean>('visible');
const props = defineProps<{
  type: 'release' | 'take';
  userId?: number;
}>();

const title = computed(() => (props.type === 'release' ? '放人数据' : '要人数据'));

const channels = ref<any[]>([]);
const activeChannelId = ref<number>();
const loadingChannels = ref(false);
const tableRef = ref<ProTableInstance>();

const queryParams = computed(() => {
  const params: Record<string, any> = { channel_id: activeChannelId.value };
  if (props.type === 'release') {
    params.user_id = props.userId;
  } else {
    params.target_user_id = props.userId;
  }
  return params;
});

const handleOpen = async () => {
  loadingChannels.value = true;
  try {
    channels.value = await getChannelOptionsApi();
    if (channels.value.length > 0) {
      activeChannelId.value = channels.value[0].id;
      nextTick(() => {
        tableRef.value?.search(queryParams.value);
      })
    }
  } finally {
    loadingChannels.value = false;
  }
};

const handleTabChange = () => {
  tableRef.value?.search(queryParams.value);
};
</script>
