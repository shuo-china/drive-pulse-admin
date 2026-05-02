<template>
  <dialog-form v-model:visible="visible" :form-props="{ model: formData, rules }" :params="id" :request="getDetailInfo"
    @submit="handleSubmit" :dialog-props="{ title: '编辑用户' }">
    <el-form-item label="编号" prop="uid">
      <el-input v-model="formData.uid" placeholder="请输入编号" />
    </el-form-item>
    <el-form-item label="昵称" prop="nickname">
      <el-input v-model="formData.nickname" placeholder="请输入昵称" />
    </el-form-item>
    <el-form-item label="头像" prop="avatar">
      <pro-upload type="image" :upload-props="{ limit: 1 }" v-model="formData.avatar_key"
        v-model:file-list="formData.avatar" />
    </el-form-item>
    <el-form-item label="结余限制" prop="balance_limit">
      <el-switch v-model="formData.balance_limit" :active-value="1" :inactive-value="0" active-text="限制"
        inactive-text="无限制" inline-prompt />
    </el-form-item>
    <el-form-item label="状态" prop="status">
      <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="正常" inactive-text="禁用"
        inline-prompt />
    </el-form-item>
  </dialog-form>
</template>

<script setup lang="ts">
import { getUserDetailApi, updateUserApi } from "@/api/user";
import { ElMessage, type FormRules } from "element-plus";
import { ref } from "vue";

const emit = defineEmits(["updated", "finished"]);

const props = defineProps<{
  id?: number;
}>();

const visible = defineModel("visible", { type: Boolean, default: false });

const formData = ref({
  uid: "",
  nickname: "",
  avatar_key: "",
  avatar: null,
  balance_limit: 1,
  status: 1,
});

const rules: FormRules = {
  uid: [{ required: true, message: "请输入编号" }],
  nickname: [{ required: true, message: "请输入昵称" }],
};

const getDetailInfo = async (id: number) =>
  getUserDetailApi(id).then((res) => ({
    uid: res.uid,
    nickname: res.nickname,
    avatar_key: res.avatar_key,
    avatar: res.avatar,
    balance_limit: res.balance_limit,
    status: res.status,
  }));

const handleSubmit = (cb: (result: boolean) => void) => {
  updateUserApi({
    ...formData.value,
    id: props.id,
  })
    .then(() => {
      ElMessage.success("更新成功");
      emit("updated", props.id);
      emit("finished");
      cb(true);
    })
    .catch(() => {
      cb(false);
    });
};
</script>
