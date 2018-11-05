/*
* @Author: Wkiwi
* @Date:   2018-08-13 17:31:38
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-14 15:42:02
*/
// db.link.insert({"title":"百度","url":"www.baidu.comn","pic":"https://www.baidu.com/img/bd_logo1.png?where=super","sort":"0","status":"0"})

var router=require('koa-router')();

var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');


router.get('/',async(ctx)=>{
    //ctx.body="友情链接列表"
   var page=ctx.query.page||1;
   var pageSize=10;

   var result=await DB.find("link",{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            "add_time":-1
        }
   })
   var count=await DB.count("link",{})//总数量
   await ctx.render('admin/link/list',{
        list:result,
        page:page,
        totalPages:Math.ceil(count/pageSize)
   })
})
router.get('/add',async(ctx)=>{
    //ctx.body="增加轮播图"
    await ctx.render('admin/link/add')
})
router.post('/doAdd',tools.multer().single('pic'),async(ctx)=>{
    //ctx.body="增加轮播图"
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let title=ctx.req.body.title;
    let url=ctx.req.body.url;
    let sort=ctx.req.body.sort;
    let status=ctx.req.body.status;
    let add_time=tools.getTime();

    await DB.insert("link",{
        title,pic,url,sort,status,add_time
    })
     //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/link');

})

router.get('/edit',async(ctx)=>{
    //ctx.body="增加轮播图"
    var id=ctx.query.id;
    //console.log(id)
    var result =await DB.find("link",{"_id":DB.getObjectId(id)});
    //console.log(result)
    ctx.render("admin/link/edit",{
        list:result[0],
        id:id,
        prevPage:ctx.state.G.prevPage
    })
})
router.post('/doEdit',tools.multer().single('pic'),async(ctx)=>{
    //ctx.body="增加轮播图"
    let id=ctx.req.body.id;
    let prevPage=ctx.req.body.prevPage||"";
    let pic=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let title=ctx.req.body.title;
    let url=ctx.req.body.url;
    let sort=ctx.req.body.sort;
    let status=ctx.req.body.status;
    let add_time=tools.getTime();
    if(pic){
        var  json={
            title,pic,url,sort,status,add_time
        }
    }else{
        var  json={
            title,url,sort,status,
        }
    }
    await DB.update("link",{"_id":DB.getObjectId(id)},json)
     //跳转
    if(prevPage){
        ctx.redirect(prevPage);
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/link');
    }

})
module.exports=router.routes();