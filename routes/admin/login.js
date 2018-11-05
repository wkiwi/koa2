/*
* @Author: Wkiwi
* @Date:   2018-08-08 19:12:42
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-09 17:30:33
*/

const router=require('koa-router')();

const tools=require('../../model/tools.js');

const DB=require('../../model/DB.js');

const svgCaptcha = require('svg-captcha');

router.get('/',async(ctx)=>{
    // ctx.body='登录';
    await ctx.render('admin/login')
})
router.post('/doLogin',async(ctx)=>{
     //ctx.body='登录';
    // await ctx.render('admin/login')
    //await console.log(ctx.request.body)
    let username=ctx.request.body.username
    let password=ctx.request.body.password
    let code=ctx.request.body.code
    //console.log(tools.md5(password))
    if(code.toLowerCase()==ctx.session.code.toLowerCase()){
        var result=await DB.find('admin',{'username':username,"password":tools.md5(password)})
        if(result.length>0){
            console.log('登陆成功');
            //console.log(result)
            ctx.session.userinfo=result[0];
            //更新用户表 改变用户登录时间
            await DB.update("admin",{"_id":DB.getObjectId(result[0]._id)},{
                last:new Date()
            })
            ctx.redirect(ctx.state.__HOST__+'/admin')
        }else{
            console.log("失败")
            //ctx.redirect('/admin/login')
            ctx.render('admin/error',{
                message:'用户名或密码错误',
                redirect:ctx.state.__HOST__+'/admin/login'
            })
        }
    }else{
        console.log("验证码失败")
            ctx.render('admin/error',{
                message:'验证码错误',
                redirect:ctx.state.__HOST__+'/admin/login'
            })
    }
})
router.get('/code',async(ctx)=>{
    //ctx.body='验证码';
    var captcha = svgCaptcha.create({
        size: 4 ,
        fontSize:50,
        width:120,
        height:34,
        ignoreChars: '0o1i' ,
        noise: 2 ,
        color: true ,
        background: '#cc9966'
    });
    console.log(captcha.text);
    ctx.session.code=captcha.text;//保存验证码
    ctx.body=captcha.data;
    ctx.response.type='image/svg+xml'
    // res.type('svg');
    // res.status(200).send(captcha.data);
})
router.get('/loginOut',async(ctx)=>{
     ctx.session.userinfo=null;
     ctx.redirect(ctx.state.__HOST__+'/admin/login')
})

module.exports=router.routes();
