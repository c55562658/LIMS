<template>
    <div class="whole">
    <transition name="slider-fade">
        <div class="left" v-if="slider_flag">
            <ul class="l-top">
                <li>
                    <a href="javascript:;"></a>
                    <span>当前</span>
                </li>
                <li>
                    <a href="javascript:;"></a>
                    <span>未答</span>
                </li>
                <li>
                    <a href="javascript:;"></a>
                    <span>已答</span>
                </li>
                <li>
                    <a href="javascript:;"></a>
                    <span>标记</span>
                </li>
            </ul>
            <div class="l-bottom">
                <div class="item">
                    <p>选择题部分</p>
                    <ul>
                        <li v-for="(list, index1) in selectData" :key="index1">
                            <a href="javascript:;"
                               @click="change(index1)"
                               :class="{'border': index == index1 && currentType == 1,'bg':bg_flag && (selectData[index1].chosedAnswer!=null)}">
                                <span :class="{'mark':  selectMark[index1].isMark==true}"></span>
                                {{index1+1}}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="item">
                <p>填空题部分</p>
                <ul>
                    <li v-for="(list, index2) in completionData" :key="index2">
                        <a href="javascript:;"
                           @click="fill(index2)"
                           :class="{'border': index == index2 && currentType == 2,'bg':  fillAnswer[index2][0] !=null}">
                            <span :class="{'mark':  completeMark[index2].isMark==true}"></span>
                            {{selectData.length+index2+1}}
                        </a>
                    </li>
                </ul>
                </div>
                <div class="item">
                    <p>判断题部分</p>
                    <ul>
                        <li v-for="(list, index3) in judgeData" :key="index3">
                            <a href="javascript:;"
                               @click="judge(index3)"
                               :class="{'border': index == index3 && currentType == 3,'bg':  judgeAnswer[index3]!=0 }">
                                <span :class="{'mark':  judgeMark[index3].isMark==true}"></span>
                                {{selectData.length+completionData.length+index3+1}}
                            </a>
                        </li>
                    </ul>
                </div>
                <div class="final" @click="commit()">结束考试</div>
            </div>
        </div>
    </transition>

    <!--右边选择答题区-->
    <transition name="slider-fade">
        <div class="right">
            <div class="title">
                <p>{{title}}</p>
                <span>全卷共{{questionNumber}}题</span>
            </div>
            <div class="content">
                <div v-if="currentType == 1">
                    <p class="select"><span class="number">{{number}}:</span>{{selectData[index].questionDescription}}</p>
                    <el-radio-group v-model="selectAnswer[index]" @change="getChangeLabel" >
                        <el-radio :label="1">{{selectData[index].choiceA}}</el-radio>
                        <el-radio :label="2">{{selectData[index].choiceB}}</el-radio>
                        <el-radio :label="3">{{selectData[index].choiceC}}</el-radio>
                        <el-radio :label="4">{{selectData[index].choiceD}}</el-radio>
                    </el-radio-group>


