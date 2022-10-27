<template>
  <div class="upload-comp">
    <el-upload
      action="#"
      ref="upload"
      list-type="picture"
      v-model:file-list="fileList"
      :limit="1"
      :auto-upload="false"
      :on-preview="handlePictureCardPreview"
      :on-change="handleChange"
      :on-exceed="handleExceed"
    >
      <el-button type="primary">
        select file <el-icon class="el-icon--right"><UploadFilled /></el-icon>
      </el-button>
      <template #tip>
        <div class="el-upload__tip">Only one file can be uploaded</div>
      </template>
    </el-upload>
    <!-- preview dialog -->
    <el-dialog v-model="dialogVisible">
      <el-image :src="dialogImageUrl" alt="Preview Image" />
    </el-dialog>
    <!-- canvas -->
    <canvas v-show="false" ref="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import { ref } from "vue";
import { ElMessage, genFileId } from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";
import { gaussianBlur } from "../utils/helper";

import type {
  UploadFile,
  UploadProps,
  UploadInstance,
  UploadRawFile,
} from "element-plus";

const emits = defineEmits(["upload"]);

const upload = ref<UploadInstance>();
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
const fileList = ref<UploadFile[]>([]);
const img = new Image();
const canvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const imageData = ref<ImageData | null>(null);

const handlePictureCardPreview: UploadProps["onPreview"] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = true;
};

const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
};

const flieType = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
const handleChange: UploadProps["onChange"] = (file, fileList) => {
  if (!(file.raw && flieType.includes(file.raw.type))) {
    fileList.splice(fileList.indexOf(file), 1);
    ElMessage.error("Please upload image file!");
  }
  if (file.raw) {
    // 获取图片尺寸
    const reader = new FileReader();
    reader.readAsDataURL(file.raw);
    reader.onload = (e) => {
      if (e.target) {
        img.src = e.target.result as string;
        img.onload = () => {
          const { width, height } = img;
          canvas.value = document.querySelector("canvas");
          ctx.value = canvas.value?.getContext("2d", {
            willReadFrequently: true,
          })!;
          canvas.value?.setAttribute("width", width.toString());
          canvas.value?.setAttribute("height", height.toString());
          ctx.value?.drawImage(img, 0, 0, width, height);
          imageData.value = ctx.value?.getImageData(0, 0, width, height)!;
          emits("upload", gaussianBlur(imageData.value, 2));
          // ctx.value?.putImageData(gaussianBlur(imageData.value, 2), 0, 0);
          ctx.value?.clearRect(0, 0, width, height);
        };
      }
    };
  }
};
</script>
<style lang="scss" scoped>
.upload-comp {
  width: 400px;
  max-width: 80%;

  :deep(.el-dialog__body) {
    text-align: center;
  }
}
</style>
