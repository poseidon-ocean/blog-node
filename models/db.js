//配置mysql的连接池
var mysql = require('mysql');

//创建一个connection
var connection = mysql.createConnection({
    host: '127.0.0.1',       //主机
    user     : 'root',               //MySQL认证用户名
    password :'root',        //MySQL认证用户密码
    port: '3306',                   //端口号
    database : 'ndb'  //数据库
});


function open(){
    //打开连接
    connection.connect(function(err){
        if(err){
            console.log('[query] - :'+err);
            return;  //发生异常时  返回错误信息
        }
        console.log('[connection connect]  succeed!');
    });
}

function close(){
    //关闭connection
    connection.end(function(err){
        if(err){
            return;  //发生异常时  返回错误信息
        }
        console.log('[connection end] succeed!');
    });
}

/*
*
* var db = {
 connection : connection,
 open : open,
 close : close
 }*/


var db = mysql.createPool({
    host: '127.0.0.1',       //主机
    user     : 'root',               //MySQL认证用户名
    password :'root',        //MySQL认证用户密码
    port: '3306',                   //端口号
    database : 'ndb'  //数据库
});

module.exports = db;
