<template>
    <div>
        <el-table
                :data="tableData"
                style="font-size: 16px;
                       width: 100%">
            <el-table-column
                    prop="ticket_number"
                    label="作业票单号"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="submit_time"
                    label="提交时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="status"
                    label="处理状态"
                    width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.status=='待作业'">
                        <el-tag type="warning" class="mx-1" effect="dark" round>
                            待作业
                        </el-tag>
                    </div>
                    <div v-if="scope.row.status=='已拒绝'">
                        <el-tag type="danger" class="mx-1" effect="dark" round>
                            已拒绝
                        </el-tag>
                    </div>
                    <div v-if="scope.row.status=='已完成'">
                        <el-tag type="success" class="mx-1" effect="dark" round>
                            已完成
                        </el-tag>
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                    prop="finish_time"
                    label="完成时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="500">
                <template slot-scope="scope">
                    <el-button type="text" @click="query(scope.row)">查看作业票</el-button>
                    <el-button type="primary" @click="allowJob(scope.row)">允许作业</el-button>
                    <el-button type="danger" @click="denyJob(scope.row)" >拒绝作业</el-button>
                    <el-button type="success" @click="finishJob(scope.row)">完成作业</el-button>
                </template>
            </el-table-column>
        </el-table>
        <QueryTicket title="测试弹窗" v-if="openDialog" ref="QueryTicket"></QueryTicket>

    </div>
</template>

<script>
    import QueryTicket from "./QueryTicket";
    export default {
        inject:['reload'],
        name: "OperationManage",
        components: {QueryTicket},
        data() {
            return {
                tableData: [{
                    ticket_number: '',
                    submit_time: '',
                    status: '',
                    finish_time: '',
                },],
                dialogVisible:false,
                iframeVue:null,
                openDialog:false
            }
        },

        created() {
            //一开始创建的时候就要发送请求  去求历史作业票单号的数据
            const _this=this
            _this.$axios.get("/job-tickets-scheme/queryHistoryTickets").then(res=>{
                var record=res.data.data
                console.log(record)
                //表格赋值
                let tableDataFromApi=[]
                for (let i=0;i<record.length;i++)
                {
                    tableDataFromApi.push(
                        {
                            ticket_number: record[i].ticketsNumber,
                            submit_time: record[i].submitTime,
                            status: record[i].status,
                            finish_time: record[i].finishTime
                        }
                    )
                }
                _this.tableData=tableDataFromApi
            })
        },
        methods: {
            handleClose(done) {
                this.$confirm('确认关闭？')
                    .then(_ => {
                        alert("确定")
                        done();
                    })
                    .catch(_ => {
                        alert("取消")
                    });
            },
            //查看作业票
            query(row) {
                const _this=this
                console.log(row)
                //根据当前的作业票单号发送请求去查询作业票
                _this.openDialog=true
                _this.$nextTick(() => {
                    this.$refs.QueryTicket.init(row.ticket_number);
                });

            },


            //允许作业
            allowJob(row)
            {
                const _this=this
                let qs = require('qs');
                //根据作业票单号 更改处理状态为带作业
                console.log(row.ticket_number)
                _this.$axios.post("/job-tickets-scheme/allowJob",
                    qs.stringify({ticketsNumber:row.ticket_number}))
                .then(res=>{
                    console.log(res)
                    _this.reload()
                })
            },

            //拒绝作业
            denyJob(row)
            {
                //更改处理状态为拒绝作业
                const _this=this
                let qs = require('qs');
                //根据作业票单号 更改处理状态为带作业
                console.log(row.ticket_number)
                _this.$axios.post("/job-tickets-scheme/denyJob",
                    qs.stringify({ticketsNumber:row.ticket_number}))
                    .then(res=>{
                        console.log(res)
                        _this.reload()
                    })

            },
            //完成作业
            finishJob(row)
            {
                //更改处理状态为已完成
                const _this=this
                let qs = require('qs');
                //根据作业票单号 更改处理状态为带作业
                console.log(row.ticket_number)
                _this.$axios.post("/job-tickets-scheme/finishJob",
                    qs.stringify({ticketsNumber:row.ticket_number}))
                    .then(res=>{
                        console.log(res)
                        _this.reload()
                    })
            }

        },
    }

</script>

<style scoped>

    #ifr1{
        height: 600px;
        width: 80%;
    }

</style>