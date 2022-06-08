<template>
    <div>
        <ul class="top">
            <ul class="test" v-if="testOrPratice()">
                <li class="order">
                    <el-badge :value="praticeCount.sum" class="item" type="primary">
                        <span>全部</span>
                    </el-badge>
                </li>
                <li class="order">
                    <el-badge :value="praticeCount.toPratice" class="item" type="primary">
                        <span>未开始</span>
                    </el-badge>
                </li>
                <li class="order">
                    <el-badge :value="praticeCount.finish" class="item" type="primary">
                        <span>已开始</span>
                    </el-badge>
                </li>
                <li class="order">
                    <el-badge :value="praticeCount.exceed" class="item">
                        <span>已过期</span>
                    </el-badge>
                </li>
            </ul>


            <li class="search-li">
                <div class="icon">
                    <input type="text" placeholder="试卷名称" class="search" v-model="key">
                    <i class="el-icon-search"></i>
                </div>
            </li>
            <li>
                <el-button type="primary" @click="search()">搜索试卷</el-button>
            </li>
        </ul>


        <div class="block">
            <el-timeline>
                <el-timeline-item v-bind:timestamp="question.created" placement="top" v-for="question in questions">
                    <el-card>
                        <h4>{{question.topicTypeDetail}}</h4>
                        <p>更新于{{question.created}}</p>

                        <el-collapse accordion>
                            <el-collapse-item>
                                <template slot="title">
                                    <div class="answerSituation">点击查看试题详情
                                    <i class="header-icon el-icon-info"></i>
                                    </div>
                                    <div v-if="eduResults.indexOf(question.topicType)!==-1">
                                        <el-tag type="warning" class="mx-1" effect="dark" round>
                                            已答题
                                        </el-tag>
                                    </div>
                                    <div v-if="eduResults.indexOf(question.topicType)===-1">
                                        <el-tag type="success" class="mx-1" effect="dark" round>
                                            未答题
                                        </el-tag>
                                    </div>
                                </template>
                                <div>选择题：10题；</div>
                                <div>判断题：5题；</div>
                                <div>填空题：10题；</div>
                            </el-collapse-item>
                        </el-collapse>

                        <el-button @click="toAnswer(question.topicType,question.topicTypeDetail)" type="primary" round>开始答题</el-button>
                    </el-card>
                </el-timeline-item>
            </el-timeline>


            <el-pagination class="mpage"
                           background
                           layout="prev, pager, next"
                           :current-page=currentPage
                           :page-size=pageSize
                           @current-change=page
                           :total="total">
            </el-pagination>
        </div>

        <v-footer></v-footer>
    </div>

</template>



<script>
    import Footer from "@/components/Footer"
    import { mapState} from 'vuex'
    export default {
        components: {
            "v-footer": Footer
        },
        name: "OnlinePratice",
        data(){
            return{
                questions:{},
                currentPage:1,
                total: 0,
                pageSize: 5,
                key: null, //搜索关键字
                isTest:false,

                //是否已完成
                eduResults:[],

                //练习情况统计
                praticeCount:{
                    sum:0,
                    toPratice:0,
                    finish:0,
                    exceed:0,

                }

            }
        },
        created() {
            const _this = this
            _this.page(1)
            //查本人的考试结果 根据用户的id去查询
            //通过如下方式获取登录用户的信息

            _this.$axios.post("/edu-result/queryOnePrariceResult",{
                id:_this.$store.getters.getUser.id,
                type:2
            }).then(res=>{
                //获取到已经练习过的试题
                _this.praticeCount.finish=res.data.data.length
                _this.praticeCount.toPratice=_this.praticeCount.sum-_this.praticeCount.finish
                for(let i=0;i<res.data.data.length;i++){
                    _this.eduResults.push(res.data.data[i].topicType)
                }
            })

        },
        methods:{
            page(currentPage)
            {
                const _this = this
                _this.$axios.get("/question/initQuestion?currentPage="+currentPage).then(res=>{
                    _this.questions=res.data.data.records
                    _this.currentPage = res.data.data.current
                    _this.total = res.data.data.total
                    _this.pageSize = res.data.data.size
                    //练习情况
                    _this.praticeCount.sum=res.data.data.total
                })
            },
            queryAnalysis(){
                const  _this = this
                //发送请求，获取是哪个专题
                _this.$axios.post("/question/queryAnalysis", {
                    topicType: this.$route.query.topicType,
                }).then(res => {
                    console.log(res)
                })
            },

            toAnswer(topicTypeToAnswer,topicTypeDetail)
            {
                let isPractice = true
                this.$store.commit("SET_PRACTICE", isPractice)

                this.$router.push({path:"/edu/answer",query:{topicType: topicTypeToAnswer,topicTypeDetail:topicTypeDetail}})
                console.log(topicTypeToAnswer)

            },

            //判断是练习模式还是考试模式
            testOrPratice(){
                return !this.isTest;
            },

            //搜索试卷方法
            search()
            {
                const _this=this
                if(_this.key ===null)
                {
                    this.$message({
                        message: '请输入试卷名称',
                        type: 'warning'
                    })
                }
                if(_this.key===''){
                    _this.page(1)
                }
                else {
                    _this.$axios.post("/question/queryTopic", {
                        topicTypeDetail: this.key,
                    }).then(res => {
                        _this.questions={}
                        let q=[]
                        q.push(res.data.data);
                        _this.questions=q

                    })
                }
            }
        },

        computed:mapState(["isPractice"])

    }
</script>

<style scoped>
li{
    list-style: none;
    padding: 10px;
}

.top{
    display: flex;
    align-items: center;
}

.el-pagination{
    display: flex;
    justify-content: center;
}

.search{
    height: 40px;
    width: 250px;
    border: 1px solid rgb(64, 158, 255);
    border-radius:5px ;
    padding-left:5px;
}
.el-icon-search{
    margin-left: -24px;
}

.search-li{
    margin-left: auto;
}


.test{
    display: flex;
}
.answerSituation
{
    margin-right: 20px;
}
</style>