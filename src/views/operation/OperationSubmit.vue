<template>
    <div>
        <el-form label-position="left" ref="form"  :model="form" label-width="150px">
                <el-tag type="info">作业数据检测表</el-tag>
                <div class="operationDataTestTable">
                <el-table
                        :data="tableSensorData"
                        style="font-size: 16px;
                        width: 90%;"
                       border
                       
                       >

                    <el-table-column
                            fixed
                            prop="metrics"
                            label="监测指标"
                            min-width="25%">
                    </el-table-column>
                    <el-table-column
                            prop="threshold"
                            label="阈值上限"
                            min-width="25%">
                    </el-table-column>
                    <el-table-column
                            prop="firstDetect"
                            label="作业前第一次检测数据"
                            min-width="25%">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.firstDetect"></el-input>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="secondDetect"
                            label="作业前第二次检测数据"
                            min-width="25%">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.secondDetect"></el-input>
                        </template>
                    </el-table-column>
                </el-table>
                </div>


                <el-tag type="info">工作人员资质信息</el-tag>
                <el-button type="primary" size="small" @click="addOperator" class="addButton">添加</el-button>
                <!--            // 作业人员资质信息表格-->
                <div class="workerQualificationTable" >
                <el-table
                        :data="tableDataQualificationInformation"
                        @cell-click="tableDataEdit"
                        style="font-size: 16px;
                       width: 80%">
                    <el-table-column
                            fixed
                            prop="name"
                            label="工作人员姓名"
                            width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.name" type="text"/>
                        </template>
                    </el-table-column>

                    <el-table-column
                            fixed
                            prop="number"
                            label="工作人员工号"
                            width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.number" type="text"/>
                        </template>
                    </el-table-column>

                    <el-table-column
                            prop="job"
                            label="所属岗位"
                            width="150">
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.job" type="text"/>
                        </template>
                    </el-table-column>


                    <el-table-column
                            prop="edit"
                            label="操作">
                        <template slot-scope="scope">
                            <el-button
                                    type="danger"
                                    @click="handleDelete(scope.$index, scope.row)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-tag type="info">作业方案</el-tag>
            <div class="operationPlan">
            <el-form-item
                    prop="unit"
                    :rules="{
                          required: true, message: '受限空间所在单位不能为空', trigger: 'blur'
            }" label="受限空间所在单位:">
                <el-input v-model="form.unit"></el-input>
            </el-form-item>

            <el-form-item
                    prop="operateUnit"
                    :rules="{
                          required: true, message: '受限空间作业单位不能为空', trigger: 'blur'
            }" label="受限空间作业单位:">
                <el-input v-model="form.operateUnit"></el-input>
            </el-form-item>

            <el-form-item
                    prop="date"
                    :rules="{
                          required: true, message: '作业时间不能为空', trigger: 'blur'
            }" label="作业时间:">
                <el-date-picker
                        v-model="form.date"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                </el-date-picker>
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
                <el-input v-model="domain.value"></el-input>
                <el-button @click.prevent="removeDomain(domain)">删除</el-button>
            </el-form-item>

            <el-form-item>
                <el-button @click="addDomain">新增作业步骤</el-button>
                <el-button @click="resetForm('form')">重置</el-button>
                <el-button type="primary" @click="submitForm('form')">提交</el-button>
            </el-form-item>
            </div>
        </el-form>
        

        <el-button type="primary" @click="test()">debug按钮</el-button>

    </div>
</template>

