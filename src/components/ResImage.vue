<template>
  <el-card class="box-card" v-show="data.length">
    <template #header>
      <el-button type="primary" @click="handleDownload">
        download<el-icon class="el-icon--right"><Download /></el-icon>
      </el-button>
    </template>

    <div
      class="res-image-preview"
      :style="{ backgroundColor: setting.backgroundColor }"
    >
      <div v-for="(row, i) in data" :key="i" class="res-image-preview-row">
        <div
          v-for="(color, j) in row"
          :key="j"
          class="res-image-preview-cell"
          :style="{
            color: color,
            width: setting.fontSize + 'px',
            height: setting.fontSize + 'px',
            fontSize: setting.fontSize + 'px',
          }"
        >
          {{ getLabel(i, j) }}
        </div>
      </div>
    </div>
  </el-card>
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { Download } from "@element-plus/icons-vue";

const props = defineProps({
  data: {
    type: Array<string[]>,
    default: () => [],
  },
  setting: {
    type: Object,
    default: () => ({}),
  },
});

const textLen = computed(() => props.setting.text.length);
const getLabel = (row: number, col: number) => {
  return props.setting.text[(row * textLen.value + col) % textLen.value];
};

const handleDownload = () => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d")!;
  const scale = window.devicePixelRatio;
  ctx.scale(scale, scale);
  // 设置显示尺寸(css px)
  canvas.style.width = `${props.data[0].length * props.setting.fontSize}px`;
  canvas.style.height = `${props.data.length * props.setting.fontSize}px`;
  // 设置画布尺寸(真实像素)
  canvas.width = props.data[0].length * props.setting.fontSize * scale;
  canvas.height = props.data.length * props.setting.fontSize * scale;

  const { fontSize, backgroundColor } = props.setting;
  const width = props.data[0].length * fontSize;
  const height = props.data.length * fontSize;
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);
  ctx.fillStyle = "#000";
  ctx.font = `${fontSize}px Arial`;
  props.data.forEach((row, i) => {
    row.forEach((color, j) => {
      ctx.fillStyle = color;
      ctx.fillText(getLabel(i, j), j * fontSize, (i + 1) * fontSize);
    });
  });
  const url = canvas.toDataURL("image/png");
  const a = document.createElement("a");
  a.href = url;
  a.download = "res.png";
  a.click();
};
</script>
<style lang="scss" scoped>
.res-image {
  &-preview {
    padding: 10px;
    display: flex;
    flex-direction: column;
    overflow: auto;

    &-row {
      display: flex;
      flex-direction: row;
      align-items: center;
    }

    &-cell {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
}
</style>