<!--                    判断是 练习模式还是 考试模式-->
                    <div class="analysis" v-if="isPractice && AnalisisFlag">
                        <ul>
                            <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{selectData[index].answer}}</span></li>
                            <li><el-tag>题目解析：</el-tag></li>
                            <li>{{selectData[index].analysis == null ? '暂无解析': selectData[index].analysis}}</li>
                        </ul>
                    </div>

                </div>
                <div class="fill" v-if="currentType == 2">
                    <p class="fillTitle"><span class="number">{{number}}:</span>{{completionData[index].questionDescription}}</p>
                    <div v-for="(item,currentIndex) in completeMark[index].part" :key="currentIndex">
                        <el-input placeholder="请填在此处"
                                  v-model="fillAnswer[index][currentIndex]"
                                  clearable
                                  @blur="fillBG"
                                  >
                        </el-input>
                    </div>

                    <div class="analysis" v-if="isPractice">
                        <ul>
                            <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{completionData[index].answer}}</span></li>
                            <li><el-tag>题目解析：</el-tag></li>
                            <li>{{completionData[index].analysis == null ? '暂无解析': completionData[index].analysis}}</li>
                        </ul>
                    </div>
                </div>
                <div class="judge" v-if="currentType == 3">
                    <p class="judgeTitle"><span class="number">{{number}}:</span>{{judgeData[index].questionDescription}}</p>
                    <el-radio-group v-model="judgeAnswer[index]" @change="getJudgeLabel" v-if="currentType == 3">
                        <el-radio :label="1">正确</el-radio>
                        <el-radio :label="2">错误</el-radio>
                    </el-radio-group>
                    <div class="analysis" v-if="isPractice">
                        <ul>
                            <li> <el-tag type="success">正确答案：</el-tag><span class="right">{{judgeData[index].answer}}</span></li>
                            <li><el-tag>题目解析：</el-tag></li>
                            <li>{{judgeData[index].analysis == null ? '暂无解析': judgeData[index].analysis}}</li>
                        </ul>
                    </div>
                </div>
            </div>
            <div class="operation">
                <ul class="end">
                    <li @click="previous()"><i class="iconfont icon-youqianjin"></i><span>上一题</span></li>
                    <li @click="mark()"><i class="iconfont icon-mark-o"></i><span>标记</span></li>
                    <li @click="next()"><span>下一题</span><i class="iconfont icon-zuoqianjin"></i></li>
                </ul>
            </div>
        </div>
    </transition>
   </div>
</template>

