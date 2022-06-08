<template>
    <div class="whole">
        <el-table
                :data="tableData"
                class="el-table">
            <el-table-column
                    prop="risk_number"
                    label="隐患单号"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="risk_desc"
                    label="隐患概述"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="discover_time"
                    label="发现时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="solve_deadline"
                    label="整改截止时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="处理状态"
                    width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.status=='未处理'">
                        <el-tag type="warning" class="mx-1" effect="dark" round>
                            未处理
                        </el-tag>
                    </div>
                    <div v-if="scope.row.status=='已处理'">
                        <el-tag type="success" class="mx-1" effect="dark" round>
                            已处理
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="500">
                <template slot-scope="scope">
                    <el-button type="text" @click="query(scope.row)">查看详情</el-button>
                    <el-button type="primary" @click="solve(scope.row)">处理完成</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!--    查看详情弹窗-->

        <el-dialog
                title="隐患详情"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
        >
            <span slot="footer" class="dialog-footer">
                <el-descriptions class="margin-top"  :column="1">
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-tickets"></i>
                        隐患单号
                      </template>
                      <el-input v-model="riskTable.riskNumber" :readonly="true"></el-input>
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-document"></i>
                        隐患描述
                      </template>
                      <el-input v-model="riskTable.riskDesc" :readonly="true"></el-input>
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-time"></i>
                        发现时间
                      </template>
                      <el-input v-model="riskTable.riskDiscoverTime" :readonly="true"></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-time"></i>
                        整改期限
                      </template>
                      <el-input v-model="riskTable.riskSolveDeadline" :readonly="true"></el-input>
                    </el-descriptions-item>
                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-user"></i>
                        发现人员
                      </template>
                      <el-input v-model="riskTable.riskDiscoverPerson" :readonly="true"></el-input>
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-user"></i>
                        抄送人员
                      </template>
                      <el-input v-model="riskTable.riskCCPerson" :readonly="true"></el-input>
                    </el-descriptions-item>

                    <el-descriptions-item>
                      <template slot="label">
                        <i class="el-icon-picture"></i>
                        现场照片
                      </template>
                       <el-image v-for="url in riskTable.urls" :key="url" :src="url" ></el-image>
                    </el-descriptions-item>
                </el-descriptions>

            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "RiskTable",
        inject:['reload'],
        data() {
            return {
                tableData: [
                    {
                        risk_number: '',
                        discover_time: '',
                        risk_desc: '',
                        status: '',
                        solve_deadline: ''
                    }
                ],
                dialogVisible: false,


                riskTable:{
                    riskNumber: 200000,
                    riskDesc:"yinghuanmiuaoshu",
                    riskDiscoverTime:20220525,
                    riskSolveDeadline:20220531,
                    riskDiscoverPerson:'叶君杰',
                    riskCCPerson:'叶君杰',
                    urls: [

                    ],
                }

            }
        },
        created() {
            const _this=this
            //请求隐患记录表 查询
            _this.$axios.get("/risk-records/getAllRiskRecords").then(res=>{
                var records=res.data.data
                let riskTableFromApi=[]
                for (let i=0;i<records.length;i++){
                    riskTableFromApi.push({
                        risk_number: records[i].riskNumber,
                        discover_time: records[i].discoverTime,
                        risk_desc: records[i].riskDesc,
                        status: records[i].status,
                        solve_deadline: records[i].solveDeadline
                    })
                }
                _this.tableData=riskTableFromApi
            })

        },
        methods: {
            debug(){
              const _this=this
            },
            query(row) {
                const _this = this
                const baseImgUrl="http://127.0.0.1:8086/img/"
                _this.dialogVisible = true
                _this.riskTable.riskNumber=row.risk_number
                _this.riskTable.riskDesc=row.risk_desc
                _this.riskTable.riskDiscoverTime=row.discover_time
                _this.riskTable.riskSolveDeadline=row.solve_deadline
                //发送请求
                _this.$axios.get("/risk-records/getOneRiskRecord/"+row.risk_number).then(res=>{
                    var record=res.data.data
                    _this.riskTable.riskDiscoverPerson=record.discoverPerson
                    _this.riskTable.riskCCPerson=record.ccPerson

                    var imgUrl=record.imgUrl.split(',')
                    let urls=[]
                    for (let i=0;i<imgUrl.length;i++){
                        // imgUrl[i]=baseImgUrl+imgUrl
                        urls.push(baseImgUrl+imgUrl[i])
                    }
                    _this.riskTable.urls=urls
                })
            },

            solve(row) {
                const _this = this
                this.$confirm('确认此隐患已处理?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$axios.get("/risk-records/finishRiskRecord/"+row.risk_number).then(res=>{
                        console.log(res)
                        this.$message({
                            type: 'success',
                            message: res.data.data
                        });
                        _this.reload()
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                });




            },
            handleClose() {
                this.dialogVisible=false
            }
        }
    }
</script>

<style scoped>
.whole{
    position:relative;
}

.el-table{
    position: absolute;
    left: 10%;
    font-size: 16px;
    width: 100%;
}
</style>