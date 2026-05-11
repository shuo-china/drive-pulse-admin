<template>
  <page>
    <pro-table ref="tableRef" :request="getApplyPaginationApi">
      <el-table-column prop="user.uid" label="编号" :min-width="70" />
      <el-table-column label="头像" :min-width="70">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-avatar :src="row.user?.avatar_path" :size="35" />
          </div>
        </template>
      </el-table-column>
      <el-table-column prop="user.nickname" label="昵称" :min-width="180" />
      <el-table-column prop="channel.title" label="申请群" :min-width="150" />
      <el-table-column prop="create_time" label="申请时间" :min-width="160" />
      <el-table-column label="操作" fixed="right" :width="120">
        <template #default="{ row }">
          <action-group>
            <action-item>
              <el-button link type="primary" @click="handleAudit(row, 2)">
                同意
              </el-button>
            </action-item>
            <action-item>
              <el-button link type="danger" @click="handleAudit(row, 3)">
                拒绝
              </el-button>
            </action-item>
          </action-group>
        </template>
      </el-table-column>
    </pro-table>
  </page>
</template>

<script setup lang="ts">
import { getApplyPaginationApi, auditApi } from "@/api/channel";
import type { ProTableInstance } from "@/components/ProTable/type";
import { ElMessage, ElMessageBox } from "element-plus";
import { ref } from "vue";

const tableRef = ref<ProTableInstance>();

const handleAudit = async (row: any, status: 2 | 3) => {
  const isAgree = status === 2;
  const title = isAgree ? '同意' : '拒绝';
  const message = isAgree ? `确定要同意用户 "${row.user.nickname}" 的申请吗？` : `确定要拒绝用户 "${row.user.nickname}" 的审核申请吗？`;

  try {
    let refuse_reason = '';

    if (isAgree) {
      await ElMessageBox.confirm(message, title, {
        title,
        cancelButtonText: '取消',
        type: 'warning',
      });
    } else {
      const result = await ElMessageBox.prompt(message, title, {
        title,
        cancelButtonText: '取消',
        inputPlaceholder: '请输入拒绝原因（可选）',
        inputType: 'textarea',
      });
      refuse_reason = result.value || '';
    }

    await auditApi({
      id: row.id,
      audit_status: status,
      refuse_reason: refuse_reason
    });

    ElMessage.success(`${title}成功`);
    tableRef.value?.refresh();
  } catch (error) {
    if (error !== 'cancel') {
      console.error(error);
    }
  }
};
</script>