<script>
    import {dateUtil} from "../../utils/DateUtil";
    import { mapState} from 'vuex'


    export default {
        name: "Answer",

        data()
        {
            return{
                //选择题的数据
                selectData:[
                    {
                        questionDescription:'',
                        chosedAnswer:'',
                        answer:'',
                    }
                ],
                selectAnswer:[],//选择题答案
                //选择题标记
                selectMark:[
                    {
                        isMark:false,
                    }
                ],

                //填空题数据
                completionData:[
                    {
                        questionDescription :'',
                        chosedAnswer:'',
                        answer:'',
                    }
                    ],
                fillAnswer: [
                    [ ]
                ], //二维数组保存所有填空题答案

                //填空题标记
                completeMark:[
                    {
                        isMark:false,
                        part:'', //填空题数量格数
                    }
                ],


                //判断题数据
                judgeData:[
                    {
                        questionDescription :'',
                        chosedAnswer:'',
                        answer:''
                    }
                ],
                judgeAnswer: [], //保存所有判断题答案

                judgeMark:[
                    {isMark:false}
                ],


                questionNumber:0, //题目总数量
                radio:null,
                number: 1, //题号
                subDate:'',//提交时间

                AnalisisFlag:false,

                slider_flag: true, //左侧显示隐藏标识符
                topic:{  //试卷信息
                    data:[],
                },
                index:0, //每一类题目的编号
                currentType: 1, //当前题型类型  1--选择题  2--填空题  3--判断题
                bg_flag: false,  //已答标识符,已答改变背景色


                topicCount: [],//每种类型题目的总数




                reduceAnswer:[],  //vue官方不支持3层以上数据嵌套,如嵌套则会数据渲染出现问题,此变量直接接收3层嵌套时的数据。
                answerScore: 0, //答题总分数
                isFillClick: false, //选择题是否点击标识符
                flag: false, //个人信息显示隐藏标识符
                // radio: [], //保存考生所有选择题的选项
                title: "请选择正确的选项",
                userInfo: { //用户信息
                    name: null,
                    id: null
                },
                score: [],  //每种类型分数的总数
                examData: { //考试信息
                    // source: null,
                    // totalScore: null,
                },
                showQuestion: [], //当前显示题目信息
                showAnswer: {}, //当前题目对应的答案选项

                part: null, //填空题的空格数量
                topic1Answer: [],  //学生选择题作答编号,
                rightAnswer: ''
            }
        },
        created() {
            const _this=this
            console.log(this.$route.query.topicTypeDetail)


            //查询到所有的试题信息
            //发请求
            _this.$axios.post("/question/queryAllQuestionByTopic", {
                topicType: this.$route.query.topicType,
            }).then(res => {
                _this.selectData=res.data.data[1]
                console.log(_this.selectData)


                _this.completionData=res.data.data[2] //填空题

                _this.judgeData=res.data.data[3]
                _this.questionNumber=res.data.data[1].length+res.data.data[2].length+res.data.data[3].length


                //选择题答案初始化
                let selectLen=_this.selectData.length
                let selectMarkData=[]
                let selectAnswerDate=[]
                for (let i=0;i<selectLen;i++)
                {
                    let eachselectMark = {isMark:false}
                    selectAnswerDate.push(0)
                    selectMarkData.push(eachselectMark)
                }
                _this.selectAnswer=selectAnswerDate
                _this.selectMark=selectMarkData

                //填空题初始化
                let completelen=_this.completionData.length
                let fillAnswerData=[]
                for(let i = 0; i < completelen; i++) { //根据填空题数量创建二维空数组存放每道题答案
                    let eachFillAnswer = []
                    fillAnswerData.push(eachFillAnswer)
                }
                _this.fillAnswer=fillAnswerData

                //mark用于判断是否标记，part用于记录填空题的空树
                let completeMarkData=[]
                for (let i=0;i<completelen;i++)
                {
                    let part1= _this.completionData[i].questionDescription.split("()").length -1 //根据题目中括号的数量确定填空横线数量

                    let eachcompleteMark = {isMark:false,part:part1}
                    completeMarkData.push(eachcompleteMark)
                }
                _this.completeMark=completeMarkData


                //判断题初始化
                let judgeLen=_this.judgeData.length
                let judgeAnswerData=[]
                for (let i=0;i<judgeLen;i++)
                {
                    judgeAnswerData.push(0)
                }
                _this.judgeAnswer=judgeAnswerData


                let judgeMarkData=[]
                for (let i=0;i<judgeLen;i++)
                {
                    let eachjudgeMark = {isMark:false}
                    judgeMarkData.push(eachjudgeMark)
                }
                _this.judgeMark=judgeMarkData

            })


        },
        methods:{
            //点击选择题序号,改变内容
            change(index)
            {
                const _this=this
                _this.index=index
                _this.currentType = 1
                _this.number=index+1

            },
            //选择了某一项
            getChangeLabel(val)
            {
                const _this=this
                _this.bg_flag=true
                // // 需要保存答案
                _this.selectData[_this.index].chosedAnswer=val
                _this.selectAnswer[_this.index]=val
            },

            //点击填空题序号
            fill(index2)
            {
                const _this=this
                console.log(index2)
                _this.index=index2
                _this.number=_this.selectData.length+index2+1
                _this.currentType = 2
                //记录填空题的空格数
                let part= _this.completionData[_this.index].questionDescription.split("()").length -1 //根据题目中括号的数量确定填空横线数量
                _this.completeMark[_this.index].part=part
            },

            //填空题答题了
            fillBG(){
                const _this=this

                console.log("填空题答题了")
                // if(_this.fillAnswer[_this.index][0] != null) {
                //     _this.fillAnswer[this.index][3] = true
                // }
            },

            //点击判断题序号 index3 表示判断题的序号
            judge(index3)
            {
                const _this=this
                _this.currentType=3
                _this.index=index3
                _this.number=_this.selectData.length+_this.completionData.length+index3+1
                //判断答案是否选择过
                // if(_this.judgeAnswer[index3] == 0)
                // {
                //     console.log("my xuanze guo ")
                // }
            },
            //判断题选择了选项
            getJudgeLabel(val)
            {
                const _this=this
                _this.judgeAnswer[_this.index]=val
            },
            //标记函数
            mark()
            {
                const _this=this

                if (_this.currentType===1)
                {
                    _this.selectMark[_this.index].isMark=true
                }
                else if(_this.currentType===2)
                {
                    _this.completeMark[_this.index].isMark=true
                }
                else
                {
                    _this.judgeMark[_this.index].isMark=true
                }

            },
            //上一题函数
            previous()
            {
                const _this=this
                //获取当前的题目类型
                //获取当前的题号
                var preNum=_this.number-1
                var selectLen=_this.selectData.length
                var completeLen=_this.completionData.length
                var judgeLen=_this.judgeData.length

                if(_this.number>1)
                {
                    _this.number=preNum
                    if(preNum===selectLen)
                    {
                        _this.currentType=1
                        _this.index=selectLen-1
                    }

                    else if (preNum===selectLen+completeLen)
                    {
                        _this.currentType=2
                        _this.index=completeLen-1
                    }
                    else if (preNum===selectLen+completeLen+judgeLen)
                    {
                        this.currentType=3
                        _this.index=judgeLen-1
                    }
                    else
                    {
                        _this.index--
                    }
                }
                else
                {
                    console.log("已经是第一题了")
                }

            },
            //下一题按钮函数
            next()
            {
                const _this=this
                console.log("下一题按钮")
                var nextNum=_this.number+1
                var selectLen=_this.selectData.length
                var completeLen=_this.completionData.length
                var judgeLen=_this.judgeData.length

                if(_this.number<selectLen+completeLen+judgeLen)
                {
                    _this.number=nextNum
                    if(nextNum===selectLen+1)
                    {
                        _this.currentType=2
                        _this.index=0
                    }

                    else if (nextNum===selectLen+completeLen+1)
                    {
                        _this.currentType=3
                        _this.index=0
                    }
                    else
                    {
                        _this.index++
                        //判断是否选择过答案
                        if(_this.selectData[_this.index].chosedAnswer===null)
                        {
                            _this.radio=''
                        }
                        else
                        {
                            _this.radio=_this.selectData[_this.index].chosedAnswer
                        }

                    }
                }
                else
                {
                    console.log("已经是最后一题了")
                }
            },
            //结束考试按钮
            commit()
            {
                const _this=this

                console.log("计算分数,将结果提交")
                var score = 0
                let answer = []

                //保存选择题的答案
                let rightSelectAnswer = []
                for (let i = 0; i < _this.selectData.length; i++) {
                    rightSelectAnswer.push(_this.selectData[i].answer)
                    switch (_this.selectAnswer[i]) {
                        case 1:
                            answer.push("A");
                            break;
                        case 2:
                            answer.push("B");
                            break;
                        case 3:
                            answer.push("C");
                            break;
                        case 4:
                            answer.push("D");
                            break;
                        default:
                            break;
                    }

                }
                //计算选择题的分数
                for (let i = 0; i < _this.selectData.length; i++) {
                    if (answer[i] === rightSelectAnswer[i]) {
                        score += 2
                    }
                }

                //填空题答案
                let rightFillAnswer = []
                for (let i = 0; i < _this.completionData.length; i++) {
                    rightFillAnswer.push(_this.completionData[i].answer.split(";"))
                }

                //填空题得分
                let fillAnswer = JSON.parse(JSON.stringify(_this.fillAnswer))
                for (let i = 0; i < rightFillAnswer.length; i++) {
                    if (rightFillAnswer[i].toString() === fillAnswer[i].toString()) {
                        score += 2
                    }
                }

                console.log(_this.judgeAnswer)
                console.log(_this.judgeData)

                //判断题答案
                let rightJudgeAnswer = []
                for (let i = 0; i < _this.judgeData.length; i++) {
                    if (_this.judgeData[i].answer == "True") {
                        rightJudgeAnswer.push(1)
                    } else if (_this.judgeData[i].answer == "False") {
                        rightJudgeAnswer.push(2)
                    } else {
                        console.log("没有正确答案，请检查题目")
                    }
                }

                //判断题分数
                let judgeAnswer = JSON.parse(JSON.stringify(_this.judgeAnswer))
                for (let i = 0; i < judgeAnswer.length; i++) {
                    if (judgeAnswer[i].toString() == rightJudgeAnswer[i].toString()) {
                        score += 2
                    }
                }
                console.log(score)





                if(this.$store.state.isPractice)
                {
                    this.$confirm('结束考试, 是否查看解析?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(()=>
                    {
                        this.$message({
                            type: 'success',
                            message: '查看解析!'
                        });
                        console.log("查看解析，将练习结果上传值数据库")
                        _this.AnalisisFlag=true
                        //发送请求，插入数据
                        _this.$axios.post("/edu-result/insertResult",{
                            type:this.$route.query.topicType,
                            practiceTitle:this.$route.query.topicTypeDetail,
                            date:new Date(),
                            score:score
                        }).then(res=>{
                            console.log(res)
                            console.log(new Date())
                        })

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '异常，已取消'
                        });
                    });

                }
                else {
                    this.$confirm('结束考试, 是否结束并提交?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.$message({
                            type: 'success',
                            message: '已结束!'
                        });

                        _this.$axios.post("/edu-result/insertResult",{
                            type:this.$route.query.topicType,
                            examTitle:this.$route.query.topicTypeDetail,
                            date:new Date(),
                            score:score
                        }).then(res=>{
                            console.log(res)
                            console.log(new Date())
                        })

                    }).catch(() => {
                        this.$message({
                            type: 'info',
                            message: '提交异常，已取消'
                        });
                    });
                }


            }
        },
        computed:{
            isPractice(){
                return this.$store.state.isPractice
            }
        }
    }
