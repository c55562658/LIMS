<template>
    <div>
        <el-dialog
                title="提示"
                :visible.sync="dialogVisible"
                width="80%"
                height="100%"
            >
        <el-tag type="info">作业数据检测表</el-tag>
        <el-table
                :data="tableSensorData"
                border
                style="font-size: 16px;
                       width: 80%">

            <el-table-column
                    fixed
                    prop="metrics"
                    label="监测指标"
                    width="150">
            </el-table-column>
            <el-table-column
                    prop="threshold"
                    label="阈值上限"
                    width="400">
            </el-table-column>
            <el-table-column
                    prop="firstDetect"
                    label="作业前第一次检测数据"
                    width="200">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.firstDetect" :readonly="true"></el-input>
                </template>
            </el-table-column>

            <el-table-column
                    prop="secondDetect"
                    label="作业前第二次检测数据"
                    width="200">
                <template slot-scope="scope">
                    <el-input v-model="scope.row.secondDetect" :readonly="true"></el-input>
                </template>
            </el-table-column>
        </el-table>



        <el-form label-position="left" ref="form" :model="form"  label-width="150px">

            <el-tag type="info">工作人员资质信息</el-tag>
            <!--            // 作业人员资质信息表格-->
            <el-table
                    :data="tableDataQualificationInformation"
                    border
                    style="font-size: 16px;
                       width: 80%">
                <el-table-column
                        fixed
                        prop="name"
                        label="工作人员姓名"
                        width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.name" type="text" :readonly="true"/>
                    </template>
                </el-table-column>

                <el-table-column
                        fixed
                        prop="number"
                        label="工作人员工号"
                        width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.number" type="text" :readonly="true"/>
                    </template>
                </el-table-column>

                <el-table-column
                        prop="job"
                        label="所属岗位"
                        width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.job" type="text" :readonly="true"/>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="grades"
                        label="考核成绩"
                        width="150">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.grades" type="text" :readonly="true"/>
                    </template>
                </el-table-column>


            </el-table>
            <el-tag type="info">作业方案</el-tag>
            <el-form-item :rules="{
                          required: true, message: '受限空间所在单位不能为空', trigger: 'blur'
            }" label="受限空间所在单位:">
                <el-input v-model="form.unit" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item :rules="{
                          required: true, message: '受限空间作业单位不能为空', trigger: 'blur'
            }" label="受限空间作业单位:">
                <el-input v-model="form.operateUnit" :readonly="true"></el-input>
            </el-form-item>
            <el-form-item :rules="{
                          required: true, message: '作业时间不能为空', trigger: 'blur'
            }"label="作业时间:">
                <el-input v-model="form.date"  :readonly="true" ></el-input>
            </el-form-item>


            <el-form-item
                    v-for="(domain, index) in form.domains"
                    :label="'作业步骤' + index"
                    :key="domain.key"
                    :prop="'domains.' + index + '.value'"
                    :rules="{
      required: true, message: '作业步骤不能为空', trigger: 'blur'
    }"
            >
                <el-input v-model="domain.value" :readonly="true"></el-input>
            </el-form-item>
        </el-form>


        </el-dialog>


    </div>
    
</template>

