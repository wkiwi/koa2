/*
* @Author: Wkiwi
* @Date:   2018-08-08 17:48:47
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-14 11:16:19
*/

var router=require('koa-router')();

var index =require('./admin/index.js');

var login =require('./admin/login.js');

var user =require('./admin/user.js');

var manage=require('./admin/manage.js');

var articlecate=require('./admin/articlecate.js');

var article=require('./admin/article.js');

var focus=require('./admin/focus.js');

var link=require('./admin/link.js');

var nav=require('./admin/nav.js');

var setting=require('./admin/setting.js');

var url= require('url');

var ueditor = require('koa2-ueditor');


router.use(async(ctx,next)=>{
    //全局配置变量
    ctx.state.__HOST__='http://'+ctx.request.header.host;

    var pathname=url.parse(ctx.request.url).pathname.substring(1);
    //console.log(pathname.split('/'));
    //左侧选中
    var splitUrl=pathname.split('/');
    //配置全局信息
    ctx.state.G={
        url:splitUrl,
        userinfo:ctx.session.userinfo,
        prevPage:ctx.request.headers['referer']
    }

    if(ctx.session.userinfo){
        await  next();
    }else{
        if(pathname=='admin/login'||pathname=='admin/login/doLogin'||pathname=='admin/login/code'){
            await  next();
         }else{
            ctx.redirect('/admin/login')
         }
    }
})
// router.get('/',async(ctx)=>{
//     //ctx.body='后台首页';
//     await ctx.render('admin/index')
// })
router.use('',index);
router.use('/login',login);
router.use('/manage',manage);
router.use('/user',user);
router.use('/articlecate',articlecate);
router.use('/article',article);
router.use('/focus',focus);
router.use('/link',link);
router.use('/nav',nav);
router.use('/setting',setting);
router.all('/editor/controller', ueditor(['public', {
    "imageAllowFiles": [".png", ".jpg", ".jpeg"],
    "imagePathFormat": "/upload/ueditor/image/{yyyy}{mm}{dd}/{filename}"
}]))


module.exports=router.routes();