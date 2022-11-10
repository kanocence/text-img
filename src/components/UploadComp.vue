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
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage, genFileId } from 'element-plus'
import { UploadFilled } from '@element-plus/icons-vue'

import type {
  UploadFile,
  UploadProps,
  UploadInstance,
  UploadRawFile,
} from 'element-plus'

const emits = defineEmits(['upload'])

const upload = ref<UploadInstance>()
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const fileList = ref<UploadFile[]>([])

const handlePictureCardPreview: UploadProps['onPreview'] = (uploadFile) => {
  dialogImageUrl.value = uploadFile.url!
  dialogVisible.value = true
}

const handleExceed: UploadProps['onExceed'] = (files) => {
  upload.value!.clearFiles()
  const file = files[0] as UploadRawFile
  file.uid = genFileId()
  upload.value!.handleStart(file)
}

const flieType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
const handleChange: UploadProps['onChange'] = (file, fileList) => {
  if (!(file.raw && flieType.includes(file.raw.type))) {
    fileList.splice(fileList.indexOf(file), 1)
    ElMessage.error('Please upload image file!')
  }
  if (file.raw) {
    emits('upload', file.raw)
  }
}
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
