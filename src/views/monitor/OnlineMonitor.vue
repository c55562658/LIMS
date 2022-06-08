<template>
    <div>
    <el-table :data="tableData" stripe style="width: 100%;padding:60px">
      <el-table-column prop="number" label="编号" width="480"/>
      <el-table-column prop="name" label="节点名称" width="640" />
      <el-table-column>
          <router-link to="/monitor/onlineData"><el-button type="primary" size = "small">查看</el-button></router-link>
      </el-table-column>
    </el-table>
    </div>
</template>

<script>
    export default {
  name: "OnlineMonitor",
  data() {
    return {
      tableData: [
        {
          number: "1",
          name: "传感器1",
        },
        {
          number: "2",
          name: "传感器2",
        },
      ],
    };
  },
};
</script>

<style scoped>

</style>