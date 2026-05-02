<template>
  <page>
    <div class="mb-4">
      <el-button icon="Plus" type="primary" @click="handleCreate">新增群</el-button>
    </div>
    <pro-table ref="tableRef" :request="getChannelPaginationApi">
      <el-table-column prop="id" label="ID" />
      <el-table-column prop="title" label="群名" />
      <el-table-column prop="count" label="人数" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column label="状态">
        <template #default="{ row }">
          <el-tag v-if="row.status === 1" type="primary">正常</el-tag>
          <el-tag v-else-if="row.status === 2" type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" :width="140">
        <template #default="{ row }">
          <action-group>
            <action-item>
              <el-button link type="primary" @click="handleUpdate(row)">
                编辑
              </el-button>
            </action-item>
            <action-item>
              <el-button link type="primary" @click="handleDelete(row.id)">删除</el-button>
            </action-item>
          </action-group>
        </template>
      </el-table-column>
    </pro-table>
    <channel-form v-model:visible="formVisible" :id="id" :mode="mode" @finished="tableRef?.refresh()" />
  </page>
</template>

<script setup lang="ts">
import { deleteChannelApi, getChannelPaginationApi } from "@/api/channel";
import type { ProTableInstance } from "@/components/ProTable/type";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";
import ChannelForm from "./ChannelForm.vue";

const tableRef = ref<ProTableInstance>();

const formVisible = ref(false);
const id = ref<number>();
const mode = ref<"create" | "update">("create");

const handleCreate = () => {
  mode.value = "create";
  id.value = undefined;
  formVisible.value = true;
};

const handleUpdate = (row: any) => {
  mode.value = "update";
  id.value = row.id;
  formVisible.value = true;
};

const handleDelete = (channelId: number) => {
  ElMessageBox.confirm("确定要删除该群吗？", "提示", {
    type: "warning",
  }).then(() => {
    deleteChannelApi(channelId).then(() => {
      ElMessage.success("删除成功");
      tableRef.value?.refresh();
    });
  });
};
</script>
