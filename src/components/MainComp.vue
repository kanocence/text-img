<template>
  <div>
    <h2>上传图片</h2>
    <UploadComp @upload="handleUpload" />
    <h2>设置参数</h2>
    <SettingForm v-model:data="form" />
    <h2>结果下载</h2>
    <ResImage :data="textColor" :setting="form" />
  </div>
</template>
<script lang="ts" setup>
import UploadComp from "./UploadComp.vue";
import SettingForm from "./SettingForm.vue";
import ResImage from "./ResImage.vue";
import { reactive, ref } from "vue";
import { getTextColor } from "../utils/helper";

const textColor = ref<string[][]>([]);
const form = reactive({
  text: "你先别急",
  fontSize: 12,
  backgroundColor: "#212529",
});

const handleUpload = (data: ImageData) => {
  textColor.value = getTextColor(data, form.fontSize);
};
</script>
<style lang="scss" scoped>
h2 {
  margin: 20px 0;
  color: var(--el-text-color-regular);
}
</style>
