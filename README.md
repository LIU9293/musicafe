# musicafe 音乐咖

>音乐咖是一个可以搜索 🔍 - 收听 🎵 网易云、虾米、QQ音乐的平台。
你可以安静听歌，也不必再在几个平台之间换来换去

<p align="center"><img width=80% src="/public/capture.jpg"></p>

### 经历
起初因为公司的电脑不能上网易云音乐，就想写一个API放到一个能访问的服务器上抓点歌听一听，写着写着变成了把网易云、虾米和QQ音乐API转换成同一个格式的API。再接着就写了一个前端，现在已经可以搜歌听歌了，也可以下载，虽然可能还有不少Bug，但是自己每天听歌还是很方便的。

### 用到的技术
* Express写的API
* React全家桶，强烈推荐create-react-app
* Howler.js - 一个很好的播放音乐的库，因为用的过程中发现了一个小问题还成了contributor.
* Ant design

### 版权
除了网易云的API是github上搜到的，虾米和QQ的API都是自己抓包、破解出来的，写的过程中一直很担心版权的问题，但其实国外各家听歌平台，spotify, last.fm等都是开放API的，所以感觉也不算太大问题吧，而且很多抢票软件还不是在破解API...

### HTTPS
好不容易换成了HTTPS，但是发现各家音乐文件的源都是HTTP，所以导致只要一听歌小绿标又变成灰色的了，看了一下QQ音乐的网站也是这样的...

### vendor
* [music-api](https://github.com/LIU9293/musicAPI), 网易、虾米、QQ音乐集中的API SKD
