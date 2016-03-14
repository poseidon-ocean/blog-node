//var db = require("./db");

var mysql = require('mysql');

function User(user){
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
};



var insertSQL = 'insert into n_user(username,password,email) values(?,?,?)';
var selectSQL = 'select * from n_user u where u.username =?';
var deleteSQL = 'delete from n_user';
var updateSQL = 'update n_user set name="conan update"  where name="conan"';

//创建一个connection
var connection = mysql.createConnection({
    host: '127.0.0.1',       //主机
    user     : 'root',               //MySQL认证用户名
    password :'root',        //MySQL认证用户密码
    port: '3306',                   //端口号
    database : 'ndb'  //数据库
});


//存储用户信息
User.prototype.save = function(callback){
    open();

    var user = {};
    //需要存入数据库的文档
    var sparams = [this.username];
    //执行SQL语句
    connection.query(selectSQL,sparams, function(err,result) {

        if (err) {
            console.log('[query] - :'+err);
            return callback(err);  //发生异常时  返回错误信息
        }
        console.log('--------------------------start----------------------------');
        console.log('result:',result);
        console.log('--------------------------end----------------------------');
        user = result;
    });

    if(user.length){
        console.log('[query] - :用户已经存在');
        return callback('1');  //发生异常时  返回错误信息
    }
    //需要存入数据库的文档
    var params = [this.username,this.password,this.email];
    //执行SQL语句
    connection.query(insertSQL,params, function(err,result) {

        if (err) {
            console.log('[query] - :'+err);
            return callback(err);  //发生异常时  返回错误信息
        }
        console.log('--------------------------INSERT----------------------------');
        console.log('INSERT ID:',result);
        return callback(null,result);
        console.log('--------------------------INSERT----------------------------');
    });

    close();
}


//获取用户信息
User.get = function(username,callback){

    open();
    //需要存入数据库的文档
    var params = [username];
    //执行SQL语句
    connection.query(selectSQL,params, function(err,user) {

        if (err) {
            console.log('[query] - :'+err);
            return callback(err);  //发生异常时  返回错误信息
        }
        console.log('--------------------------start----------------------------');
        console.log('result:',user);
        console.log('--------------------------end----------------------------');
        callback(null,user);
    });
    close();
}


//获取用户信息
User.prototype.del = function(callback){
    open();
    //执行SQL语句
    connection.query(deleteSQL, function(err,result) {

        if (err) {
            console.log('[query] - :'+err);
            return callback(err);  //发生异常时  返回错误信息
        }
        console.log('--------------------------INSERT----------------------------');
        console.log('deleteSQL ID:',result);
        return callback(null,result);
        console.log('--------------------------INSERT----------------------------');
    });
    close();
}


function open(){
    //打开连接
    connection.connect(function(err){
        if(err){
            console.log('[query] - :'+err);
            return callback(err);  //发生异常时  返回错误信息
        }
        console.log('[connection connect]  succeed!');
    });
}

function close(){
    //关闭connection
    connection.end(function(err){
        if(err){
            return callback(err);  //发生异常时  返回错误信息
        }
        console.log('[connection end] succeed!');
    });
}

module.exports = User;








