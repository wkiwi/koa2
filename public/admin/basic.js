/*
* @Author: Wkiwi
* @Date:   2018-08-09 18:11:33
* @Last Modified by:   Wkiwi
* @Last Modified time: 2018-08-13 16:47:01
*/
$(function(){
    app.confirmDelete();
})

var app={

    toggle:function(el,collectionName,attr,id){

        $.get('/admin/changeStatus',{collectionName:collectionName,attr:attr,id:id},function(data){
         if(data.success){
            if(el.src.indexOf('yes')!=-1){
                    el.src='/admin/images/no.gif';
                }else{
                    el.src='/admin/images/yes.gif';
                }
            }
        })
    },
    confirmDelete:function(){
        console.log(123)
        $(".delete").click(function(){
            console.log(123)
            var flag=confirm("你确定要删除吗？")
            return flag;
        })
    },
    changeSort:function(el,collectionName,id){
        var sortValue=el.value;
        $.get('/admin/changeSort',{collectionName:collectionName,id:id,sortValue:sortValue},function(data){
            console.log(data)
        })
    }

}