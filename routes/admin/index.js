/*
* @Author: Wkiwi
* @Date:   2018-08-08 19:12:54
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-13 16:54:26
*/

var router=require('koa-router')();

const DB=require('../../model/DB.js');

router.get('/',async(ctx)=>{
    //ctx.body='用户管理';
    await ctx.render('admin/index')
})
router.get('/changeStatus',async(ctx)=>{
    //ctx.body={"message":"更新成功","success":true};
    //await ctx.render('admin/user/add')
    var collectionName=ctx.query.collectionName;//数据库表
    var attr=ctx.query.attr;//属性
    var id=ctx.query.id;//id
    var data=await DB.find(collectionName,{"_id":DB.getObjectId(id)} )
    //console.log(data)
    if(data.length>0){
        if(data[0][attr]==1){
            var json = { /*es6 属性名表达式*/
                [attr]: 0
                };
        }else{
            var json = {
                [attr]: 1
            };
        }
        let updateResult=await DB.update(collectionName,{"_id":DB.getObjectId(id)},json);
        if(updateResult){
                ctx.body={"message":'更新成功',"success":true};
        }else{
            ctx.body={"message":"更新失败","success":false}
        }
    }else{
        ctx.body={"message":'更新失败,参数错误',"success":false};
    }
})
router.get('/changeSort',async(ctx)=>{

    var collectionName=ctx.query.collectionName;//数据库表
    var sortValue=ctx.query.sortValue;//属性
    var id=ctx.query.id;//id
    var data=await DB.find(collectionName,{"_id":DB.getObjectId(id)} )

    var json={
        sort:sortValue
    }
    let updateResult=await DB.update(collectionName,{"_id":DB.getObjectId(id)},json);
    if(updateResult){
            ctx.body={"message":'更新成功',"success":true};
    }else{
        ctx.body={"message":"更新失败","success":false}
    }

})
router.get('/remove',async(ctx)=>{
    try{
        var collection=ctx.query.collection;//数据库表
        var id=ctx.query.id;//删除的idid
        console.log(collection)
        console.log(id)
        var result=await DB.remove(collection,{"_id":DB.getObjectId(id)} )
        ctx.redirect(ctx.state.G.prevPage)
    }catch(err){
        ctx.redirect(ctx.state.G.prevPage)
    }
})


module.exports=router.routes();