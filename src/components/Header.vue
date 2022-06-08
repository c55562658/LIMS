<template>
    <div class="m-header">
<!--        <h3>欢迎使用受限空间作业管理系统</h3>-->
<!--        <div class="block">-->
<!--            <el-avatar :size="50" :src="user.avatar"></el-avatar>-->
<!--            <div>{{user.username}}</div>-->
<!--        </div>-->

<!--        <div class="maction">-->
<!--            <span> <el-link href="/blogs">主页</el-link></span>-->
<!--            <el-divider direction="vertical"></el-divider>-->
<!--            <span><el-link href="/blog/add" type="success">发表</el-link></span>-->
<!--            <el-divider direction="vertical"></el-divider>-->

<!--            <span v-show="!hasLogin">-->
<!--            <el-link type="primary" href="/login">登陆</el-link>-->
<!--            </span>-->

<!--            <span v-show="hasLogin" ><el-link type="danger" @click="logout">退出</el-link></span>-->
<!--        </div> -->
    <el-menu
      class="el-menu-demo"
      background-color='transparent'
      text-color="#fff"
    >    
    <!-- 南京工业大学logp -->
        <div class="NjtechLogo">
            <img src="../assets/njtechlogo.png">
        </div>
    <div class="systemName"><h3>有限空间作业综合管理系统</h3></div>
    <!-- el-avatar用来存放用户的头像 -->
    <el-avatar :size="20" :src="user.avatar" class="userAvator"></el-avatar>
    <!-- 这里显示的是用户的用户名 -->
    <div class="userName">{{user.username}}</div>
    </el-menu>

        <div class="maction">
            <span> <el-link href="/index">主页</el-link></span>
            <el-divider direction="vertical"></el-divider>
            <span><el-link href="/blog/add" type="success">设置</el-link></span>
            <el-divider direction="vertical"></el-divider>

            <span v-show="!hasLogin">
            <el-link type="primary" href="/login">登陆</el-link>
            </span>

            <span v-show="hasLogin" ><el-link type="danger" @click="logout">退出</el-link></span>
        </div>
    </div>
</template>

<script>
    export default {
        name: "Header.vue",
        data() {
            return {
                user:{
                    username: "请先登录",
                    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
                },
                hasLogin:false,

            }
        },
        methods:{
          logout(){
              const _this=this;
              _this.$axios.get("/logout",{
                  headers:{
                      "Authorization":localStorage.getItem("token")
                  }
              }).then(res=> {
                  _this.$store.commit("REMOVE")
                  _this.$router.push("/login")
              })
            }
        },
        created() {
            const _this=this
            if(_this.$store.getters.getUser.username) {
                this.user.username = _this.$store.getters.getUser.username
                this.user.avatar = _this.$store.getters.getUser.avatar
                this.hasLogin = true
            }
        }
    }
</script>

<style scoped>
.el-menu{
    position: relative;
    height: 48px;
    width: 100%;
    }

.NjtechLogo{
    position: absolute;
    left: 0;
    width: 201px;
    height: 48px;
}
/* 南工大LOGO的样式 */
.NjtechLogo img{
    position: absolute;
    left: 50%;
    transform:translate(-50%);
    width: 80%;
    height: 100%;
}
/* 设置系统名称的样式 */
.systemName{
    position: absolute;
    left: 50%;
    top:50%;
    transform:translate(-50%,-50%);
}
/* 为用户头像设置样式 */
.userAvator{
    position: absolute;
    top:50%;
    right:100px;
    transform: translate(0,-50%);
}
/* 为用户名设置样式 */
.userName{
    position: absolute;
    top:50%;
    right:20px;
    transform: translate(0,-50%);
    }

    .maction{
  display: flex;
  justify-content: center;
        margin-right: 10px;
    }

</style>