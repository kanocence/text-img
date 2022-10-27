<template>
  <div class="footer">
    <el-divider>
      <el-icon class="footer-start"><star-filled /></el-icon>
    </el-divider>
    <div class="footer-desc">
      <div>Made with ❤️ by</div>
      <el-link
        href="https://github.com/kanocence"
        target="_blank"
        type="primary"
      >
        kanocence<el-icon><Link /></el-icon>
      </el-link>
      <el-divider direction="vertical" />
      <el-link
        href="https://github.com/kanocence/text-img"
        target="_blank"
        type="primary"
      >
        GitHub<el-icon><Link /></el-icon>
      </el-link>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { StarFilled, Link } from "@element-plus/icons-vue";
</script>
<style lang="scss" scoped>
.footer {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--el-text-color-regular);

  &-start {
    color: #f7ba2a;
  }

  &-desc {
    font-size: 14px;
    display: flex;
    > div {
      margin-right: 5px;
    }
  }
}
</style>
