<template>
  <page>

    <el-form ref="formRef" :model="formData" :rules="rules" label-width="80px" v-loading="loading">
      <el-form-item label="标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入标题" />
      </el-form-item>
      <el-form-item label="内容" prop="content">
        <el-input v-model="formData.content" type="textarea" :rows="10" placeholder="请输入内容" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          提交保存
        </el-button>
      </el-form-item>
    </el-form>

  </page>
</template>

<script setup lang="ts">
import { getNoticeDetailApi, updateNoticeApi } from '@/api/notice';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const formRef = ref<FormInstance>();
const loading = ref(false);
const submitting = ref(false);

const formData = ref({
  title: '',
  content: '',
});

const rules: FormRules = {
  title: [{ required: true, message: '请输入标题', trigger: 'blur' }],
  content: [{ required: true, message: '请输入内容', trigger: 'blur' }],
};

const fetchNotice = async () => {
  loading.value = true;
  try {
    const res = await getNoticeDetailApi();
    if (res) {
      formData.value.title = res.title || '';
      formData.value.content = res.content || '';
    }
  } catch (error) {
    console.error('获取信息失败', error);
  } finally {
    loading.value = false;
  }
};

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid) => {
    if (valid) {
      submitting.value = true;
      try {
        await updateNoticeApi(formData.value);
        ElMessage.success('保存成功');
      } catch (error) {
        console.error('保存失败', error);
      } finally {
        submitting.value = false;
      }
    }
  });
};

onMounted(() => {
  fetchNotice();
});
</script>
