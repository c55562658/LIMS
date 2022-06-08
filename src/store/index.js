import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  //状态
  state: {
    isPractice:false, //练习模式标志
    token: localStorage.getItem("token")==null ? '' : localStorage.getItem("token"),
    userInfo: sessionStorage.getItem("userInfo")==null ? {} : JSON.parse(sessionStorage.getItem("userInfo")),
  },
  // 包含多个更新state函数的对象
  mutations: {
    //set function
    SET_TOKEN:(state,token)=>{
      state.token=token;
      localStorage.setItem("token",token);
    },

    SET_USER:(state,userInfo)=>{
      state.userInfo=userInfo;
      sessionStorage.setItem("userInfo",JSON.stringify(userInfo));
    },

    REMOVE:(state)=>{
      state.token=''
      state.userInfo={}
      localStorage.removeItem("token")
      sessionStorage.removeItem("userInfo")
    },

    //练习
    SET_PRACTICE(state,status) {
      state.isPractice = status
    },
  },

  // 包含多个getter计算属性函数的对象
  getters:{
    //get function

    getUser: state => {
      return state.userInfo
    },

    getToken: state => {
      return state.token
    },
    getPractice:state =>  {
      return state.isPractice
    }

  },

  // 包含多个队形事件回调函数的对象
  actions: {

  },
  modules: {
  }
})