<script>
    export default {
        name: "QueryTicket",
        data() {
            return {
                //传感器数据
                tableSensorData: [
                    {
                        metrics:"氧气(%)",
                        threshold:"18-23",
                        firstDetect:'',
                        secondDetect:'',
                    },
                    {
                        metrics:"一氧化碳(mg/m3 PC-TWA)",
                        threshold:"20mg/m3 PC-TWA ;30mg/m3 PC-SETL",
                        firstDetect:'',
                        secondDetect:'',
                    },
                    {
                        metrics:"硫化氢(mg/m3)",
                        threshold:"10",
                        firstDetect:"",
                        secondDetect:"",
                    },
                    {
                        metrics:"可燃气体(%)",
                        threshold:"爆炸下限>=4%  浓度<=0.5%\n" +
                            "爆炸下限<4%  浓度<=0.2%",
                        firstDetect:"",
                        secondDetect:"",
                    },
                    {
                        metrics:"心率(bpm)",
                        threshold:"60-180",
                        firstDetect:"",
                        secondDetect:"",
                    },
                    {
                        metrics:"血氧(mmHg)",
                        threshold:"80-100",
                        firstDetect:"",
                        secondDetect:"",
                    },

                ],
                //资质人员表格信息
                tableDataQualificationInformation: [
                    {
                        name:"",
                        number:'',
                        job:"",
                        grades:""
                    }
                ],
                form: {
                    unit:'',
                    operateUnit:'',
                    date:'',
                    domains: [{
                        value: ''
                    }],
                },
                iframeVue:null,
                dialogVisible:false,

            }},

        created() {
            console.log("查询作业票单号对应的作业票")

        },

        methods:
        {
            async init(data)
            {
                const _this=this
                this.dialogVisible=true
                console.log(data)
                var qs = require('qs');

                //调用后端接口去填充数据了 根据作业票单号
                this.$axios.post("/job-tickets-sensors/querySensorDataByTN",
                    qs.stringify({ticketsNumber:data})).then(
                    res=>{
                        console.log(res)
                        let record =res.data.data
                        let sensorDataFromApi=[
                            {
                                metrics:"氧气(%)",
                                threshold:"18-23",
                                firstDetect:record. o2First,
                                secondDetect:record. o2Second,
                            },
                            {
                                metrics:"一氧化碳(mg/m3 PC-TWA)",
                                threshold:"20mg/m3 PC-TWA ;30mg/m3 PC-SETL",
                                firstDetect:record.coFirst,
                                secondDetect:record.coSecond,
                            },
                            {
                                metrics:"硫化氢(mg/m3)",
                                threshold:"10",
                                firstDetect:record.h2sFirst,
                                secondDetect:record.h2sSecond,
                            },
                            {
                                metrics:"可燃气体(%)",
                                threshold:"爆炸下限>=4%  浓度<=0.5%\n" +
                                    "爆炸下限<4%  浓度<=0.2%",
                                firstDetect:record. combustibleGasFirst,
                                secondDetect:record. combustibleGasSecond,
                            },
                            {
                                metrics:"心率(bpm)",
                                threshold:"60-180",
                                firstDetect:record.heartRateFirst,
                                secondDetect:record.heartRateSecond,
                            },
                            {
                                metrics:"血氧(mmHg)",
                                threshold:"80-100",
                                firstDetect:record.bloodOxygenFirst,
                                secondDetect:record.bloodOxygenSecond,
                            },
                        ]
                        this.tableSensorData=sensorDataFromApi

                    }
                )

                //调用后端接口 查询作业人员
                // 根据作业票单号查询到作业人员
                await  this.$axios.post("/job-tickets-operators/queryOperatorsDataByTN",
                    qs.stringify({ticketsNumber:"3"})).then(res=>{
                    let record=res.data.data
                    let operatorsFromApi=[]
                    for (let i=0;i<record.length;i++)
                    {
                        let obj={
                            name:record[i].operatorName,
                            number:record[i].operatorId,
                            grades:'',
                            job:''
                        }
                        operatorsFromApi.push(obj)
                    }
                    this.tableDataQualificationInformation=operatorsFromApi
                })

                //根绝作业人的工号询到作业人员的分数和岗位
                var operatorsNumber=[]
                for (let i=0;i<this.tableDataQualificationInformation.length;i++)
                {
                    let obj={
                        number:this.tableDataQualificationInformation[i].number
                    }
                    operatorsNumber.push(obj)
                }
                this.$axios.post("/personnel-database/queryOperators",
                    operatorsNumber
                )
                    .then(res => {
                        let record=res.data.data
                        for(let i=0;i<record.length ;i++)
                        {
                            this.tableDataQualificationInformation[i].grades=record[i].grades
                            this.tableDataQualificationInformation[i].job=record[i].jobType
                        }
                    })


                // 根据作业票 查询作业方案
                _this.$axios.post("/job-tickets-scheme/querySchemeByTN",
                    qs.stringify({ticketsNumber:data})
                )
                    .then(res => {
                        let record=res.data.data

                        _this.form.unit=record.lsLocationCompany
                        _this.form.operateUnit=record.lsImplementCompany
                        _this.form.date=record.lsOperatorTime

                        let arr=record.steps.split(",")
                        let domain=[]
                        for(let i=0;i<arr.length;i++)
                        {
                            let obj={value:arr[i]}
                            domain.push(obj)
                        }
                        _this.form.domains=domain


                    })



            },

        }


    }
</script>

<style scoped>

</style>