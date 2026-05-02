<template>
  <div class="h-full p-6">
    <el-card shadow="never" class="h-full flex-col-card">
      <template #header>
        <div class="flex items-center justify-between">
          <span class="font-medium">消息公告</span>
          <el-button type="primary" :loading="submitLoading" @click="handleSave">
            保存
          </el-button>
        </div>
      </template>
      <el-input v-model="content" type="textarea" placeholder="请输入通知内容" class="full-height-textarea" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { getConfigGroupListApi, type ConfigGroup } from "@/api/config_group";
import { getConfigItemListApi, updateConfigItemValueApi, type ConfigItem } from "@/api/config_item";
import { useConfigStore } from "@/store/config";
import { ElMessage } from "element-plus";

const configStore = useConfigStore();
const content = ref("");
const submitLoading = ref(false);
const currentConfigItem = ref<ConfigItem | null>(null);

const fetchData = async () => {
  try {
    const groupList = await getConfigGroupListApi() as unknown as ConfigGroup[];
    const targetGroup = groupList.find((item) => item.key === "drive_pulse");
    if (targetGroup) {
      const itemList = await getConfigItemListApi({ group_id: targetGroup.id });
      const targetItem = itemList.find((item) => item.key === "notice");
      if (targetItem) {
        currentConfigItem.value = targetItem;
        content.value = targetItem.value || "";
      }
    }
  } catch (error) {
    console.error(error);
  }
};

const handleSave = async () => {
  if (!currentConfigItem.value) {
    ElMessage.warning("未找到配置项");
    return;
  }
  submitLoading.value = true;
  try {
    await updateConfigItemValueApi({
      id: currentConfigItem.value.id,
      type: currentConfigItem.value.type,
      value: content.value,
    });
    ElMessage.success("保存成功");
    configStore.initAfterLogin();
  } catch (error) {
    console.error(error);
  } finally {
    submitLoading.value = false;
  }
};

onMounted(() => {
  fetchData();
});
</script>

<style scoped lang="scss">
.flex-col-card {
  display: flex;
  flex-direction: column;

  :deep(.el-card__body) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.full-height-textarea {
  flex: 1;
  display: flex;
  flex-direction: column;

  :deep(.el-textarea__inner) {
    flex: 1;
    resize: none;
    padding: 12px;
  }
}
</style>
