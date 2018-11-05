/*
* @Author: Wkiwi
* @Date:   2018-08-08 19:12:54
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-10 11:46:09
*/

var router=require('koa-router')();

var DB=require('../../model/db.js')

var tools=require('../../model/tools.js')

router.get('/',async(ctx)=>{
    //ctx.body='用户管理';
    var result=await DB.find('admin',{})

    await ctx.render('admin/manage/list',{
        list:result
    })
})
router.get('/add',async(ctx)=>{
    //ctx.body='增加用户';
    await ctx.render('admin/manage/add')
})
router.post('/doAdd',async(ctx)=>{
    //ctx.body='增加用户';
    //await ctx.render('admin/manage/doAdd')
    console.log(ctx.request.body)
    var username=ctx.request.body.username;
    var password=ctx.request.body.password;
    var rpassword=ctx.request.body.rpassword;

    if(!/^\w{4,20}/.test(username)){
            await ctx.render('admin/error',{
            message:"用户名不合法",
            redirect:ctx.state.__HOST__+'/admin/manage/add'
        })
    }else if(password!==rpassword||password.length<6){
            await   ctx.render('admin/error',{
            message:"两次密码不一致或小于6位",
            redirect:ctx.state.__HOST__+'/admin/manage/add'
        })
    }else{//查询当前管理员是否在数据库
        var findResult = await DB.find('admin',{'username':username});
        if(findResult.length>0){
            await   ctx.render('admin/error',{
            message:"此管理员已经存在",
            redirect:ctx.state.__HOST__+'/admin/manage/add'
        })
        }else{//增加管理员
            var addResult = await DB.insert('admin',{'username':username,"password":tools.md5(password),"status":1,last_time:''});
            if(addResult){
                ctx.redirect(ctx.state.__HOST__+'/admin/manage')
            }
        }
    }
})
router.get('/edit',async(ctx)=>{
    var id=ctx.query.id;
    var result= await DB.find('admin',{"_id":DB.getObjectId(id)})
    //ctx.body='编辑用户';
    await   ctx.render('admin/manage/edit',{
        list:result[0]
    })
})
router.post('/doEdit',async(ctx)=>{
    //ctx.body='增加用户';
    try{
        var id=ctx.request.body.id;
        var username=ctx.request.body.username;
        var password=ctx.request.body.password;
        var rpassword=ctx.request.body.rpassword;
        if(password!=""||rpassword!=""){
            if(password!==rpassword||password.length<6){
                await ctx.render('admin/error',{
                    message:"两次密码不一致或小于6位",
                    redirect:ctx.state.__HOST__+'/admin/manage/add?id='+id
                })
            }else{//更新密码
                var updateResult=await DB.update('admin',{"_id":DB.getObjectId(id)},{"password":tools.md5(password)});
                ctx.redirect(ctx.state.__HOST__+'/admin/manage')
            }
        }{
            ctx.redirect(ctx.state.__HOST__+'/admin/manage')
        }
    }catch(err){
        await ctx.render('admin/error',{
            message:err,
            redirect:ctx.state.__HOST__+'/admin/manage/add?id='+id
        })
    }
})


module.exports=router.routes();