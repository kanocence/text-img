<template>
  <el-container>
    <el-main class="layout-main">
      <MainComp />
    </el-main>
    <el-footer class="layout-footer">
      <FooterComp />
    </el-footer>
  </el-container>
</template>
<script lang="ts" setup>
import MainComp from "./components/MainComp.vue";
import FooterComp from "./components/FooterComp.vue";
</script>
<style lang="scss" scoped>
.layout-main {
  min-height: calc(100vh - 120px);
}

.layout-footer {
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
