<template>
  <el-dropdown-item v-if="_isDropdown">
    <slot />
  </el-dropdown-item>
  <slot v-else />
</template>

<script setup lang="ts">
defineOptions({
  name: "ActionItem",
});

defineProps({
  _isDropdown: { type: Boolean, default: false },
});
</script>
