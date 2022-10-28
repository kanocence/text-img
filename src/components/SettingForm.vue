<template>
  <div class="setting-form">
    <el-form :model="form" label-width="100px">
      <el-form-item label="文本背景色">
        <el-color-picker v-model="form.backgroundColor" />
      </el-form-item>
      <el-form-item label="字体大小(px)">
        <el-input-number
          v-model="form.fontSize"
          :step="2"
          step-strictly
          :min="8"
          :max="36"
        />
      </el-form-item>
      <el-form-item label="文本">
        <el-input v-model="form.text" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script lang="ts" setup>
import { computed } from 'vue'

const emits = defineEmits(['update:data'])
const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})

const form = computed({
  get() {
    return props.data
  },
  set(val) {
    emits('update:data', val)
  },
})
</script>
<style lang="scss" scoped>
.setting-form {
  width: 400px;
  max-width: 80%;
}
</style>
