/*
* @Author: Wkiwi
* @Date:   2018-08-08 19:12:54
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-09 16:48:19
*/

var router=require('koa-router')();

router.get('/',async(ctx)=>{
    //ctx.body='用户管理';
    await ctx.render('admin/user/list')
})
router.get('/add',async(ctx)=>{
    //ctx.body='增加用户';
    await ctx.render('admin/user/add')
})



module.exports=router.routes();