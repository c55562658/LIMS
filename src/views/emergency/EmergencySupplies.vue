<template>
    <div>
        <el-button type="primary" @click="addSupply()">添加物资点</el-button>
        <el-table
                :data="supplyTableData"
                style="font-size: 16px;
                       width: 100%">
            <el-table-column
                    prop="supply_number"
                    label="物资编号"
                    width="200">
            </el-table-column>

            <el-table-column
                    prop="supply_place"
                    label="地点"
                    width="200">
            </el-table-column>

            <el-table-column
                    prop="supply_list"
                    label="物资清单"
                    width="200">
            </el-table-column>


            <el-table-column
                    prop="supply_status"
                    label="物资状态"
                    width="150">
                <template slot-scope="scope">
                    <div v-if="scope.row.supply_status=='不可用'">
                        <el-tag type="warning" class="mx-1" effect="dark" round>
                            不可用
                        </el-tag>
                    </div>
                    <div v-if="scope.row.supply_status=='可用'">
                        <el-tag type="success" class="mx-1" effect="dark" round>
                            可用
                        </el-tag>
                    </div>
                </template>
            </el-table-column>

            <el-table-column
                    prop="last_check_time"
                    label="上次确认时间"
                    width="200">
            </el-table-column>

            <el-table-column
                    label="操作"
                    width="500">
                <template slot-scope="scope">
                    <el-button type="success" @click="confirmSupply(scope.row)">确认可用</el-button>
                    <el-button type="warning" @click="fixSupply(scope.row)">报修</el-button>
                    <el-button type="danger" @click="deleteSupply(scope.row)">删除物资点</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-dialog
                title="添加物资点"
                :visible.sync="dialogVisible"
                width="30%"
                :before-close="handleClose"
        >
            <span slot="footer" class="dialog-footer">
                <div style="margin: 20px;"></div>
                <el-form :label-position="labelPositon" label-width="80px" :model="addSupplyForm">
                  <el-form-item label="物资编号">
                    <el-input v-model="addSupplyForm.supply_number"></el-input>
                  </el-form-item>

                  <el-form-item label="物资地点">
                    <el-input v-model="addSupplyForm.supply_place"></el-input>
                  </el-form-item>

                  <el-form-item label="物资清单">
                    <el-input v-model="addSupplyForm.supply_list"></el-input>
                  </el-form-item>

                  <el-form-item label="物资状态">
                    <el-input v-model="addSupplyForm.supply_status"></el-input>
                  </el-form-item>
                </el-form>
                <template>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="addConfirm()">添加</el-button>
                </template>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EmergencySupplies",
        inject:['reload'],
        data(){
            return{
                supplyTableData: [
                    {
                        supply_number: '',
                        supply_place: '',
                        supply_list: '',
                        supply_status: '',
                        last_check_time: ''
                    }
                ],
                dialogVisible:false,
                labelPositon:'left',

                addSupplyForm:{
                    supply_number: '',
                    supply_place: '',
                    supply_list: '',
                    supply_status: '',
                }
            }
        },
        created() {
            const _this=this
            _this.$axios.get("/supplies/getAllSupplies").then(res=>{
                var records=res.data.data
                let supplyTableDataFromApi=[]
                for (let i=0;i<records.length;i++){
                    supplyTableDataFromApi.push({
                        supply_number: records[i].supplyNumber,
                        supply_place: records[i].supplyPlace,
                        supply_list: records[i].supplyList,
                        supply_status: records[i].supplyStatus,
                        last_check_time: records[i].supplyLastCheck
                    })
                }
                _this.supplyTableData=supplyTableDataFromApi
            })
        },
        methods:{
            //确认可用按钮
            confirmSupply(row) {
                const _this=this
                if(row.supply_status==='不可用'){
                    _this.$confirm("确认可用?",'提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success'
                    }).then(()=>{
                        _this.$axios.get("/supplies/updateCheck/"+row.supply_number).then(res=>{
                            _this.reload()
                            this.$message({
                                type: 'success',
                                message: res.data.data
                            });
                            _this.reload()
                        })
                    }).catch(()=>{
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    })
                }
                else{
                    this.$message({
                        type: 'warning',
                        message: '已处于可用状态'
                    });
                }

            },
            deleteSupply(row) {
                const _this=this
                _this.$confirm("确认删除?",'提示',{
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'success'
                }).then(()=>{
                    _this.$axios.get("/supplies/deleteSupply/"+row.supply_number).then(res=>{
                        _this.reload()
                        this.$message({
                            type: 'success',
                            message: res.data.data
                        });
                    })
                }).catch(()=>{
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });
                })
            },

            //添加物资按钮
            addSupply() {
                const _this=this
                _this.dialogVisible=true
                _this.addSupplyForm={}
            },
            handleClose(){
                const _this=this
                _this.dialogVisible=false
            },
            addConfirm(){
                const _this=this
                _this.$axios.post("/supplies/addSupply",{
                    supplyNumber: _this.addSupplyForm.supply_number,
                    supplyPlace: _this.addSupplyForm.supply_place,
                    supplyList: _this.addSupplyForm.supply_list,
                    supplyStatus: _this.addSupplyForm.supply_status,
                }).then(res=>{
                    _this.dialogVisible=false
                    this.$message({
                        type: 'success',
                        message: '添加成功'
                    });
                })
                _this.reload()
            },

            fixSupply(row){
                const _this=this
                if(row.supply_status==='可用'){
                    _this.$confirm("确认报修?",'提示',{
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'success'
                    }).then(()=>{
                        _this.$axios.get("/supplies/fixSupply/"+row.supply_number).then(res=>{
                            _this.reload()
                            this.$message({
                                type: 'success',
                                message: res.data.data
                            });
                        })
                    }).catch(()=>{
                        this.$message({
                            type: 'info',
                            message: '已取消'
                        });
                    })
                }
                else{
                    this.$message({
                        message: '已处于不可用状态',
                        type: 'warning'
                    });
                }

            }
        },
    }
</script>

<style scoped>

</style>