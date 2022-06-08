<template>
  <div>
    <el-dropdown split-button type="primary">
      <span class="el-dropdown-link">
        传感器节点选择
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>传感器1</el-dropdown-item>
          <el-dropdown-item>传感器2</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <div class="chartContaniner">
      <div>
        <el-alert
          title="一氧化碳数据异常"
          type="warning"
          :description="this.coWarning"
          show-icon
          center
          v-if="isCoDanger"
        >
        </el-alert>
        <div class="echcart" id="CoChart"></div>
      </div>
      <div>
        <el-alert
          title="烟雾数据异常"
          type="warning"
          :description="this.smogWarning"
          show-icon
          center
          v-if="isSmogDanger"
        >
        </el-alert>
        <div class="echcart" id="SmogChart"></div>
      </div>
      <div>
        <el-alert
          title="温度数据异常"
          type="warning"
          :description="this.temperatureWarning"
          show-icon
          center
          v-if="isTemperatureDanger"
        >
        </el-alert>
        <div class="echcart" id="temperatureChart"></div>
      </div>
    </div>
  </div>
</template>

<script>
var echart = require("echarts");
    export default {
  data() {
    return {
      // 思考：此处判断数据是否异常的指标是否可以整合为一个对象？
      // 判断三个数据是否异常的布尔值
      isCoDanger: false,
      isSmogDanger: false,
      isTemperatureDanger: false,
      // 记录三种异常的信息
      coWarning: null,
      smogWarning: null,
      temperatureWarning: null,
      // 记录异常的数据值大小
      coWarningData: [],
      smogWarningData: [],
      temperatureWarningData: [],
      // 记录异常的数据时间
      coWarningTime: [],
      smogWarningTime: [],
      temperatureWarningTime: [],
      // 记录三张表
      chartInstance: [],
      // 后端返回的所有数据
      allData: null,
      // 一氧化碳数据
      coData: null,
      // 烟雾浓度数据
      smogData: null,
      // 温度数据
      temperatureData: null,
      // 图表横坐标时间数据
      xTime: null,
      // 今天的日期
      todayDate: null,
      // 定时发送数据的定时器
      timerId: null,
      // 图表中被标记的点的数据
      coMarkPointData:[
         {
          name: "",
          xAxis: "",
          yAxis: "",
          value: "",
  },
      ],
      smogMarkPointData:[
         {
          name: "",
          xAxis: "",
          yAxis: "",
          value: "",
        },
      ],
      temperatureMarkPointData:[
         {
          name: "",
          xAxis: "",
          yAxis: "",
          value: "",
        },
      ],
    };
      },
      mounted() {
    this.initChart();
    this.getData();
    this.startInterval();
  },
  destroyed() {
    clearInterval(this.timerId);
  },
  methods: {
    initChart() {
      // 操作DOM选取图表所在的DIV
      var coChart = echart.init(document.getElementById("CoChart"));
      var smogChart = echart.init(document.getElementById("SmogChart"));
      var temperatureChart = echart.init(
        document.getElementById("temperatureChart")
      );
      // 选取Echarts的实例对象
      this.chartInstance.push(coChart, smogChart, temperatureChart);
      // 给一个当鼠标移动到图表身上时，数据暂停，鼠标移过图表时，图表继续读取数据的功能
      for (let i = 0; i < this.chartInstance.length; i++) {
        this.chartInstance[i].on("mouseover", () => {
          clearInterval(this.timerId);
        });
        this.chartInstance[i].on("mouseout", () => {
          this.startInterval();
        });
      }
    },
    // 从后端获取数据的函数
    async getData() {
      const _this = this;
      const { data: res } = await _this.$axios.get(
        "/zigbee-data/queryAllHistoryData"
      );
      // 筛选出节点1的数据
      this.allData = res.data.filter((x) => x.node == "E1");
      // 解决后端数据传输过来的时间格式上面的问题
      this.allData.forEach((data) => {
        data.create = data.create.replace("T", " ");
      });
      // 对一氧化碳,烟雾，温度的数据是否异常进行判断
      this.judgeWraning();
      this.coData = this.allData.map((x) => {
        return x.mq7Co;
      });
      this.temperatureData = this.allData.map((x) => {
        return x.temperature;
      });
      this.smogData = this.allData.map((x) => {
        return x.mq2Smoke;
      });
      // 获取x轴的数据
      this.xTime = this.allData.map((x) => {
        return x.create.substring(10);
      });
      // 从后端获取当天日期
      this.todayDate = this.allData[this.allData.length - 1].create.substring(
        0,
        11
      );
      // 初始化图表标记点的数据
      this.initMarkPointData();
      // 更新图表数据
      this.updateChart();
    },
    updateChart() {
      // 对一氧化碳图标进行配置
      this.chartInstance[0].setOption({
        legend: {
          orient: "vertical",
          x: "right", //可设定图例在左、右、居中
          y: "top", //可设定图例在上、下、居中
          padding: [0, 50, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          data: ["一氧化碳浓度"],
        },
        title: {
          text: this.todayDate + "一氧化碳传感器数据",
        },
        xAxis: {
          type: "category",
          data: this.xTime,
        },
        yAxis: {
          type: "value",
          min: 0,
          max: function (value) {
            return value.max + 15;
          },
        },
        series: [
          {
            name: "一氧化碳浓度",
            data: this.coData,
            type: "line",
            markPoint: {
              data: this.coMarkPointData,
            },
            label:{
              show: true,
            },
            areaStyle: {},
          },
        ],
        dataZoom: [
          {
            type: "slider",
            startValue: this.xTime.length - 21,
            endValue: this.xTime.length - 1,
          },
          {
            type: "inside",
          },
        ],
      });
      // 对烟雾数据进行配置
      this.chartInstance[1].setOption({
           legend: {
          orient: "vertical",
          x: "right", //可设定图例在左、右、居中
          y: "top", //可设定图例在上、下、居中
          padding: [0, 50, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          data: ["烟雾浓度"],
        },
        title: {
          text: this.todayDate + "烟雾传感器数据",
        },
        xAxis: {
          type: "category",
          data: this.xTime,
        },
        yAxis: {
          type: "value",
          min: 0,
          max: function (value) {
            return value.max + 20;
          },
        },
        series: [
          {
            name: "烟雾浓度",
            data: this.smogData,
            type: "line",
             markPoint: {
              data: this.smogMarkPointData,
            },
            label:{
              show: true,
            },
            areaStyle: {},
          },
        ],
        dataZoom: [
          {
            type: "slider",
            startValue: this.xTime.length - 21,
            endValue: this.xTime.length - 1,
          },
          {
            type: "inside",
          },
        ],
      });
      this.chartInstance[2].setOption({
          legend: {
          orient: "vertical",
          x: "right", //可设定图例在左、右、居中
          y: "top", //可设定图例在上、下、居中
          padding: [0, 50, 0, 0], //可设定图例[距上方距离，距右方距离，距下方距离，距左方距离]
          data: ["温度"],
          },
        title: {
          text: this.todayDate + "温度传感器数据",
        },
        xAxis: {
          type: "category",
          data: this.xTime,
        },
        yAxis: {
          type: "value",
          min: 0,
          max: function (value) {
            return value.max + 15;
          },
        },
        series: [
          {
            name: "温度",
            data: this.temperatureData,
            type: "line",
            markPoint: {
              data: this.temperatureMarkPointData,
            },
            label:{
              show: true,
            },
            areaStyle: {},
          },
        ],
        dataZoom: [
          {
            type: "slider",
            startValue: this.xTime.length - 21,
            endValue: this.xTime.length - 1,
          },
          {
            type: "inside",
          },
        ],
      });
    },
    // 判断各项数据是否超过阈值的函数
    judgeWraning() {
      this.allData.forEach((data) => {
        if (data.mq7Co > 100) {
          this.isCoDanger = true;
          this.coWarningData.push(data.mq7Co)
          this.coWarningTime.push(data.create.substring(10))
          this.coWarning =
            "在" +
            this.coWarningTime[this.coWarningTime.length-1] +
            "时刻一氧化碳数据出现异常，该异常值大小为" +
            this.coWarningData[this.coWarningData.length-1];
        }
        if (data.mq2Smoke > 100) {
          this.isSmogDanger = true;
          this.smogWarningData.push(data.mq2Smoke);
          this.smogWarningTime.push(data.create.substring(10));
          this.smogWarning =
            "在" +
            this.smogWarningTime[this.smogWarningTime.length-1] +
            "时刻烟雾数据出现异常，该异常值大小为" +
            this.smogWarningData[this.smogWarningData.length-1];
        }
        if (data.temperature > 55) {
          this.isTemperatureDanger = true;
          this.temperatureWarningData.push(data.temperature);
          this.temperatureWarningTime.push(data.create.substring(10));
          this.temperatureWarning =
            "在" +
            this.temperatureWarningTime[
              this.temperatureWarningTime.length - 1
            ] +
            "时刻温度数据出现异常，该异常值大小为" +
            this.temperatureWarningData[this.temperatureWarningData.length-1];
        }
      });
    },
    initMarkPointData(){
      for(let i=0;i<this.coWarningData.length;i++)
      {
        this.coMarkPointData.push({
        name : "数据异常",
        xAxis : this.coWarningTime[i],
        yAxis : this.coWarningData[i],
        value : this.coWarningData[i],
        })
      }
      for(let i=0;i<this.smogWarningData.length;i++)
      {
        this.smogMarkPointData.push({
        name : "数据异常",
        xAxis : this.smogWarningTime[i],
        yAxis : this.smogWarningData[i],
        value : this.smogWarningData[i],
        })
      }
      for(let i=0;i<this.temperatureWarningData.length;i++)
      {
        this.temperatureMarkPointData.push({
        name : "数据异常",
        xAxis : this.temperatureWarningTime[i],
        yAxis : this.temperatureWarningData[i],
        value : this.temperatureWarningData[i],
        })
      }
    },
    startInterval() {
      // 如果在开启之前计时器已经存在，则清除计时器
      if (this.timerId) {
        clearInterval(this.timerId);
    }
      // 每隔一秒，数据更新一次
      this.timerId = setInterval(() => {
        this.getData();
        this.updateChart();
      }, 3000);
    },
  },
};
</script>

<style scoped>
.chartContaniner {
  display: flex;
  flex-wrap: wrap;
  margin-left: 200px;
}
.example-showcase .el-dropdown-link {
  cursor: pointer;
  color: var(--el-color-primary);
  display: flex;
  align-items: center;
}
#CoChart {
  width: 600px;
  height: 400px;
}
#SmogChart {
  width: 600px;
  height: 400px;
}
#temperatureChart {
  width: 600px;
  height: 400px;
}
.el-dropdown {
  margin-left: 20px;
  margin-top: 20px;
}
</style>