/*
* @Author: Wkiwi
* @Date:   2018-08-08 17:28:14
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-15 18:28:09
*/

var  Koa=require('koa'),
     router=require('koa-router')(),
     render = require ('koa-art-template'),
     static = require('koa-static'),
     session=require('koa-session'),
     bodyParser=require('koa-bodyparser'),
     sd = require('silly-datetime'),
     jsonp = require('koa-jsonp'),
     path = require ('path'),
     cors = require('koa2-cors');

var app=new Koa();

app.use(bodyParser());
app.use(jsonp());
app.use(cors());
app.keys = ['some secret hurr'];

const CONFIG = {
  key: 'koa:sess',
  maxAge: 864000,
  overwrite: true,
  httpOnly: true,
  signed: true,
  rolling: true,//每次请求都重新设置session
  renew: false,//session快过期重新设置session
};
app.use(session(CONFIG, app));
//配置模板引擎
render(app,{
    root:path.join(__dirname,'views'),
    extname:'.html',
    debug:process.env.NODE_ENV !== 'production',
    dateFormat:dateFormat=function(value){return sd.format(new Date(value), 'YYYY-MM-DD HH:mm');} /*扩展模板里面的方法*/
})
//app.use(static('.'));//不安全
//配置静态资源中间件
app.use(static(__dirname+'/public'));
//引入模块
var  admin=require('./routes/admin.js');
var  api=require('./routes/api.js');
var  index=require('./routes/index.js');

//配置路由
router.use('/admin',admin);
router.use('/api',api);
router.use(index);

// router.get('/',async(ctx)=>{
//     ctx.body="首页";
// })
// router.get('/list',async(ctx)=>{
//     ctx.body="新闻列表";
// })


app.use(router.routes()).use(router.allowedMethods());//启动路由
app.listen(3000);