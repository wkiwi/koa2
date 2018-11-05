/*
* @Author: Wkiwi
* @Date:   2018-08-08 17:48:47
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-15 18:38:06
*/

var router=require('koa-router')();
var DB=require('../model/db.js');

router.get('/',async(ctx)=>{
    ctx.body={'title':'这是一个api接口'};
})

router.get('/catelist',async(ctx)=>{
    var result=await DB.find("articlecate",{})

    ctx.body={
        result:result
    }
})

router.get('/newslist',async(ctx)=>{
    var page=ctx.query.page||1;
    var pageSize=ctx.query.pageSize;
    var result=await DB.find("article",{},{},{
        page:page,
        pageSize:pageSize
    })
    ctx.body={
        result:result
    }
})

module.exports=router.routes();