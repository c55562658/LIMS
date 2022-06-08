<template>
  <div id="dataContainer">
    <div id="dataHead">
      <div class="block">
        <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          format="yyyy-MM-dd HH:mm"
          @change="changeValue1()"
        >
        </el-date-picker>
        <el-button type="primary" icon="el-icon-search" @click="selectData()"
          >搜索</el-button
        >
      </div>
    </div>
    <div id="dataBottom">
      <el-table :data="tableData" style="width: 100%">  
        <el-table-column prop="node" label="节点" width="160">
        </el-table-column>
        <el-table-column prop="mq7Co" label="一氧化碳浓度" width="160">
        </el-table-column>
        <el-table-column prop="mq2Smoke" label="烟雾浓度" width="160">
        </el-table-column>
        <el-table-column prop="temperature" label="温度" width="160">
        </el-table-column>
        <el-table-column prop="warnFlag" label="状态" width="160">
        </el-table-column>
        <el-table-column prop="create" label="记录时间" width="160">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
    export default {
  data() {
    return {
      value1: [],
      tableData: [],
    };
  },
  methods: {
    // 该函数的目的是为了把标准形式的时间转换为距离1970年的秒数
    selectData() {
      let newTableData = [];
      this.tableData.forEach((data) => {
        let time = data.time.split(" ");
        // 年月日
        let ymd = time[0].split("-");
        // 时分秒
        let hms = time[1].split(":");
        let dataTime = new Date(
          ymd[0],
          ymd[1],
          ymd[2],
          hms[0],
          hms[1],
          hms[2]
        ).getTime();
        if (dataTime >= this.value1[0] && dataTime <= this.value1[1]) {
          newTableData.push(data);
    }
      });
        this.tableData = newTableData;
      return this.tableData;
    },
    // 该函数是为了把筛选器返回的标准时间转换成距离1970年的描述
    changeValue1(){
      this.value1[0] = this.value1[0].getTime();
      this.value1[1] = this.value1[1].getTime();
    },
  },
  created() {
    const _this=this
    _this.$axios.get("/zigbee-data/queryAllHistoryData").then((res) => {
      const historyData = res.data.data
      historyData.forEach(data => {
        data.create = data.create.replace('T',' ')
        if (data.warnFlag == 0)
        {
          data.warnFlag = '正常'
        }
        else
        {
          data.warnFlag = '异常'
    }
      });
      _this.tableData = historyData
      var startTime = new Date(historyData[0].create.replace(/-/g,"/"))
      var endTime = new Date(historyData[historyData.length-1].create.replace(/-/g,"/"))
      this.value1[0] = startTime
      this.value1[1] = endTime
    });
  },
};
</script>

<style scoped>
#dataHead {
  margin: 20px 0;
}

#dataContainer {
  margin-left: 10%;
}

.el-button {
  margin-left: 20px;
}
</style>