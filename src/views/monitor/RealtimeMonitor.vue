<template>
    <!-- 最外层的盒子，布置浮动布局，排列方式改为垂直分布即可 -->
    <div class="contaniner">
        <div class="monitorData">
            <h3>监测数据</h3>
            <div class="chartContaniner">
                <div id="oxygenChart"></div>
                <div id="coChart"></div>
                <div id="h2sChart"></div>
                <div id="combustibleGasesChart"></div>
                <div id="heartBeatChart"></div>
                <div id="bloodOxygenChart"></div>
            </div>
        </div>
        <div class="monitorProcess">
            <h3>流程监控</h3>
            <el-table :data="monitorProcessData" stripe style="width: 100%">
                <el-table-column prop="monitorProcessName" label="事件名称" width="360" />
                <el-table-column prop="monitorProcessStatus" label="事件状态">
                    <!-- 如果要在ELEMENTUI中使用V-IF判断则需要使用如下的模板 -->
                    <template slot-scope="scope">
                        <div class="flex flex-wrap gap-2 my-2" v-if="scope.row.monitorProcessStatus == '已完成'">
                            <el-tag type="success" class="mx-1" effect="dark" round>
                                已完成
                            </el-tag>
                        </div>
                        <div class="flex flex-wrap gap-2 my-2" v-if="scope.row.monitorProcessStatus == '进行中'">
                            <el-tag type="" class="mx-1" effect="dark" round>
                                进行中
                            </el-tag>
                        </div>
                        <div class="flex flex-wrap gap-2 my-2" v-if="scope.row.monitorProcessStatus == '未完成'">
                            <el-tag type="info" class="mx-1" effect="dark" round>
                                未完成
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="monitorScreen">
            <h3>监测画面：暂时先调用电脑摄像头</h3>
            <!-- 达到展示效果，后期进一步开发需要用到摄像头（海康摄像头有现成的接口可以调用） -->
           <video id="v"></video>
            <el-button  type="primary" @click="closeCamera">关闭摄像头</el-button>
        </div>
        <div class="alarmEvent">
            <h3>报警事件</h3>
