<template>
    <div>
        <h3>练习记录</h3>
        <el-table
                :data="tableData"
                border
                style="width: 100%">
            <el-table-column
                    v-for="(item,i) in practiceProps"
                    :key="i"
                    :label="item.label"
                    :property="item.prop">
            </el-table-column>
        </el-table>

        <h3>考试记录</h3>
        <el-table
                :data="examTableData"
                border
                style="width: 100%">
            <el-table-column
                    v-for="(item,i) in examProps"
                    :key="i"
                    :label="item.label"
                    :property="item.prop">
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    export default {
        name: "Situation",
        data() {
            return {
                practiceProps:[
                    { prop: "date", label: "日期" },
                    { prop: "practiceTitle", label: "练习专题" },
                    { prop: "practiceResult", label: "练习结果" },
                    {prop:"praticeName",label: "练习人员"}
                ],
                tableData: [{
                    date: '2022-03-21',
                    practiceTitle: '专题一',
                    practiceResult: '90'
                }],

                examProps:[
                    { prop: "date", label: "日期" },
                    { prop: "examTitle", label: "考试专题" },
                    { prop: "examResult", label: "考试结果" },
                    { prop:"examName",label: "考试人员"}
                ],

                examTableData:[
                    {

                    }
                ]

            }
        },
        created() {
            const _this=this
            //查询练习数据库，将数据显示在表单
            _this.$axios.post("/edu-result/queryPrariceResult",{
                type:2
            }).then(res=>{
                let record=res.data.data
                console.log(record)
                //给表格赋值
                let tableDataFromApi =[]
                for (let i=0;i<record.length;i++)
                {

                    tableDataFromApi.push(
                        {
                            date:record[i].date,
                            practiceTitle:record[i].practiceTopic,
                            practiceResult:record[i].score,
                            praticeName:record[i].operatorName
                        }
                        )
                }
                _this.tableData=tableDataFromApi
            })

            //查询考核数据
            _this.$axios.post("/edu-result/queryExamResult",{
                type:1
            }).then(res=>{
                let record=res.data.data
                //给表格赋值
                let tableDataFromApi =[]
                for (let i=0;i<record.length;i++)
                {
                    tableDataFromApi.push(
                        {
                            date:record[i].date,
                            examTitle:record[i].examTopic,
                            examResult:record[i].score,
                            examName:record[i].operatorName
                        }
                    )
                }
                _this.examTableData=tableDataFromApi
            })
        }
    }
</script>

<style scoped>

</style>