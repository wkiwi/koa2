/*
* @Author: Wkiwi
* @Date:   2018-08-14 11:14:29
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-14 14:08:14
*/
/*db.setting.insert({"site_logo":"","site_title":"","site_keywords":"","site_description":"","site_icp":"","site_qq":"","site_tel":"","site_address":"","site_status":"","add_time":""})
    */
var router=require('koa-router')();

var DB=require('../../model/db.js');

var tools=require('../../model/tools.js');


router.get('/',async(ctx)=>{
   //ctx.body="系统设置"
   var result=await DB.find("setting",{})
    await ctx.render("admin/setting/index",{
        list:result[0]
    })

})
router.post('/doEdit',tools.multer().single('site_logo'),async(ctx)=>{
   //ctx.body="系统设置"
    let site_logo=ctx.req.file? ctx.req.file.path.substr(7) :'';
    let site_title=ctx.req.body.site_title;
    let site_keywords=ctx.req.body.site_keywords;
    let site_description=ctx.req.body.site_description;
    let site_icp=ctx.req.body.site_icp;
    let site_qq=ctx.req.body.site_qq;
    let site_tel=ctx.req.body.site_tel;
    let site_address=ctx.req.body.site_address;
    let site_status=ctx.req.body.site_status;
    let add_time=tools.getTime();
    if(site_logo){
        var json={
            site_logo,site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time
        }
    }else{
        var json={
            site_title,site_keywords,site_description,site_icp,site_qq,site_tel,site_address,site_status,add_time
        }
    }
    await DB.update("setting",{},json)
     //跳转
    ctx.redirect(ctx.state.__HOST__+'/admin/setting');

})

module.exports=router.routes();