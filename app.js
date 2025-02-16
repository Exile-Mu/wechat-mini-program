App({
    onLaunch: function () {
        // 小程序初始化时执行的代码
        console.log('App Launch');
    },
    onShow: function () {
        // 小程序启动或从后台进入前台显示时执行的代码
        console.log('App Show');
    },
    onHide: function () {
        // 小程序从前台进入后台时执行的代码
        console.log('App Hide');
    },
    globalData: {
        // 全局数据
        userInfo: null
    }
});
