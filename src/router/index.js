import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../views/Login.vue'
import Blogs from '../views/Blogs.vue'
import BlogEdit from '../views/BlogEdit.vue'
import BlogDetail from '../views/BlogDetail.vue'
import Home from '../views/Home.vue'
import OnlinePratice from "../views/edu/OnlinePratice";
import Exam from "../views/edu/Exam";
import InitPage from "../views/InitPage";
import EmergencyRescue from "../views/emergency/EmergencyRescue";
import EmergencySupplies from "../views/emergency/EmergencySupplies";
import OnlineMonitor from "../views/monitor/OnlineMonitor";
import OperationManage from "../views/operation/OperationManage";
import OperationSubmit from "../views/operation/OperationSubmit";
import OnlineMonitorData from "../views/monitor/OnlineMonitorData"


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Index',
    redirect:{name:"InitPage"}
    // component: InitPage
  },
  {
    path: '/blogs',
    name: 'Blogs',
    component: Blogs
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component:Home,
    children:[

       //初始界面
      {
        path: '/index',
        name: 'InitPage',
        component:InitPage,
      },

      //  edu
      {
        path:'/edu/online_pratice',
        name: 'OnlinePratice' ,
        component:()=>
            import('@/views/edu/OnlinePratice')
      },
      {
        path:'/edu/exam',
        name: 'Exam' ,
        component:()=>
            import('@/views/edu/Exam')
      },
      {
        path: '/edu/answer',
        name: 'Answer',
        component:()=>
            import('@/views/edu/Answer')
      },
      {
        path: '/edu/situation',
        name: 'Situation',
        component:()=>
            import('@/views/edu/Situation')
      },

        //emergency
      {
        path:'/emergency/rescue',
        name: 'emergencyRescue' ,
        component:()=>
            import('@/views/emergency/EmergencyRescue')
      },
      {
        path:'/emergency/supplies',
        name: 'emergencySupplies' ,
        component:()=>
            import('@/views/emergency/EmergencySupplies')
      },

        //monitor
      {
        path:'/monitor/online',
        name: 'onlineMonitor' ,
        component:()=>
            import('@/views/monitor/OnlineMonitor'),
      },

      //传感器数据部分
      {
        path:'/monitor/onlineData',
        name: 'onlineMonitorData' ,
        component:()=>
            import('@/views/monitor/OnlineMonitorData'),
      },

      //历史数据部分
      {
        path:'/monitor/historyData',
        name:'historyData',
        component:()=>
            import('@/views/monitor/HistoryData'),
      },
        //lsos的实时监测画面
      {
        path:'/monitor/realtimeMonitor',
        name:'realtimeMonitor',
        component:()=>
            import('@/views/monitor/RealtimeMonitor'),
      },

        //operation
      {
        path:'/operation/manage',
        name: 'operationManage' ,
        component:()=>
            import('@/views/operation/OperationManage')
      },
      {
        path:'/operation/submit',
        name: 'operationSubmit' ,
        component:()=>
            import('@/views/operation/OperationSubmit')
      },



        //risk
      {
        path:'/risk/record',
        name: 'riskRecord' ,
        component:()=>
            import('@/views/risk/RiskRecord')
      },
      {
        path:'/risk/table',
        name: 'rickTable' ,
        component:()=>
            import('@/views/risk/RiskTable')
      },



    ]
  },
    //查询作业票弹窗
  {
    path:'/operation/queryTicket',
    name: 'queryTicket' ,
    component:()=>
        import('@/views/operation/QueryTicket')
  },

  {
    path: '/blog/add',
    name: 'BlogAdd',
    meta: {
      requireAuth: true
    },
    component: BlogEdit
  },
  {
    path: '/blog/:blogId',
    name: 'BlogDetail',
    component: BlogDetail
  },
  {
    path: '/blog/:blogId/edit',
    name: 'BlogEdit',
    meta: {
      requireAuth: true
    },
    component: BlogEdit
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
