var mysql  = require('mysql');  //调用MySQL模块
//创建一个connection
var connection = mysql.createConnection({

    host: '127.0.0.1',       //主机
    user     : 'root',               //MySQL认证用户名
    password :'root',        //MySQL认证用户密码
    port: '3306',                   //端口号
    database : 'ndb'  //数据库
});

//创建一个connection
connection.connect(function(err){
    if(err){
        console.log('[query] - :'+err);
        return;
    }
    console.log('[connection connect]  succeed!');
});




var selectSQL = 'select * from n_user u where u.username =?';
//需要存入数据库的文档
var params = ['keke'];
//执行SQL语句
connection.query(selectSQL,params, function(err,user) {

    if (err) {
        console.log('[query] - :'+err);
        return callback(err);  //发生异常时  返回错误信息
    }
    console.log('--------------------------INSERT----------------------------');
    console.log('query ID:',user);
    //return callback(null,user);
    console.log('--------------------------INSERT----------------------------');
});

//关闭connection
connection.end(function(err){
    if(err){
        return;
    }
    console.log('[connection end] succeed!');
});