<!--            <el-alert title="触发了报警事件2:作业人员未佩戴安全绳" type="warning" effect="dark">-->
<!--            </el-alert>-->
            <el-table :data="alarmEventData" stripe style="width: 100%">
                <el-table-column prop="alarmEventName" label="事件名称" width="180" />
                <el-table-column prop="alarmEventTime" label="报警时间" width="160" />
                <el-table-column prop="resolveTime" label="解决时间" width="160" />
                <el-table-column prop="alarmEventStatus" label="事件状态">
                    <template slot-scope="scope" width="100">
                        <div class="flex flex-wrap gap-2 my-2" v-if="scope.row.alarmEventStatus == '已解决'">
                            <el-tag type="success" class="mx-1" effect="dark" round>
                                已解决
                            </el-tag>
                        </div>
                        <div class="flex flex-wrap gap-2 my-2" v-if="scope.row.alarmEventStatus == '进行中'">
                            <el-tag type="" class="mx-1" effect="dark" round>
                                进行中
                            </el-tag>
                        </div>
                        <div class="flex flex-wrap gap-2 my-2" v-if="scope.row.alarmEventStatus == '未解决'">
                            <el-tag type="danger" class="mx-1" effect="dark" round>
                                未解决
                            </el-tag>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="statusUpdate" label="事件处理" width="160" >
                    <template slot-scope="scope">
                        <el-button type="success" @click="solveEvent(scope.$index,scope.row)">处理完毕</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
    import {dateUtil} from "@/utils/DateUtil"
    var echart = require("echarts");
    export default {
        name: "RealtimeMonitor",
        data() {
            return {

                timer:null,//报警器
                realTimeSensorData:null,
                // 报警事件相关数据
                alarmEventData: [
                    // {
                    //     alarmEventName: "",
                    //     alarmEventTime:"",
                    //     resolveTime:"",
                    //     alarmEventStatus: "",
                    //     statusUpdate:"",
                    // }
                ],
                // 流程监控相关数据
                monitorProcessData: [
                    {
                        monitorProcessName: "作业步骤1：作业前两次检测气体浓度值达标",
                        monitorProcessStatus: "已完成",
                    },
                    {
                        monitorProcessName: "作业步骤2：作业人员正确佩戴防护用具",
                        monitorProcessStatus: "已完成",
                    },
                    {
                        monitorProcessName: "作业步骤3：作业人员作业",
                        monitorProcessStatus: "进行中",
                    },
                    {
                        monitorProcessName: "作业步骤4：完成作业撤离现场",
                        monitorProcessStatus: "未完成",
                    }
                ],
                chartInstance: [],
                gaugeData: [
                    {
                        min:15,
                        max:25,
                        splitNumber:5,
                        data:[
                            {value: 0,name: "氧气",}
                        ],
                        formatter: '{value}%',
                        color:[[0.3, '#FF3030'], [0.8, '#00CD66'], [1, '#FF3030']]

                    },
                    {
                        min:0,
                        max:30,
                        splitNumber:5,
                        data:[
                            {value: 0,name: "一氧化碳",}
                        ],
                        formatter: '{value}mg/m3',
                        color:[[0.33, '#00CD66'], [0.67, '#EEC900'], [1, '#FF3030']]
                    },
                    {
                        min:0,
                        max:20,
                        splitNumber:5,
                        data:[
                            {value: 0,name: "硫化氢",}
                        ],
                        formatter: '{value}mg/m3',
                        color:[[0.25, '#00CD66'], [0.5, '#EEC900'], [1, '#FF3030']]
                    },
                    {
                        min:0,
                        max:0.5,
                        splitNumber:5,
                        name: "可燃气体",
                        data:[
                            {value: 0, name: "可燃气体",}
                        ],
                        formatter: '{value}%',
                        color:[[0.2, '#00CD66'], [0.4, '#EEC900'], [1, '#FF3030']]
                    },
                    {
                        min:0,
                        max:200,
                        splitNumber:5,
                        data:[
                            {value: 0,name: "心率",}
                        ],
                        formatter: '{value}bpm',
                        color:[[0.3, '#FF3030'], [0.6, '#00CD66'],[0.9, '#EEC900'], [1, '#FF3030']]
                    },
                    {
                        min:90,
                        max:100,
                        splitNumber:5,
                        data:[
                            {value: 0, name: "血氧",}
                        ],
                        formatter: '{value}%',
                        color:[[0.5, '#FF3030'], [1, '#00CD66']]
                    },
                ],
            };
        },
        mounted() {
            this.initChart();
            // 每次进入界面时，先清除之前的所有定时器，然后启动新的定时器
            clearInterval(this.timer)
            this.timer = null
            this.timer = window.setInterval( () => {
                this.getData()
            }, 1000)
        },

        beforeDestroy: function () {
            // 每次离开当前界面时，清除定时器
            window.clearInterval(this.timer)
            this.timer = null
        },
        methods: {
            // 用来给表格设置一些通用选项的函数，减少代码的冗余,其中第一个参数是表格对象，第二个参数是对应的数据
            setChart(instance, dataSource) {
                instance.setOption({
                    series: [
                        {
                            name:dataSource.name,
                            type: "gauge",
                            startAngle: 225,
                            endAngle: -45,
                            min:dataSource.min,
                            max:dataSource.max,
                            splitNumber:dataSource.splitNumber,
                            pointer: {
                                show: true,
                            },
                            progress: {
                                show: false,
                                overlap: false,
                                roundCap: true,
                                clip: false,
                                itemStyle: {
                                    borderWidth: 1,
                                    borderColor: "#464646",
                                },
                            },
                            axisLine: {
                                lineStyle: {
                                    // 用来调整线段的粗细
                                    width: 10,
                                    color:dataSource.color,
                                },
                            },
                            splitLine: {
                                show: false,
                                distance: 0,
                                length: 10,
                            },
                            axisTick: {
                                show: false,
                                distance:5,
                            },
                            axisLabel: {
                                // show: true,
                                distance: 3,
                                length: 14,
                                lineStyle: {
                                    width: 3,
                                    color: '#999'
                                }
                            },
                            data: dataSource.data,
                            title: {
                                fontSize: 14,
                                offsetCenter: ["0%", "80%"],
                            },
                            detail: {
                                width: 70,
                                height: 14,
                                fontSize: 14,
                                color: "auto",
                                borderColor: "auto",
                                borderRadius: 20,
                                borderWidth: 1,
                                formatter:dataSource.formatter,
                                valueAnimation: true,
                                offsetCenter: ["0%", "30%"],
                            },
                        },
                    ],
                },true);
            },
            initChart() {
                //   选中氧气表格
                var oxygenChart = echart.init(document.getElementById("oxygenChart"));
                var coChart = echart.init(document.getElementById("coChart"));
                var h2sChart = echart.init(document.getElementById("h2sChart"));
                var combustibleGasesChart = echart.init(document.getElementById("combustibleGasesChart"));
                var heartBeatChart = echart.init(document.getElementById("heartBeatChart"));
                var bloodOxygenChart = echart.init(document.getElementById("bloodOxygenChart"));
                this.chartInstance.push(oxygenChart, coChart, h2sChart, combustibleGasesChart, heartBeatChart, bloodOxygenChart);
                for (let i = 0; i < this.chartInstance.length; i++) {
                     this.setChart(this.chartInstance[i], this.gaugeData[i]);
                }
            },
            getData() {
                //获得实时数据 跟新数据
                const _this=this
                _this.$axios.post("/sensors-data/getRealtimeSensorsData").then(res=>{
                    let record=res.data.data
                    //判断数据是否更新 如果没有更新就不更新图表
                    if(sessionStorage.getItem('realTimeSensorData')==record.createTime){
                        return
                    }
                    else {
                        //数据是最新的  将最新的赋值
                        sessionStorage.setItem('realTimeSensorData',record.createTime)
                    }

                    _this.gaugeData[0].data[0].value=record.o2.toFixed(2)
                    _this.gaugeData[1].data[0].value=(record.co).toFixed(2)
                    _this.gaugeData[2].data[0].value=(record.h2s).toFixed(2)
                    _this.gaugeData[3].data[0].value=(record.combustibleGas).toFixed(2)
                    _this.gaugeData[4].data[0].value=(record.heartRate).toFixed(2)
                    _this.gaugeData[5].data[0].value=(record.bloodOxygen).toFixed(2)
                    this.updateChart();

                    var alarmRes=this.ifAlarm(record)
                    //同时做出报警判断 是否超过阈值 传入这几个参数
                    if(alarmRes.size!=0){
                        // alarmEventData push 数据 同时向后端插入报警数据
                        let tempAlarmEvent=[]
                        alarmRes.forEach(function(value, key) {
                            console.log(key, value);
                            let each=
                                {
                                    alarmEventName:value,
                                    alarmEventTime:new Date(record.createTime).pattern("yyyy-MM-dd HH:mm:ss"),
                                    resolveTime:"",
                                    alarmEventStatus: "未解决",
                                }
                            tempAlarmEvent.push(each)
                            //向数据库插入数据
                            //插入抱紧事件请求
                            _this.$axios.post("/alarm-events/insertAlarmEvent", {
                                eventDesc: value,
                                alarmTime: new Date(record.createTime).pattern("yyyy-MM-dd HH:mm:ss"),
                                solveTime: null,
                                status: "待解决",
                                ticketsNumber:2,
                            })
                        })
                        _this.alarmEventData=tempAlarmEvent
                    }
                })
            },
            updateChart(newData) {
                for (let i = 0; i < this.chartInstance.length; i++) {
                    this.setChart(this.chartInstance[i], this.gaugeData[i]);
                }
            },
            //关闭摄像头 用来测试吧
            closeCamera(){
                const _this=this
                //插入抱紧事件请求



            },

            //报警判断
            ifAlarm(record){
                var o2=record.o2.toFixed
                var co=(record.co).toFixed(2)
                // var h2s=(record.h2s).toFixed(2)
                var h2s=9.0.toFixed(2)
                // var combustibleGas=(record.combustibleGas).toFixed(2)
                var combustibleGas=(0.2).toFixed(2)
                var heartRate= (record.heartRate).toFixed(2)
                var bloodOxygen=(record.bloodOxygen).toFixed(2)
                var map=new Map()
                // map.set("createTime",record.createTime)
                if(o2>=23 || o2<=18){
                    map.set("o2","氧气浓度异常:"+o2)
                }
                if (co>=20) {
                    map.set("co","一氧化碳浓度异常:"+co)
                }
                if(h2s>=10){
                    map.set("h2s","硫化氢浓度异常:"+h2s)
                }
                if (combustibleGas>=0.2){
                    map.set("combustibleGas","可燃气体浓度异常:"+combustibleGas)
                }
                if(heartRate<=60 ||heartRate>=180){
                    map.set("heartRate","心率异常:"+heartRate)
                }
                if(bloodOxygen<95){
                    map.set("bloodOxygen","血氧浓度异常:"+bloodOxygen)
                }
                return map
            },
            //处理完毕按钮
            solveEvent(index,row){
                //更改状态
                const _this=this
                console.log(index)
                console.log(row)
                row.alarmEventStatus="已解决"
                row.resolveTime=new Date().pattern("yyyy-MM-dd HH:mm:ss")
                //更新数据库
                _this.$axios.post("/alarm-events/updateAlarmEvent", {
                    alarmTime: new Date(row.alarmEventTime).pattern("yyyy-MM-dd HH:mm:ss"),
                    solveTime:new Date().pattern("yyyy-MM-dd HH:mm:ss"),
                    status: "已解决",
                    ticketsNumber:2,
                })

            }
        },

        //监听数据
        // watch:{
        //     chartInstance:{
        //         handler(newVal){
        //             console.log(1)
        //         },
        //         deep:true
        //     }
        // }
    };
    !(function () {
        // 老的浏览器可能根本没有实现 mediaDevices，所以我们可以先设置一个空的对象
        if (navigator.mediaDevices === undefined) {
            navigator.mediaDevices = {};
        }
        if (navigator.mediaDevices.getUserMedia === undefined) {
            navigator.mediaDevices.getUserMedia = function (constraints) {
                // 首先，如果有getUserMedia的话，就获得它
                var getUserMedia =
                    navigator.webkitGetUserMedia ||
                    navigator.mozGetUserMedia ||
                    navigator.msGetUserMedia;

                // 一些浏览器根本没实现它 - 那么就返回一个error到promise的reject来保持一个统一的接口
                if (!getUserMedia) {
                    return Promise.reject(
                        new Error("getUserMedia is not implemented in this browser")
                    );
                }

                // 否则，为老的navigator.getUserMedia方法包裹一个Promise
                return new Promise(function (resolve, reject) {
                    getUserMedia.call(navigator, constraints, resolve, reject);
                });
            };
        }
        const constraints = {
            video: true,
            audio: false,
        };
        let promise = navigator.mediaDevices.getUserMedia(constraints);
        promise
            .then((stream) => {
                let v = document.getElementById("v");
                // 旧的浏览器可能没有srcObject
                if ("srcObject" in v) {
                    v.srcObject = stream;
                } else {
                    // 防止再新的浏览器里使用它，应为它已经不再支持了
                    v.src = window.URL.createObjectURL(stream);
                }
                v.onloadedmetadata = function (e) {
                    v.play();
                };
            })
            .catch((err) => {
                console.error(err.name + ": " + err.message);
            });
    })();

</script>

<style scoped>
    .monitorData {
        width: 40vw;
        height: 50vh;
    }

    /* 存放监测数据图表的容器 */
    .chartContaniner {
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }

    .chartContaniner div {
        width: 30%;
        height: 200px;
    }

    /* 报警事件的样式 */
    .alarmEvent {
        width: 40vw;
        height: 100px;
    }

    .monitorProcess {
        width: 40vw;
        height: 200px;
    }

    .monitorScreen {
        width: 40vw;
        height: 50vh;
    }

    .contaniner {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        max-width: 100vw;
        max-height: 100vh;
    }


</style>