<script>
    import {dateUtil} from "@/utils/DateUtil"

    export default {
        name: "OperationSubmit",
        data() {
            return {
                rules: {
                    name: [
                        { required: true, message: '请输入活动名称', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],

                },

                //传感器数据
                tableSensorData: [
                    {
                        metrics: "氧气(%)",
                        threshold: "18-23",
                        firstDetect: '',
                        secondDetect: '',
                    },
                    {
                        metrics: "一氧化碳(mg/m3 PC-TWA)",
                        threshold: "20mg/m3 PC-TWA ;30mg/m3 PC-SETL",
                        firstDetect: '',
                        secondDetect: '',
                    },
                    {
                        metrics: "硫化氢(mg/m3)",
                        threshold: "10",
                        firstDetect: "",
                        secondDetect: "",
                    },
                    {
                        metrics: "可燃气体(%)",
                        threshold: "爆炸下限>=4%  浓度<=0.5%\n" +
                            "爆炸下限<4%  浓度<=0.2%",
                        firstDetect: "",
                        secondDetect: "",
                    },
                    {
                        metrics: "心率(bpm)",
                        threshold: "60-180",
                        firstDetect: "",
                        secondDetect: "",
                    },
                    {
                        metrics: "血氧(mmHg)",
                        threshold: "80-100",
                        firstDetect: "",
                        secondDetect: "",
                    },

                ],
                //资质人员表格信息
                tableDataQualificationInformation: [
                    {
                        name: "",
                        number: '',
                        job: "",

                    }
                ],
                form: {
                    unit: '',
                    operateUnit: '',
                    date: '',
                    domains: [{
                        value: ''
                    }],
                },

            }
        },
        created() {
            let date = new Date()
        },
        methods: {

            //debug 按钮 触发一些事件用于返回 查看结果
            test() {
                const _this = this
            },
            //判断是否填写了表格数据
            ifFullFill(){
                const _this=this
                for (let i=0;i<_this.tableSensorData.length;i++){
                    if(_this.tableSensorData[i].firstDetect===''||_this.tableSensorData[i].secondDetect==='')
                        return false
                }
                for (let i=0;i<_this.tableDataQualificationInformation.length;i++){
                    if (_this.tableDataQualificationInformation[i].job==""
                        ||_this.tableDataQualificationInformation[i].name==""
                    ||_this.tableDataQualificationInformation[i].number=="")
                        return false
                }
                return true
            },

            //编辑表格
            tableDataEdit(row, column, cell, event) {
                const _this = this
                //测试
            },

            //添加工作人员
            addOperator() {
                const _this = this
                console.log(_this.tableDataQualificationInformation)
                this.tableDataQualificationInformation.push(
                    {
                        name: '',
                        number: '',
                        job: '',

                    }
                )
            },
            handleDelete(index, row) {
                //删除表格方法
                this.$confirm(' 是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.tableDataQualificationInformation.splice(index, 1);
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }

            ,
            submitForm(formName) {
                const _this = this
                if (!_this.ifFullFill()){
                    //如果表格没有填写完成 直接return
                    this.$message({
                        message: '请填写数据',
                        type: 'error'
                    });
                    return
                }
                //校验表单
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var ticketsNumber = dateUtil.getNowTime()
                        //获取页面上的所有的数据
                        //作业票传感器的数据
                        _this.$axios.post("/job-tickets-sensors/ticketSensor",
                            {
                                o2First: parseFloat(_this.tableSensorData[0].firstDetect),
                                o2Second: parseFloat(_this.tableSensorData[0].secondDetect),
                                coFirst: _this.tableSensorData[1].firstDetect,
                                coSecond: _this.tableSensorData[1].secondDetect,
                                h2sFirst: _this.tableSensorData[2].firstDetect,
                                h2sSecond: _this.tableSensorData[2].secondDetect,
                                combustibleGasFirst: _this.tableSensorData[3].firstDetect,
                                combustibleGasSecond: _this.tableSensorData[3].secondDetect,
                                heartRateFirst: _this.tableSensorData[4].firstDetect,
                                heartRateSecond: _this.tableSensorData[4].secondDetect,
                                bloodOxygenFirst: _this.tableSensorData[5].firstDetect,
                                bloodOxygenSecond: _this.tableSensorData[5].secondDetect,
                                ticketsNumber: ticketsNumber
                            }).then(
                            res => {
                                console.log(res)
                            }
                        )

                        //作业票 人员资质信息
                        let tableDataQI = []
                        for (let i = 0; i < _this.tableDataQualificationInformation.length; i++) {
                            tableDataQI.push({
                                ticketsNumber: ticketsNumber,
                                operatorName: _this.tableDataQualificationInformation[i].name,
                                operatorId: parseInt(_this.tableDataQualificationInformation[i].number),

                            })
                        }
                        _this.$axios.post("/job-tickets-operators/ticketOperatorsData",
                            tableDataQI).then(res => {
                        })

                        //作业票 作业方案
                        var steps = ""
                        for (let i = 0; i < _this.form.domains.length; i++) {
                            steps += _this.form.domains[i].value + ","
                        }
                        if (steps.length > 0) {
                            steps = steps.substr(0, steps.length - 1);
                        }
                        _this.$axios.post("/job-tickets-scheme/ticketSchemeData", {
                            ticketsNumber: ticketsNumber,
                            lsLocationCompany: _this.form.unit,
                            lsImplementCompany: _this.form.operateUnit,
                            lsOperatorTime: _this.form.date,
                            steps: steps,
                            submitTime: dateUtil.getToday().pattern("yyyy-MM-dd HH:mm:ss"),
                            status: "待审核"
                        }).then(res => {
                        })
                        this.$message({
                            message: '恭喜你，这是一条成功消息',
                            type: 'success'
                        });
                    }
                });

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },
            removeDomain(item) {
                console.log("删除作业步骤")

                var index = this.form.domains.indexOf(item)
                console.log(index)
                if (index !== -1) {
                    this.form.domains.splice(index, 1)
                }
            },
            //添加表格
            addDomain() {
                this.form.domains.push({
                    value: '',
                });
            }
        }
    }
</script>

<style scoped>
.addButton{
    margin-left:20px;
}

.operationDataTestTable{
    margin-bottom:20px;
}

.workerQualificationTable{
    margin-bottom:20px;
    border:1px solid rgb(244, 244, 245);
}
.operationPlan
{
    margin-bottom:20px;
    border:1px solid rgb(244, 244, 245);
}
</style>