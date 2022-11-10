<template>
  <div>
    <h2>选择图片</h2>
    <UploadComp @upload="handleUpload" />
    <h2>设置参数</h2>
    <SettingForm v-model:data="form" />
    <h2 v-loading="loading">预览&下载</h2>
    <ResImage :data="textColor" :setting="form" />
    <!-- canvas -->
    <canvas v-show="false" ref="canvas"></canvas>
  </div>
</template>
<script lang="ts" setup>
import UploadComp from './UploadComp.vue'
import SettingForm from './SettingForm.vue'
import ResImage from './ResImage.vue'
import { reactive, ref } from 'vue'
import { UploadRawFile, ElMessage } from 'element-plus'
import { gaussianBlur, getTextColor } from '../utils/helper'
import { useWebWorkerFn } from '@vueuse/core'

const textColor = ref<string[][]>([])
const form = reactive({
  text: '你先别急',
  fontSize: 12,
  backgroundColor: '#212529',
})
const loading = ref(false)

const img = new Image()
const canvas = ref<HTMLCanvasElement | null>(null)
const ctx = ref<CanvasRenderingContext2D | null>(null)
const imageData = ref<ImageData | null>(null)

const { workerFn } = useWebWorkerFn(gaussianBlur)
const { workerFn: workerFn2 } = useWebWorkerFn(getTextColor)

const handleUpload = (file: UploadRawFile) => {
  loading.value = true
  img.src = URL.createObjectURL(file)
  img.onload = async () => {
    try {
      canvas.value = document.createElement('canvas')
      canvas.value.width = img.width
      canvas.value.height = img.height
      ctx.value = canvas.value.getContext('2d')!
      ctx.value.drawImage(img, 0, 0)
      imageData.value = ctx.value.getImageData(0, 0, img.width, img.height)

      const start = Date.now()
      const data = await workerFn(imageData.value, 5)
      console.log('gaussian blur cost: ', Date.now() - start)
      textColor.value = await workerFn2(data, form.fontSize)
      console.log('calc total cost: ', Date.now() - start)
    } catch (e) {
      console.log(e)
      ElMessage.error(`Error: ${e}`)
    } finally {
      loading.value = false
    }
  }
}
</script>
<style lang="scss" scoped>
h2 {
  margin: 20px 0;
  color: var(--el-text-color-regular);
}
</style>
