/*
* @Author: Wkiwi
* @Date:   2018-08-10 17:24:21
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-15 15:28:00
*/
/*
    for(var i=0;i<100;i++){
        db.article.insert({"title":"node教程"+i,"articlecate":"0","last_time":"","desc":"","hot":"","tuijian":"","status":"1"})
    }

 */
var router=require('koa-router')();

var DB=require('../../model/db.js');
var tools=require('../../model/tools.js');

const multer = require('koa-multer');
const file= require('file');
//配置
var storage = multer.diskStorage({
        //文件保存路径
    destination: function (req, file, cb) {
        cb(null, 'public/upload') //注意路径必须存在
    },
    //修改文件名称
    filename: function (req, file, cb) {
        var fileFormat = (file.originalname).split(".");//获取后缀名
        cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
    }
})
var upload=multer({storage:storage})

router.get('/',async(ctx)=>{
    var page=ctx.query.page||1;
    var pageSize=10;
    var count = await DB.count('article',{});//查询总页数
    var result = await DB.find('article',{},{},{
        page:page,
        pageSize:pageSize,
        sortJson:{
            'add_time':-1
        }
    })
    //tools.cateToList(result);格式化数据
    console.log(result)
    await ctx.render('admin/article/index',{
        list:result,
        totalPages:Math.ceil(count/pageSize),
        page:page
    })

})
router.get('/add',async(ctx)=>{
    //查询分类
    var catelist = await DB.find('articlecate',{});
    //console.log(catelist)
    await ctx.render('admin/article/add',{
        catelist:tools.cateToList(catelist)
    })
})
router.post('/doAdd',upload.single('img_url'),async(ctx)=>{
    //  ctx.body = {
    //     filename: ctx.req.file ? ctx.req.file.filename : "",//返回文件名
    //     body:ctx.req.body
    // }
    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim();
    let author=ctx.req.body.author.trim();
    let pic=ctx.req.body.author;
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let add_time=tools.getTime();
    //属性的简写
    let json={
        pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url,add_time
    }

    var result=DB.insert('article',json);

    //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/article');
})

router.get('/edit',async(ctx)=>{
    //查询分类
    var id=ctx.query.id;
    //分类
    var catelist = await DB.find('articlecate',{});
    //当前要编辑的数据
    //console.log(tools.cateToList(catelist))
    var articlelist = await DB.find('article',{"_id":DB.getObjectId(id)});
    //console.log(articlelist)
    await ctx.render('admin/article/edit',{
        catelist:tools.cateToList(catelist),
        list:articlelist[0],
        prevPage:ctx.state.G.prevPage   /*保存上一页的值*/
    })
})

router.post('/doEdit',upload.single('img_url'),async(ctx)=>{
    let prevPage=ctx.req.body.prevPage || '';  /*上一页的地址*/
    let id=ctx.req.body.id;
    let pid=ctx.req.body.pid;
    let catename=ctx.req.body.catename.trim();
    let title=ctx.req.body.title.trim();
    let author=ctx.req.body.author.trim();
    let pic=ctx.req.body.author;
    let status=ctx.req.body.status;
    let is_best=ctx.req.body.is_best;
    let is_hot=ctx.req.body.is_hot;
    let is_new=ctx.req.body.is_new;
    let keywords=ctx.req.body.keywords;
    let description=ctx.req.body.description || '';
    let content=ctx.req.body.content ||'';
    let img_url=ctx.req.file? ctx.req.file.path.substr(7) :'';
    //属性的简写
    if(img_url){
        var  json={
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content,img_url
        }
    }else{
        var  json={
            pid,catename,title,author,status,is_best,is_hot,is_new,keywords,description,content
        }
    }
    console.log(id)
    console.log(json)
    DB.update('article',{"_id":DB.getObjectId(id)},json);

    //跳转
    if(prevPage){
        ctx.redirect(prevPage)
    }else{
        ctx.redirect(ctx.state.__HOST__+'/admin/article');
    }
})

module.exports=router.routes();