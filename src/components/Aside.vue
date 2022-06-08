<template>
    <div class="whole">
        <el-container id="container">
            <el-aside style="width: 100%">
                <!-- 1) :default-active="this.$route.path : 例如增加博客后，会路由到博客列表，让menu中对应的条目高亮
                     2) router : 启用路由功能，即el-menu-item的index直接写跳转目的url
                     3) :default-openeds="['blogManage','kpiManage']"  :  自动将指定的el-submenu展开
                     4) style="border-right: 0px" : container已经有右侧的边框了，el-menu默认有右侧边框，为了美观将其消除  -->
                <el-menu :default-active="this.$route.path" router :default-openeds="[
                    'education',
                    'monitor',
                    'operation',
                    'risk',
                    'emergency',
                ]" class="el-menu-vertical-demo" background-color="#545c64" text-color="#fff" active-text-color="#ffd04b"
                    style="border-right: 0px">

                    <el-submenu index="education">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>教育培训</span>
                        </template>
                        <!--                        <el-menu-item index="/cms/case_config">实例配置</el-menu-item>-->
                        <el-menu-item index="/edu/online_pratice">在线练习</el-menu-item>
                        <el-menu-item index="/edu/exam">在线考核</el-menu-item>
                        <el-menu-item index="/edu/situation">培训情况(管理者)</el-menu-item>
                    </el-submenu>

                    <el-submenu index="operation">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>作业审批</span>
                        </template>
                        <el-menu-item index="/operation/submit">作业票提交</el-menu-item>
                        <el-menu-item index="/operation/manage">作业票管理</el-menu-item>
                    </el-submenu>


                    <el-submenu index="monitor">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>在线监测</span>
                        </template>
                        <el-menu-item index="/monitor/online">监测节点</el-menu-item>
                        <el-menu-item index="/monitor/historyData">历史数据</el-menu-item>
                        <el-menu-item index="/monitor/realtimeMonitor">实时监测</el-menu-item>
                    </el-submenu>

                    <el-submenu index="risk">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>隐患排查</span>
                        </template>
                        <el-menu-item index="/risk/record">隐患记录</el-menu-item>
                        <el-menu-item index="/risk/table">隐患总表</el-menu-item>
                    </el-submenu>


                    <el-submenu index="emergency">
                        <template slot="title">
                            <i class="el-icon-menu"></i>
                            <span>应急管理</span>
                        </template>
                        <el-menu-item index="/emergency/supplies">应急物资</el-menu-item>
                        <el-menu-item index="/emergency/rescue">应急演练</el-menu-item>
                    </el-submenu>

                </el-menu>
            </el-aside>
        </el-container>
    </div>
</template>

<script>
export default {
    name: "Aside",
    methods: {
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        handleClose(key, keyPath) {
            console.log(key, keyPath);
        }

    },


}
</script>

<style scoped>
.whole{
    margin-right: 5%;
}

#container {
    height: 100%;
    border: 1px solid #eee;
    margin-top: 0;
    padding: 0;
}

/* 给el-menu分别设置min-height和height分别可以解决侧边栏自动缩小和高度无法占满整个屏幕的问题 */
.el-menu-vertical-demo {
    min-width: 200px;
    height: 100%;
}
</style>