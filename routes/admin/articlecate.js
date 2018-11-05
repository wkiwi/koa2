/*
* @Author: Wkiwi
* @Date:   2018-08-10 14:16:54
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-10 16:07:40
*/
/*
db.articlecate.insert({"title":"技术团队","description":"这是技术团队","keywords":"技术团队","pid":"0","add_time":""})
db.articlecate.insert({"title":"移动开发","description":"这是移动开发","keywords":"移动开发","pid":"5b6d3284f74ed6bffa3496a7","add_time":""})
db.articlecate.insert({"title":"网站开发","description":"这是网站开发","keywords":"网站开发","pid":"5b6d3284f74ed6bffa3496a7","add_time":""})
db.articlecate.insert({"title":"关于我们","description":"这是关于我们","keywords":"关于我们","pid":"0","add_time":""})
db.articlecate.insert({"title":"数码","description":"这是数码","keywords":"数码","pid":"0","add_time":""})
 */
var router=require('koa-router')();

var DB=require('../../model/db.js')
var tools=require('../../model/tools.js')
router.get('/',async(ctx)=>{
    var result = await DB.find('articlecate',{})
    //tools.cateToList(result);格式化数据
    await ctx.render('admin/articlecate/index',{
        list:tools.cateToList(result)
    })

})
router.get('/add',async(ctx)=>{
    //ctx.body='增加分类';
    var result = await DB.find('articlecate',{"pid":"0"});

    await ctx.render('admin/articlecate/add',{
        catelist:result
    })
})
router.post('/doAdd',async(ctx)=>{
    //ctx.body='增加分类';
    //console.log(ctx.request.body)
    var addDate=ctx.request.body;

    var result=await DB.insert('articlecate',addDate);

    ctx.redirect(ctx.state.__HOST__+'/admin/articlecate')
})
router.post('/doEdit',async(ctx)=>{

    var editDate=ctx.request.body;

    var id=editDate.id;
    var title=editDate.title;
    var pid=editDate.pid;
    var keywords=editDate.keywords;
    var status=editDate.status;
    var description=editDate.description;

    var result=await DB.update('articlecate',{"_id":DB.getObjectId(id)},{
        title:title,
        pid:pid,
        keywords:keywords,
        status:status,
        description:description
    });

    ctx.redirect(ctx.state.__HOST__+'/admin/articlecate')
})
router.get('/edit',async(ctx)=>{
    //ctx.body='增加分类';
    var id=ctx.query.id;
    var result=await DB.find('articlecate',{"_id":DB.getObjectId(id)});
    console.log(result)
    var articlecate = await DB.find('articlecate',{"pid":"0"});
    await ctx.render('admin/articlecate/edit',{
        list:result[0],
        catelist:articlecate
    })
})




module.exports=router.routes();