<template>
    <div>
        <el-container>
            <el-header>
                <img class="mlogo" src="../assets/lsosLogo.png" alt="">
            </el-header>
            <el-main>
                <el-form :model="ruleForm" :rules="rules" ref="ruleForm"  class="demo-ruleForm">
                    <el-form-item>
                        <h3  style="text-align: center; font-size: 30px; margin:20px 0px 80px 0px">
                            受限空间作业综合管理系统
                        </h3>
                    </el-form-item>
                    <el-form-item label="用户名" prop="username" label-width="100px">
                        <el-input v-model="ruleForm.username"></el-input>
                    </el-form-item>

                    <el-form-item label="密码" prop="password" label-width="100px">
                        <el-input type="password" v-model="ruleForm.password"></el-input>
                    </el-form-item>

                    <el-form-item style="display:flex; margin-top:100px;" label-width="60px">
                        <el-button type="primary" @click="submitForm('ruleForm')" >登录</el-button>
                        <el-button @click="resetForm('ruleForm')" style="margin-left:100px">注册</el-button>
                    </el-form-item>
                </el-form>
            </el-main>
        </el-container>


    </div>
</template>

<script>
    export default {
        name: "Login.vue",

        data() {
            return {
                ruleForm: {
                    username: 'yejunjie',
                    password: '111111',
                },
                rules: {
                    username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 15, message: '长度在 3 到 15 个字符', trigger: 'blur' }
                    ],
                    password: [
                        { required: true, message: '请输入密码', trigger: 'change' }
                    ]
                }
            };
        },
        methods: {
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        const _this = this
                        this.$axios.post("http://localhost:8086/login", this.ruleForm).then(res=>{
                            const userInfo = res.data.data
                            const jwt = res.headers.authorization
                            _this.$store.commit("SET_TOKEN", jwt) //存储jwt
                            _this.$store.commit("SET_USER", userInfo) //存储userinfo

                            _this.$router.push("/home")

                        },error=>{
                            console.log(error)
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }

                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
    }
</script>

<style scoped>

    .el-header, .el-footer {
        background-color: #B3C0D1;
        color: #333;
        text-align: center;
        line-height: 60px;
    }

    .el-aside {
        background-color: #D3DCE6;
        color: #333;
        text-align: center;
        line-height: 200px;
    }

    .el-main {
        display: flex;
        justify-content: center;
        background-color: #E9EEF3;
        color: #333;
        text-align: center;
        line-height: 160px;
    }

    body > .el-container {
        margin-bottom: 40px;
    }

    .el-container:nth-child(5) .el-aside,
    .el-container:nth-child(6) .el-aside {
        line-height: 260px;
    }

    .el-container:nth-child(7) .el-aside {
        line-height: 320px;
    }

    .mlogo{
        height: 70%;
        margin-top:10px ;
    }

    .demo-ruleForm{
        max-width: 500px;
        margin:0px auto;

    }

</style>