<template>
    <div id="wrap">
        <Header></Header>
        <el-container id="main-area">
            <Aside></Aside>
            <!--  el-main默认有padding:20px的属性，去除该属性。需要的页面自己设置padding  -->
            <el-main style="padding:0px">
                <!-- Home.vue这个页面包括了Header和Aside，菜单栏中选择不同的连接时，只是中间main这块区域发生更改
                     router/index.js中，home路由下需要配置了子路由，路由匹配到的组件将其中的元素替换到router-view
                -->

                <!-- keep-alive使得组件中的信息被缓存，例如跳转到添加博客页面，页面输入框中写了一些内容，又跳转走了，
                     再次跳转到添加博客页面，上次输入的内容还保留着
                -->
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive" />
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive" />
            </el-main>
        </el-container>
    </div>
</template>

<script>
    import Header from "../components/Header"
    import Aside from "../components/Aside"
    export default {
        name: "Home",
        components:{Header, Aside},
        data() {
            return {
            }
        }
    }
</script>

<style scoped>
    #wrap {
        width: 100%;
        height: 100%;
    }
    /*#main-area {*/
    /*    width: 100%;*/
    /*    height: calc(100% - var(--header-height));*/
    /*}*/
</style>