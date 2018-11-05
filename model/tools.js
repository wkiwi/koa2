/*
* @Author: Wkiwi
* @Date:   2018-08-09 11:05:04
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-14 10:13:02
*/

var md5 = require('md5');
const multer = require('koa-multer');
const file= require('file');

let tools={
    multer(){
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
        var upload=multer({storage:storage});
        return upload;
    },
    md5(str){
        return md5(str);
    },
    cateToList(data){
        //console.log(data)
        //获取一级分类
        var firstArr=[];
        for(var i=0;i<data.length;i++){
            if(data[i].pid=='0'){
                firstArr.push(data[i])
            }
        }
        //获取二级分类
        for(var i=0;i<firstArr.length;i++){
            firstArr[i].list=[];
            for(var j=0;j<data.length;j++){
                if(firstArr[i]._id==data[j].pid){
                    firstArr[i].list.push(data[j]);
                }
            }
        }
        return firstArr;
    },
    getTime(){
        return new Date();
    }

}
module.exports=tools;