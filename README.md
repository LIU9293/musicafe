# musicafe 音乐咖

> For most Chinese people, we are using netease, xiami, or QQ music service everyday for enjoying music, but
 we are also bothered with changing the platform each time for the songs or artists we love. Musicafe is a web
 music platform for simply it.

<p align="center"><img width=80% src="/public/capture.jpg"></p>

## 2月24号更新

前两天一个导航网站转载了这个网站，导致流量一下增加好多，被腾讯音乐合作的监管机构监测到。
所以QQ已经下线...😢

# Functions
* Search netease, xiami, ~~qq~~ songs, albums, playlists.
* Get albums, playlists details.
* Add songs to your list and play.
* (Unsuggested) Add VIP songs(neet pay) of xiami, ~~qq~~, example [here](https://musicafe.co/album/xiami/2102661271).
* (Unsuggested) Add unauthorized songs of xiami, ~~qq~~, example [here](https://musicafe.co/album/qq/0033AjP71h7iIR).
* Download songs in albums and playlists page.

# Run local

```shell
git clone https://github.com/LIU9293/musicafe.git
cd musicafe
npm install
npm run https (not npm start!!!)
```
Because the API server is using https, so http development environment may cause CORS issue.
**PLEASE DO delete the baidu analytic code in public/index.html as well !!!**

**Use your own API server**
```shell
src/redux/action/fetch.js
const base = 'localhost:8080/api/';

npm run build
node server/index.js
npm start
```
If there are any CORS problem, go to server/index.js and change res.header("Access-Control-Allow-Origin", "*");

# Useful stuff used
* [music-api](https://github.com/LIU9293/musicAPI), centralized Node.JS API SDK for xiami, netease, and qq music.
* [Howler.js](https://github.com/goldfire/howler.js), Javascript audio library for the modern web.
* [create-react-app](https://github.com/facebookincubator/create-react-app)
* [Ant design](ant.design)

# HTTPS
The website is using https, but all media files in netease, xiami and qq are transferred via http, so the https badge
will grey out after you listen to something. T.T

# TODOS
- [ ] Pray for not be forbidded...
- [ ] Mutilple user playlists, listen whole album or playlist directly.
- [ ] Account to remeber playlists.
- [ ] Go mobile.
