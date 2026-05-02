<template>
  <dialog-form v-model:visible="visible" :form-props="{ model: formData, rules }" :params="id"
    :request="mode === 'update' ? getDetailInfo : undefined" @submit="handleSubmit"
    :dialog-props="{ title: mode === 'create' ? '新增群' : '编辑群' }">
    <el-form-item label="群名" prop="title">
      <el-input v-model="formData.title" />
    </el-form-item>
    <el-form-item label="结余限制数量" prop="balance_limit_count">
      <el-input-number v-model="formData.balance_limit_count" :precision="0" />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-radio-group v-model="formData.status">
        <el-radio :value="1">正常</el-radio>
        <el-radio :value="2">禁用</el-radio>
      </el-radio-group>
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import {
  createChannelApi,
  getChannelDetailApi,
  updateChannelApi,
} from "@/api/channel";
import { ElMessage, type FormRules } from "element-plus";
import { ref } from "vue";

const emit = defineEmits(["finished"]);

const props = defineProps<{
  mode: "create" | "update";
  id?: number;
}>();

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  title: "",
  balance_limit_count: 0,
  status: 1,
});

const rules: FormRules = {
  title: [{ required: true, message: "请输入群名" }],
  balance_limit_count: [{ required: true, message: "请输入结余限制数量" }],
  status: [{ required: true, message: "请选择状态" }],
};

const getDetailInfo = async (params: number) =>
  getChannelDetailApi(params).then((res) => ({
    title: res.title,
    balance_limit_count: res.balance_limit_count,
    status: res.status,
  }));

const handleSubmit = (cb: (result: boolean) => void) => {
  return props.mode === "create"
    ? handleCreateSubmit(cb)
    : handleUpdateSubmit(cb);
};

const handleCreateSubmit = (cb: (result: boolean) => void) => {
  createChannelApi(formData.value)
    .then(() => {
      ElMessage.success("新增成功");
      visible.value = false;
      emit("finished");
    })
    .finally(() => cb(true));
};

const handleUpdateSubmit = (cb: (result: boolean) => void) => {
  if (!props.id) return cb(false);
  updateChannelApi({ id: props.id, ...formData.value })
    .then(() => {
      ElMessage.success("编辑成功");
      visible.value = false;
      emit("finished");
    })
    .finally(() => cb(true));
};
</script>
