import axios from 'axios'
import Element from 'element-ui'
import store from "./store";
import router from "./router";


axios.defaults.baseURL="http://127.0.0.1:8086"


// 前置拦截
axios.interceptors.request.use(config=>{
    // 如果还没有token,getToken的值为空字符串
    if (store.getters.getToken !== '') {
        config.headers.Authorization = store.getters.getToken
    }
    return config
})

//后置拦截
axios.interceptors.response.use(response=>{
        let data = response.data
        if(data.code === 200) {
            return response
        } else {
            Element.Message.error({message: data.msg, duration: 3*1000});
            return Promise.reject(data.msg);
        }
    },
    error=>{
        let response = error.response;
        let data = response.data;

        if (response.status === 401) {
            // shiro error
            store.commit("REMOVE")
            router.push("/login")
        }

        Element.Message.error(data.msg);
        return Promise.reject(data.msg);
    }
)