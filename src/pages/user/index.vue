<template>
  <page>
    <search-form :formProps="{ model: searchParams }" @reset="tableRef?.reset"
      @search="() => tableRef?.search(searchParams)">
      <el-form-item label="编号" prop="uid">
        <el-input v-model="searchParams.uid" placeholder="请输入编号" clearable />
      </el-form-item>
      <el-form-item label="昵称" prop="nickname">
        <el-input v-model="searchParams.nickname" placeholder="请输入昵称" clearable />
      </el-form-item>
    </search-form>

    <pro-table ref="tableRef" :request="getUserPaginationApi" :request-options="{
      onSuccess: handleRequestSuccess
    }">
      <el-table-column prop="uid" label="编号" :min-width="80" />
      <el-table-column label="头像" :min-width="80">
        <template #default="{ row }">
          <el-avatar :src="row.avatar_path" />
        </template>
      </el-table-column>
      <el-table-column prop="nickname" label="昵称" :min-width="150" />
      <el-table-column v-for="(col, index) in dynamicColumns" :key="col.id" :label="col.title" :min-width="150">
        <template #default="{ row }">
          <el-tag v-if="row.channels[index]?.audit_status === 0" type="info">未申请</el-tag>
          <el-tag v-else-if="row.channels[index]?.audit_status === 1" type="warning">待审核</el-tag>
          <el-tag v-else-if="row.channels[index]?.audit_status === 3" type="danger">已拒绝</el-tag>
          <span v-else>
            结余：<span :class="[
              row.channels[index]?.balance_count > 0 ? 'text-blue-500' :
                row.channels[index]?.balance_count < 0 ? 'text-yellow-500' : ''
            ]">{{ row.channels[index]?.balance_count }}</span>
          </span>
        </template>
      </el-table-column>
      <el-table-column label="结余限制" :min-width="90">
        <template #default="{ row }">
          <el-tag v-if="row.balance_limit === 1" type="primary">限制</el-tag>
          <el-tag v-else type="danger">无限制</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" :min-width="80">
        <template #default="{ row }">
          <el-tag v-if="row.status === 1" type="primary">正常</el-tag>
          <el-tag v-else type="danger">禁用</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="注册时间" :min-width="160" />
      <el-table-column prop="last_login_time" label="最后登录时间" :min-width="160" />
      <el-table-column prop="last_login_ip" label="最后登录IP" :min-width="160" />
      <el-table-column label="操作" fixed="right" :width="220">
        <template #default="{ row }">
          <action-group>
            <action-item>
              <el-button link type="primary" @click="handleEdit(row.id)">编辑</el-button>
            </action-item>
            <action-item>
              <el-button link type="primary" @click="handleOpenDrawer('release', row.id)">
                放人数据
              </el-button>
            </action-item>
            <action-item>
              <el-button link type="primary" @click="handleOpenDrawer('take', row.id)">要人数据</el-button>
            </action-item>
          </action-group>
        </template>
      </el-table-column>
    </pro-table>

    <OrderDrawer v-model:visible="drawerVisible" :type="drawerType" :userId="currentUserId" />
    <UserForm v-model:visible="userFormVisible" :id="currentUserId" @finished="tableRef?.refresh" />
  </page>
</template>

<script setup lang="ts">
import { getUserPaginationApi } from "@/api/user";
import type { ProTableInstance } from "@/components/ProTable/type";
import { ref } from "vue";
import OrderDrawer from "./OrderDrawer.vue";
import UserForm from "./UserForm.vue";

const tableRef = ref<ProTableInstance>();

const drawerVisible = ref(false);
const userFormVisible = ref(false);
const drawerType = ref<'release' | 'take'>('release');
const currentUserId = ref<number>();

const handleOpenDrawer = (type: 'release' | 'take', id: number) => {
  drawerType.value = type;
  currentUserId.value = id;
  drawerVisible.value = true;
};

const handleEdit = (id: number) => {
  currentUserId.value = id;
  userFormVisible.value = true;
};

const searchParams = ref({
  uid: "",
  nickname: "",
});

const dynamicColumns = ref<{ id: number; title: string }[]>([]);

const handleRequestSuccess = (res: any) => {
  const list = res.data
  if (list?.length > 0) {
    const firstRow = list[0];
    dynamicColumns.value = firstRow.channels.map((channel: any) => ({
      id: channel.id,
      title: channel.title,
    }));
  }
};


</script>
