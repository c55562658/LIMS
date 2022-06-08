<template>
    <div>

        <H1 style="color: brown">隐患记录单</H1>

        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
            <el-form-item label="隐患视图" prop="picture">
                <el-upload
                           ref="upload"
                           action="http://127.0.0.1:8086/risk-records/upload"
                           list-type="picture-card"
                           :auto-upload="false"
                           :show-file-list="true"

                           :on-success="uploadSuccess"
                           :file-list="fileList"
                           :on-change="fileChange"
                           :on-remove="handleRemove"

                >
                    <i slot="default" class="el-icon-plus"></i>
                    <div slot="file" slot-scope="{file}">
                        <img
                                class="el-upload-list__item-thumbnail"
                                :src="file.url" alt=""
                        >
                        <span class="el-upload-list__item-actions">
                        <span
                                class="el-upload-list__item-preview"
                                @click="handlePictureCardPreview(file)"
                        >
                          <i class="el-icon-zoom-in"></i>
                        </span>
                        <span
                                v-if="!disabled"
                                class="el-upload-list__item-delete"
                                @click="handleDownload(file)"
                        >
                          <i class="el-icon-download"></i>
                        </span>
                        <span
                                v-if="!disabled"
                                class="el-upload-list__item-delete"
                                @click="handleRemove(file)"
                        >
                          <i class="el-icon-delete"></i>
                        </span>
                        </span>
                    </div>
                </el-upload>
                <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                </el-dialog>
            </el-form-item>

            <el-form-item label="隐患描述" prop="desc">
                <el-input v-model="ruleForm.desc"></el-input>
            </el-form-item>

            <el-form-item
                    prop="discoverDate"
                    :rules="{
                          required: true, message: '发现时间不能为空', trigger: 'blur'
            }" label="发现时间:">
                <el-date-picker
                        v-model="ruleForm.discoverDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item
                    prop="soleveDate"
                    :rules="{
                          required: true, message: '整改截止时间不能为空', trigger: 'blur'
            }" label="整改截止时间:">
                <el-date-picker
                        v-model="ruleForm.soleveDate"
                        type="datetime"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="选择日期">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="发现人员" prop="discoverPerson">
                <el-input v-model="ruleForm.discoverPerson"></el-input>
            </el-form-item>

            <el-form-item label="抄送人员" prop="responsePerson">
                <el-input v-model="ruleForm.ccPerson"></el-input>
            </el-form-item>


            <el-form-item>
                <el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    import {dateUtil} from "@/utils/DateUtil";

    export default {
        name: "RiskRecord",
        data() {
            return {
                ruleForm: {
                    picture: '',
                    desc: '',
                    discoverDate: '',
                    soleveDate: '',
                    discoverPerson: '',
                    ccPerson: '',
                },
                rules: {
                    desc: [
                        {required: true, message: '请填写隐患具体内容', trigger: 'blur'}
                    ],
                    date1: [
                        {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    date2: [
                        {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    date3: [
                        {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
                    ],
                    date4: [
                        {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
                    ],
                    discoverPerson: [
                        {required: true, message: '请填写发现人员'}
                    ]
                },

                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                currentFile: [],   //文件列表
                fileList:[],
            };
        },
        methods: {
            debug(){
                const _this=this
                let formData = new FormData();
                let key;
                //将待提交的文件放到FormData对象中，必须挨个放
                for (key in this.currentFile){
                    formData.append("files",_this.currentFile[key].raw)
                }
                formData.append("riskNumber",dateUtil.getNowTime())
                formData.append("riskDesc",_this.ruleForm.desc)
                formData.append("discoverTime",_this.ruleForm.discoverDate)
                formData.append("discoverPerson",_this.ruleForm.discoverPerson)
                formData.append("solveDeadline",_this.ruleForm.soleveDate)
                formData.append("ccPerson",_this.ruleForm.ccPerson)
                formData.append("status",'未处理')
                _this.$axios.post("/risk-records/upload",
                   formData,
                ).then(res=>{
                })
            },
            //下载文件
            // download(){
            //   console.log("xiazai")
            //     this.$axios({
            //         method: 'post',
            //         url: "/risk-records/file", // 请求地址
            //         responseType: 'blob' // 表明返回服务器返回的数据类型
            //     }).then(res=>{
            //         console.log(res)
            //     })
            //
            // },
            submitForm(formName) {
                const _this=this
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const _this=this
                        let formData = new FormData();
                        let key;
                        //将待提交的文件放到FormData对象中，必须挨个放
                        for (key in this.currentFile){
                            formData.append("files",_this.currentFile[key].raw)
                        }
                        formData.append("riskNumber",dateUtil.getNowTime())
                        formData.append("riskDesc",_this.ruleForm.desc)
                        formData.append("discoverTime",_this.ruleForm.discoverDate)
                        formData.append("discoverPerson",_this.ruleForm.discoverPerson)
                        formData.append("solveDeadline",_this.ruleForm.soleveDate)
                        formData.append("ccPerson",_this.ruleForm.ccPerson)
                        formData.append("status",'未处理')
                        _this.$axios.post("/risk-records/upload",
                            formData,
                        ).then(res=>{
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });

            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            },

            //图片上传相关
            handleRemove(file) {
                //获取uid  移除uid相等的图片
            },
            handlePictureCardPreview(file) {
                this.dialogImageUrl = file.url;
                this.dialogVisible = true;
                console.log("handlePictureCardPreview")
            },
            handleDownload(file) {
                const _this=this
            },
            uploadSuccess(){
                console.log("uploadSuccess")
            },

            fileChange(file,fileList){
                this.currentFile.push(file)
                this.fileList.push(file)
                console.log(this.currentFile)
                console.log("fileChange")
            }

        },
        created() {

        }
    }
</script>

<style scoped>

    .avatar-uploader .el-upload {
        border: 1px dashed #2776df;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }

    .avatar-uploader .el-upload:hover {
        border-color: red;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        color: darkred;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }

    .avatar {
        width: 178px;
        height: 178px;
        display: block;
        border: 1px dotted #000;

    }
</style>