/*
* @Author: Wkiwi
* @Date:   2018-08-14 10:32:37
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-14 15:41:51
*/

var router=require('koa-router')();

var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');


router.get('/',async(ctx)=>{
   // ctx.body="轮播图列表"
   var page=ctx.query.page||1;
   var pageSize=10;

   var result=await DB.find("nav",{},{},{
        page:page,
        pageSize:pageSize
   })
   var count=await DB.count("nav",{})//总数量
   await ctx.render('admin/nav/list',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
   })
})
router.get('/add',async(ctx)=>{
    //ctx.body="增加轮播图"
    await ctx.render('admin/nav/add')
})
router.post('/doAdd',async(ctx)=>{
    //ctx.body="增加轮播图"
    let title=ctx.request.body.title;
    let url=ctx.request.body.url;
    let sort=ctx.request.body.sort;
    let status=ctx.request.body.status;
    let add_time=tools.getTime();

    await DB.insert("nav",{
        title,url,sort,status,add_time
    })
     //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/nav');

})

router.get('/edit',async(ctx)=>{
    //ctx.body="增加轮播图"
    var id=ctx.query.id;
    //console.log(id)
    var result =await DB.find("nav",{"_id":DB.getObjectId(id)});
    //console.log(result)
    ctx.render("admin/nav/edit",{
        list:result[0],
        id:id,
        prevPage:ctx.state.G.prevPage
    })
})
router.post('/doEdit',async(ctx)=>{
    //ctx.body="增加轮播图"
    let id=ctx.request.body.id;
    let prevPage=ctx.request.body.prevPage||"";
    let title=ctx.request.body.title;
    let url=ctx.request.body.url;
    let sort=ctx.request.body.sort;
    let status=ctx.request.body.status;
    let add_time=tools.getTime();
    var  json={
        title,url,sort,status
    }

    await DB.update("nav",{"_id":DB.getObjectId(id)},json)
     //跳转
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/nav');
    }

})
module.exports=router.routes();