</script>

<style scoped>
    .whole{
        display: flex;
        justify-content: space-between;
    }

    li{
        list-style: none;
    }

    .iconfont.icon-time {
        color: #2776df;
        margin: 0px 6px 0px 20px;
    }
    .analysis {
        margin-top: 20px;
    }
    .right {
        margin-right: auto;
        width: 80%;
        /*color: #2776df;*/
        font-size: 18px;
        border: 1px solid #2776df;
        padding: 0px 6px;
        border-radius: 4px;
        margin-top:25px;
    }
    /* ul li:nth-child(3) {
        padding: 10px;
        border-radius: 4px;
    } */
    .analysis span:nth-child(1) {
        font-size: 18px;
    }
    .mark {
        position: absolute;
        width: 4px;
        height: 4px;
        content: "";
        background-color: red;
        border-radius: 50%;
        top: 0px;
        left: 22px;
    }
    .border {
        position: relative;
        border: 1px solid #FF90AA !important;
    }
    .bg {
        background-color: #5188b8 !important;
    }
    .fill .el-input {
        display: inline-flex;
        width: 150px;
        margin-left: 20px;
    }

    .el-input__inner {
        border: 1px solid transparent;
        border-bottom: 1px solid #eee;
        padding-left: 20px;
    }
    /* slider过渡效果 */
    .slider-fade-enter-active {
        transition: all 0.3s ease;
    }
    .slider-fade-leave-active {
        transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
    }
    .slider-fade-enter,
    .slider-fade-leave-to {
        transform: translateX(-100px);
        opacity: 0;
    }

    .operation .end li:nth-child(2) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        background-color: rgb(39, 118, 223);
        border-radius: 50%;
        width: 50px;
        height: 50px;
        color: #fff;
    }
    .operation .end li {
        list-style: none;
        cursor: pointer;
        margin: 0 100px;
    }
    .operation {
        background-color: #fff;
        border-radius: 4px;
        padding: 10px 0px;
        margin-right: 10px;
    }
    .operation .end {
        display: flex;
        justify-content: center;
        align-items:center;
        color: rgb(39, 118, 223);
    }
    .content .number {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        margin-right: 4px;
    }
    .content {
        padding: 0px 20px;
    }
    .content .topic {
        padding: 20px 0px;
        padding-top: 30px;
    }
    .right .content {
        background-color: #fff;
        margin: 10px;
        margin-left: 0px;
        height: 470px;
    }
    .content .el-radio-group label {
        color: #000;
        margin: 5px 0px;
    }
    .content .el-radio-group {
        display: flex;
        flex-direction: column;
    }
    .right .title p {
        margin-left: 20px;
    }
    /* 让全卷一共多少题处在屏幕右侧 */
    .right .title span {
        margin-left: auto;
    }

    .flexarea {
        display: flex;
    }
    .flexarea .right {
        flex: 1;
    }
    .auto-right {
        margin-left: auto;
        color: #2776df;
        margin-right: 10px;
    }
    .right .title {
        margin-right: 10px;
        padding-right: 30px;
        display: flex;
        align-items: center;
        margin-top: 10px;
        background-color: #fff;
        height: 50px;
        line-height: 50px;
    }
    .clearfix {
        clear: both;
    }
    .l-bottom .final {
        cursor: pointer;
        display: inline-block;
        text-align: center;
        background-color: rgb(39, 118, 223);
        width: 240px;
        margin: 20px 0px 20px 10px;
        border-radius: 4px;
        height: 30px;
        line-height: 30px;
        color: #fff;
        margin-top: 22px;
    }
    #answer .left .item {
        padding: 0px;
        font-size: 16px;
    }
    .l-bottom {
        border-radius: 4px;
        background-color: #fff;
    }
    .l-bottom .item p {
        margin-bottom: 15px;
        margin-top: 10px;
        color: #000;
        margin-left: 10px;
        letter-spacing: 2px;
    }
    .l-bottom .item li {
        width: 15%;
        margin-left: 5px;
        margin-bottom: 10px;
    }
    .l-bottom .item {
        display: flex;
        flex-direction: column;
    }
    .l-bottom .item ul {
        width: 100%;
        margin-bottom: -8px;
        display: flex;
        justify-content: flex-start;
        flex-wrap: wrap;
    }
    .l-bottom .item ul li a {
        position: relative;
        justify-content: center;
        display: inline-flex;
        align-items: center;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background-color: #fff;
        border: 1px solid #eee;
        text-align: center;
        color: #000;
        font-size: 16px;
    }
    .left .l-top {
        display: flex;
        justify-content: space-around;
        padding: 16px 0px;
        border: 1px solid #eee;
        border-radius: 4px;
        margin-bottom: 10px;
        background-color: #fff;
    }
    .left {
        width: 260px;
        height: 100%;
        margin: 10px 10px 0px 10px;
    }
    .left .l-top li:nth-child(2) a {
        border: 1px solid #eee;
    }
    .left .l-top li:nth-child(3) a {
        background-color: #5188b8;
        border: none;
    }
    .left .l-top li:nth-child(4) a {
        position: relative;
        border: 1px solid #eee;
    }
    .left .l-top li:nth-child(4) a::before {
        width: 4px;
        height: 4px;
        content: " ";
        position: absolute;
        background-color: red;
        border-radius: 50%;
        top: 0px;
        left: 16px;
    }
    .left .l-top li {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }
    .left .l-top li a {
        display: inline-block;
        padding: 10px;
        border-radius: 50%;
        background-color: #fff;
        border: 1px solid #ff90aa;
    }
    #answer .top {
        background-color: rgb(39, 118, 223);
    }
    #answer .item {
        color: #fff;
        display: flex;
        padding: 20px;
        font-size: 20px;
    }
    #answer .top .item li:nth-child(1) {
        margin-right: 10px;
    }
    #answer .top .item li:nth-child(3) {
        position: relative;
        margin-left: auto;
    }
    #answer {
        padding-bottom: 30px;
    }
    .icon20 {
        font-size: 20px;
        font-weight: bold;
    }
    .item .msg {
        padding: 10px 15px;
        border-radius: 4px;
        top: 47px;
        right: -30px;
        color: #6c757d;
        position: absolute;
        border: 1px solid rgba(0, 0, 0, 0.15);
        background-color: #fff;
    }
    .item .msg p {
        font-size: 16px;
        width: 200px;
        text-align: left;
    }

</style>