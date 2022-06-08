// 扩展Date，使得可以指定日期格式
Date.prototype.pattern=function(fmt) {
    var o = {
        "M+" : this.getMonth()+1, //月份
        "d+" : this.getDate(), //日
        "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12, //小时
        "H+" : this.getHours(), //小时
        "m+" : this.getMinutes(), //分
        "s+" : this.getSeconds(), //秒
        "q+" : Math.floor((this.getMonth()+3)/3), //季度
        "S" : this.getMilliseconds() //毫秒
    };
    var week = {
        "0" : "/u65e5",
        "1" : "/u4e00",
        "2" : "/u4e8c",
        "3" : "/u4e09",
        "4" : "/u56db",
        "5" : "/u4e94",
        "6" : "/u516d"
    };
    if(/(y+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
    }
    if(/(E+)/.test(fmt)){
        fmt=fmt.replace(RegExp.$1, ((RegExp.$1.length>1) ? (RegExp.$1.length>2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay()+""]);
    }
    for(var k in o){
        if(new RegExp("("+ k +")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        }
    }
    return fmt;
};

const g_baseLineDay = ""  // 测试用，设置baseLineDay后(例如 2021-12-01), 一直将baseLineDay当做今天

function DateUtil() {
    let _today = null
    if (g_baseLineDay !== "")
        _today=new Date(g_baseLineDay);
    else
        _today=new Date();
    this.today=_today;
    this.year=_today.getFullYear();//当前年份
    this.month=_today.getMonth();
    this.day=_today.getDate();//getDate返回1个月中的第几天
    this.date=_today.getDay()==0?7:_today.getDay();//本周第几天 因系统会把周日作为第0天; getDay 返回1周中的第几天
}

DateUtil.prototype = {
    // 返回指定时间戳对应的UTC日期
    // 输入:timeStampSec 单位秒
    // 输入:join 是否需要join
    // 输出格式:['2019'，'09'，'01']  if join == false
    //         2019-09-01 UTC  if join == true
    timeStampToUtcDate: function(timeStampSec, join) {
        const day = new Date(timeStampSec * 1000);

        const utcYearStr = ''+ day.getUTCFullYear()
        const utcMonthStr = day.getUTCMonth()+1 < 10 ? '0' + (day.getUTCMonth()+1): '' + (day.getUTCMonth()+1)
        const utcDay = day.getUTCDate() < 10 ? '0' + day.getUTCDate(): '' + day.getUTCDate()

        if (join === undefined) {
            return [utcYearStr, utcMonthStr, utcDay]
        } else {
            return utcYearStr + "-" + utcMonthStr + "-" + utcDay + " UTC"
        }
    },

    // 返回指定时间戳对应的UTC时间
    // 输入:timeStampSec 单位秒
    // 输入:join 是否需要join
    // 输出格式:['2019','09','01',‘21’,‘59’,‘60’]  if join == false
    //         2019-09-01 21:59:60 UTC  if join == true
    timeStampToUtcTime: function(timeStampSec, join) {
        const day = new Date(timeStampSec * 1000);

        const utcYearStr = ''+ day.getUTCFullYear()
        const utcMonthStr = day.getUTCMonth()+1 < 10 ? '0' + (day.getUTCMonth()+1): '' + (day.getUTCMonth()+1)
        const utcDay = day.getUTCDate() < 10 ? '0' + day.getUTCDate(): '' + day.getUTCDate()
        const utcHour = day.getUTCHours() < 10 ? '0' + day.getUTCHours(): '' + day.getUTCHours()
        const utcMinutes = day.getUTCMinutes() < 10 ? '0' + day.getUTCMinutes(): '' + day.getUTCMinutes()
        const utcSeconds = day.getUTCSeconds() < 10 ? '0' + day.getUTCSeconds(): '' + day.getUTCSeconds()

        if (join === undefined) {
            return [utcYearStr, utcMonthStr, utcDay, utcHour, utcMinutes, utcSeconds]
        } else {
            return utcYearStr + "-" + utcMonthStr + "-" + utcDay + " " + utcHour + ":" + utcMinutes + ":" + utcSeconds
        }
    },


    refreshToday: function () {
        if (g_baseLineDay !== "")
            return

        let _today = new Date()
        this.today = _today;
        this.year = _today.getFullYear();
        this.month = _today.getMonth();
        this.day = _today.getDate();
        this.date = _today.getDay() == 0 ? 7 : _today.getDay();
    },

    // 返回基线日期
    // eg: dateUtil.getToday().pattern("MMdd")
    getToday: function () {
        this.refreshToday()
        return this.today;
    },
    // 返回基线第二天的日期,时间为第二天零时的时间
    // eg: dateUtil.getTomorrowDay().pattern("yyyy-MM-dd")
    getTomorrowDay: function() {
        this.refreshToday()
        return new Date(this.year, this.month, this.day + 1);
    },
    // 返回基线前一天的日期,时间为前一天零时的时间
    // eg: dateUtil.getYesterday().pattern("yyyy-MM-dd")
    getYesterday: function() {
        this.refreshToday()
        return new Date(this.year, this.month, this.day - 1);
    },
    // 返回基线前n天的日期,时间为前n天零时的时间
    // eg: dateUtil.getNumberDay(4).pattern("yyyy-MM-dd")
    getNumberDay: function(num) {
        this.refreshToday()
        return new Date(this.year, this.month, this.day - num);
    },
    // 返回基线日期所在周的第n天的日期
    // eg: dateUtil.getDayOfWeek(1).pattern("MMdd") 返回周一的日期
    getDayOfWeek: function (nDay) {
        this.refreshToday()
        return new Date(this.year, this.month, this.day - this.date + nDay);
    },

    // 返回基线日期所在周的前一周的第n天的日期
    // eg: dateUtil.getDayOfPreWeek(1).pattern("MMdd") 返回前一周，周一的日期
    getDayOfPreWeek: function (nDay) {
        this.refreshToday()
        return new Date(this.year, this.month, this.day - 7 - this.date + nDay);
    },

    // 返回基线日期之前几周的第n天的日期
    // eg: dateUtil.getDayOfNumWeek(3,1).pattern("MMdd") 返回前3周，周一的日期
    getDayOfNumWeek: function (weekNum,nDay) {
        this.refreshToday()
        return new Date(this.year, this.month, this.day - weekNum*7 - this.date + nDay);
    },

    // 返回基线日期之前几周再往前一周，第n天的日期
    // eg: dateUtil.getDayOfPrevNumWeek(3,1).pattern("MMdd") 返回前4周，周一的日期
    getDayOfPrevNumWeek: function (weekNum,nDay) {
        this.refreshToday()
        return new Date(this.year, this.month, this.day - (weekNum+1)*7 -this.date + nDay);
    },

    // 返回今天或者指定日期是周几,范围：1~7
    // eg: dateUtil.getDay()
    getDay: function (input_day) {
        if (input_day === undefined) {
            this.refreshToday()
            return this.date
        } else {
            return input_day.getDay()==0?7:input_day.getDay()
        }
    },

    // 返回今天或者指定日期是几月,范围：1~12
    // eg: dateUtil.getMonth()  今天是2021年12月某一天，返回[2021,12]
    getMonth: function (input_day) {
        if (input_day === undefined) {
            this.refreshToday()
            const resMonth = this.month + 1
            return [this.year, resMonth]
        } else {
            const resMonth = input_day.getMonth() + 1
            const resYear = input_day.getFullYear()
            return [resYear, resMonth]
        }
    },

    // 返回基线日期旧的方向指定月数的月份
    // eg: dateUtil.getPreNumMonth(3)   今天是2021年12月某一天，返回[2021,9]
    getPreNumMonth: function (nMonth) {
        this.refreshToday()
        const firstDayOfMonth=new Date(this.year, this.month-nMonth, 1);
        const resMonth = firstDayOfMonth.getMonth() + 1
        const resYear = firstDayOfMonth.getFullYear()
        return [resYear, resMonth]
    },

    // 返回基线年份
    // eg: dateUtil.getYear()
    getYear: function () {
        this.refreshToday()
        return this.year;
    },

    // 返回基线日期旧的方向指定年数的年份
    // eg: dateUtil.getPreNumYear(3)     今天是2021年12月某一天，返回 2018
    getPreNumYear: function (nYear) {
        this.refreshToday()
        const firstDayOfMonth=new Date(this.year - nYear, this.month, 1);
        return firstDayOfMonth.getFullYear();
    },

    // 返回输入Date类型变量与基线日期相差的天数
    // eg: var mdate = new Date("2020-12-01")
    //     dateUtil.getDiffBefore(mdate)
    //     今天是2021年12月某一天，返回 [1,12,365]
    //     1表示两者相差1年；12表示两者相差12个月；365表示两者相差365天
    getDiffBefore: function (inDate) {
        if (inDate > this.today) {
            console.log("The input date cannot be longer than the current date")
            return [0,0,0]
        }

        this.refreshToday()
        const inYear = inDate.getFullYear()
        const inMonth = inDate.getMonth()
        const diffYear = this.year - inYear;
        const diffMonth =diffYear *12 + (this.month - inMonth);

        const diffDay = Math.floor((this.today.getTime() - inDate.getTime())/(24*60*60*1000))
        return [diffYear, diffMonth, diffDay]
    },

    //获取当前时间 YYYY-mm-DD HH:mm:ss 格式
    getNowTime:function () {
        var date = new Date();

        var year = date.getFullYear();        //年 ,从 Date 对象以四位数字返回年份
        var month = date.getMonth() + 1;      //月 ,从 Date 对象返回月份 (0 ~ 11) ,date.getMonth()比实际月份少 1 个月
        var day = date.getDate();             //日 ,从 Date 对象返回一个月中的某一天 (1 ~ 31)

        var hours = date.getHours();          //小时 ,返回 Date 对象的小时 (0 ~ 23)
        var minutes = date.getMinutes();      //分钟 ,返回 Date 对象的分钟 (0 ~ 59)
        var seconds = date.getSeconds();      //秒 ,返回 Date 对象的秒数 (0 ~ 59)

        //获取当前系统时间
        var currentDate = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;


        //修改月份格式
        if (month >= 1 && month <= 9) {
            month = "0" + month;
        }

        //修改日期格式
        if (day >= 0 && day <= 9) {
            day = "0" + day;
        }

        //修改小时格式
        if (hours >= 0 && hours <= 9) {
            hours = "0" + hours;
        }

        //修改分钟格式
        if (minutes >= 0 && minutes <= 9) {
            minutes = "0" + minutes;
        }
        //修改秒格式
        if (seconds >= 0 && seconds <= 9) {
            seconds = "0" + seconds;
        }
        //获取当前系统时间  格式(yyyy-mm-dd hh:mm:ss)
        var currentFormatDate = year+ month + day  + hours + minutes + seconds;
        return currentFormatDate
    }
}

const dateUtil = new DateUtil()

export {dateUtil};