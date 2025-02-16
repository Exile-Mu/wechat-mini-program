// This file contains the JavaScript logic for the main page of the mini program.
// It handles the display of text, images, and videos.

Page({
    data: {
        textContent: "加载中...",
        hotspots: [], // 添加热点数据数组
        videoUrls: [
            "https://v2.kwaicdn.com/ksc2/LCv9aqSb5Y84gisw8JQj6-Wq0OvtLOyQkraRcYx05Dqtmc8iRL6djZ6bV_CKcZnPp3M5FEMfzC-Ne7JUedkBnOwAJ7HQnEZliAJ9_X6YoPKsJCHDVBVSgLddpElYjOZYAT1WIPlp3nDu3TnG8oN41X7sz1uRHIfA1i1EnGoK5h8un0G7Qpqtxu-NXZDbLhMs.mp4?pkey=AAVUpB8dLEODrB7YCq-WR9fj747gN_VEFlpmahobJj4D6JzvlVnBhQ4ofo-w8ALTKrg5fb8tk_FgV0eXfPICWNHPtS_DvqZiuR0HGmzXlORU6FIto_NYSOGFDMURqZWpDxU&tag=1-1739635212-unknown-0-kfrfznxfcr-c1eb56a96c9bca3f&clientCacheKey=3xz7zn2fb8dzw9u_b.mp4&di=78f584a3&bp=10004&tt=b&ss=vp",
            "https://v2.kwaicdn.com/ksc2/LxiVu-GfeaQXtpSbBVzVsxQzf7WeDtpza_oiR8WJ07KpdDo65Ie0RNiUCgeIHAiaRYFRCDxd3C2-DK7URGwePU3i07sbTbFpxsoO7rt90QH8AyupAJAXtNPH1DXR2yTa2t1SBPg4OTbY9WU6lizsPnq1ylrXiyhbxpJ90JarTaqcruUjeW1JRoM4WWWYv9md.mp4?pkey=AAVbyhxUoyPxEiWmR6iXBZKHnKy61OUb5CdmLiJVWCE0FYWGrCbKqFsc-DHfwPUQgCZVc5CoRzH45OsoAv1_9kjyzWc5p6ubiUMWgpi06y2ntOaCB9aQXzH9IlIkTztu-vo&tag=1-1739634987-unknown-0-jtmyk4fgmu-3fb12df7dca15e9c&clientCacheKey=3xiib4ye5nbup8w_b.mp4&di=78f584a3&bp=14944&tt=b&ss=vp"
        ], // 添加视频 URL 列表
        imageUrls: [
            "https://n.sinaimg.cn/sinacn10113/332/w1024h1708/20190806/ef66-iatixpm8624120.jpg",
            "https://n.sinaimg.cn/sinacn10113/332/w1024h1708/20190806/29ae-iatixpm8624904.jpg",
            "https://pic.rmb.bdstatic.com/bjh/3eaf0374ad/250202/0b6e494179a7e2e58018792194c073ee.gif"
        ], // 添加图片 URL 列表
        fullScreenImageUrl: "",
        currentVideoId: null, // 当前播放视频的ID
        isPlaying: false, // 当前视频的播放状态
        currentImageIndex: 0 // 当前图片索引
    },
    onLoad: function () {
        // Logic to handle page loading can be added here
        this.refreshData();
    },
    refreshData: function () {
        wx.request({
            // url: 'https://www.zhihu.com/api/v4/search/top_search', // 替换为实际的热点数据接口
            url: 'https://www.zhihu.com/api/v4/creators/rank/hot?domain=0&period=hour', // 替换为实际的热点数据接口
            method: 'GET',
            success: (res) => {
                if (res.statusCode === 200) {
                    const data = res.data.data; // 假设返回的数据结构中包含热点列表
                    const top_search = { words: [] }; // 创建一个对象top_search,包含一个数组words
                    data.forEach((hotspot, index) => {
                        // 假设热点数据结构中包含标题title和链接url,将所有title和url包装到一个数组对象topSearch中
                        top_search.words.push({ title: hotspot.question.title, url: hotspot.question.url });
                    });
                    this.setData({
                        hotspots: top_search.words // 设置热点数据数组
                    });
                } else {
                    this.setData({
                        textContent: "加载失败，请稍后重试。"
                    });
                }
            },
            fail: () => {
                this.setData({
                    textContent: "加载失败，请稍后重试。"
                });
            }
        });
    },
    playVideoById: function (event) {
        const videoId = event.currentTarget.id;
        const videoContext = wx.createVideoContext(videoId);
        if (this.data.currentVideoId === videoId && this.data.isPlaying) {
            videoContext.pause(); // 暂停视频
            this.setData({
                isPlaying: false
            });
        } else {
            videoContext.play(); // 播放视频
            this.setData({
                currentVideoId: videoId, // 记录当前播放视频的ID
                isPlaying: true
            });
        }
    },
    previewImage: function (event) {
        const currentUrl = event.currentTarget.dataset.src;
        this.setData({
            isFullScreen: true,
            fullScreenImageUrl: currentUrl
        });
    },
    closeFullScreen: function () {
        this.setData({
            isFullScreen: false,
            fullScreenImageUrl: ""
        });
    },
    onSwiperChange: function (event) {
        const currentVideoId = this.data.currentVideoId;
        if (currentVideoId) {
            const videoContext = wx.createVideoContext(currentVideoId);
            videoContext.stop(); // 停止当前播放的视频
            this.setData({
                currentVideoId: null, // 重置当前播放视频的ID
                isPlaying: false
            });
        }
    },
    downloadMedia: function (url) {
        wx.downloadFile({
            url: url,
            success: function (res) {
                if (res.statusCode === 200) {
                    wx.saveFile({
                        tempFilePath: res.tempFilePath,
                        success: function (result) {
                            wx.showToast({
                                title: '下载成功',
                                icon: 'success'
                            });
                        },
                        fail: function () {
                            wx.showToast({
                                title: '下载失败',
                                icon: 'none'
                            });
                        }
                    });
                }
            },
            fail: function () {
                wx.showToast({
                    title: '下载失败',
                    icon: 'none'
                });
            }
        });
    },
    onLongPressImage: function (event) {
        const url = event.currentTarget.dataset.src;
        wx.showActionSheet({
            itemList: ['下载'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    this.downloadMedia(url);
                }
            }
        });
    },
    onLongPressVideo: function (event) {
        const url = event.currentTarget.dataset.src;
        wx.showActionSheet({
            itemList: ['下载'],
            success: (res) => {
                if (res.tapIndex === 0) {
                    this.downloadMedia(url);
                }
            }
        });
    },
    onTapRefresh: function () {
        this.refreshData();
    },
    onHotspotTap: function (event) {
        const url = event.currentTarget.dataset.url;
        wx.navigateTo({
            url: `/pages/webview/webview?url=${encodeURIComponent(url)}`
        });
    }
});