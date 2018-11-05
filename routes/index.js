/*
* @Author: Wkiwi
* @Date:   2018-08-08 17:48:47
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-15 17:43:53
*/

var router=require('koa-router')();
var DB=require('../model/db.js');
var url= require('url');

router.use(async(ctx,next)=>{
    // 导航条数据
   var navResult=await DB.find("nav",{$or:[{"status":1},{"status":'1'}]},{},{
        sortJson:{'sort':1}
   })
   var pathname=url.parse(ctx.request.url).pathname;
    //全局配置变量
    ctx.state.nav=navResult;
    ctx.state.pathname=pathname;
    var setting=await DB.find("setting",{})
    ctx.state.setting=setting[0];
    var links=await DB.find("link",{})
    ctx.state.links=links;
    console.log(links)
    await next()
})

router.get('/',async(ctx)=>{
   // ctx.body='前台首页';

   //轮播图数据
   var focusResult=await DB.find("focus",{$or:[{"status":1},{"status":'1'}]},{},{
        sortJson:{'sort':1}
   })
    ctx.render('default/index',{
        focus:focusResult
    })
})
router.get('/service',async(ctx)=>{
    //ctx.body='服务';
    var serviceCate=await DB.find('articlecate',{"title":"开发服务"});
    var serviceCateId=serviceCate[0]._id;//分类的id 5b6d40b81047632ddc5d3ef5
    serviceCateId=serviceCateId.toString()//将数字类型pid装换为字符串id方可查询
    //console.log(serviceCateId);

    var json={"pid":serviceCateId}
    //console.log(json)
    var serviceList = await DB.find('article',json);
    //console.log(serviceList);
    ctx.render('default/service',{
        serviceList:serviceList
    })
})
router.get('/content/:id',async(ctx)=>{
    //ctx.body='详情页';
    var id=ctx.params.id;
    var content=await DB.find('article',{"_id":DB.getObjectId(id)})
    var cateResult=await DB.find('articlecate',{"_id":DB.getObjectId(content[0].pid)});
    if(cateResult[0].pid!=0){
        var parentCateResult=await DB.find('articlecate',{"_id":DB.getObjectId(cateResult[0].pid)});
        console.log(parentCateResult[0].title)
        var navResult=await DB.find('nav',{$or:[{"title":cateResult[0].title},{"title":parentCateResult[0].title}]});
        console.log(navResult)
    }else{
        var navResult=await DB.find('nav',{"title":cateResult[0].title});
    }
    if(navResult.length>0){
        ctx.state.pathname=navResult[0]['url'];
    }else{
        ctx.state.pathname='/';
    }

    ctx.render('default/content',{
        list:content[0]
    })

})
router.get('/about',async(ctx)=>{
    //ctx.body='关于我们';
    ctx.render('default/about')
})
router.get('/case',async(ctx)=>{
    var pid=ctx.query.pid;
    console.log(pid)
    var page=ctx.query.page||1;
    var pageSize=6;
    //ctx.body='案例';
    //获取成功案例下边的子分类
    var caseCate=await DB.find('articlecate',{"title":"成功案例"});
    var caseCateId=caseCate[0]._id;//分类的id 5b6d40b81047632ddc5d3ef5
    caseCateId=caseCateId.toString()//将数字类型pid装换为字符串id方可查询
    var json={"pid":caseCateId}
    var cateResult = await DB.find('articlecate',json);
    if(pid){
        var articleResult=await DB.find('article',{'pid':pid},{},{
            page:page,
            pageSize:pageSize
        });
        var articleNumber=await DB.count('article',{'pid':pid});
    }else{
        var arr=[];
        for(var i=0;i<cateResult.length;i++){
            arr.push(cateResult[i]._id.toString())
        }
        console.log(arr)
        var articleResult=await DB.find('article',{'pid':{$in:arr}},{},{
            page:page,
            pageSize:pageSize
        });
        var articleNumber=await DB.count('article',{'pid':{$in:arr}});
        console.log(articleResult)
    }
    ctx.render('default/case',{
        cateList:cateResult,
        articleList:articleResult,
        pid:pid,
        totalPages:Math.ceil(articleNumber/pageSize),
        page:page

    })
})
router.get('/news',async(ctx)=>{
    var pid=ctx.query.pid;
    console.log(pid)
    var page=ctx.query.page||1;
    var pageSize=6;
    //ctx.body='案例';
    //获取成功案例下边的子分类
    var caseCate=await DB.find('articlecate',{"title":"新闻咨询"});
    var caseCateId=caseCate[0]._id;//分类的id 5b6d40b81047632ddc5d3ef5
    caseCateId=caseCateId.toString()//将数字类型pid装换为字符串id方可查询
    var json={"pid":caseCateId}
    var cateResult = await DB.find('articlecate',json);
    if(pid){
        var articleResult=await DB.find('article',{'pid':pid},{},{
            page:page,
            pageSize:pageSize
        });
        var articleNumber=await DB.count('article',{'pid':pid});
    }else{
        var arr=[];
        for(var i=0;i<cateResult.length;i++){
            arr.push(cateResult[i]._id.toString())
        }
        console.log(arr)
        var articleResult=await DB.find('article',{'pid':{$in:arr}},{},{
            page:page,
            pageSize:pageSize
        });
        var articleNumber=await DB.count('article',{'pid':{$in:arr}});
        console.log(articleResult)
    }
    ctx.render('default/news',{
        cateList:cateResult,
        articleList:articleResult,
        pid:pid,
        totalPages:Math.ceil(articleNumber/pageSize),
        page:page

    })
})
router.get('/connect',async(ctx)=>{
    //ctx.body='联系我们';
    ctx.render('default/connect')
})

module.exports=router.routes();