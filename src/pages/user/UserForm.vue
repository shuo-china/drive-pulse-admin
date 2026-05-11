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
        v-model:file-list="formData.avatar" :show-tip="false" />
    </el-form-item>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-form-item label="结余初始值" prop="initial_balance">
          <el-input-number v-model="formData.initial_balance" :precision="0" :step="1" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="结余下限" prop="min_balance">
          <el-input-number v-model="formData.min_balance" :precision="0" :step="1" />
        </el-form-item>
      </el-col>
    </el-row>
    <el-row :gutter="12">
      <el-col :span="12">
        <el-form-item label="是否隐藏" prop="is_hidden">
          <el-switch v-model="formData.is_hidden" :active-value="1" :inactive-value="0" active-text="隐藏"
            inactive-text="显示" inline-prompt />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="状态" prop="status">
          <el-switch v-model="formData.status" :active-value="1" :inactive-value="0" active-text="正常" inactive-text="禁用"
            inline-prompt />
        </el-form-item>
      </el-col>
    </el-row>
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
  initial_balance: 0,
  min_balance: 0,
  is_hidden: 0,
  status: 1,
});

const rules: FormRules = {
  uid: [{ required: true, message: "请输入编号" }],
  nickname: [{ required: true, message: "请输入昵称" }],
  initial_balance: [{ required: true, message: "请输入结余初始值" }],
  min_balance: [{ required: true, message: "请输入结余下限" }],
};

const getDetailInfo = async (id: number) =>
  getUserDetailApi(id).then((res) => ({
    uid: res.uid,
    nickname: res.nickname,
    avatar_key: res.avatar_key,
    avatar: res.avatar,
    min_balance: res.min_balance,
    initial_balance: res.initial_balance,
    is_hidden: res.is_hidden,
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
