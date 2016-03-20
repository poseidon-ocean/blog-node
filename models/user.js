var db = require("./db");

function User(user){
    this.username = user.username;
    this.password = user.password;
    this.email = user.email;
};



var insertSQL = 'insert into n_user(username,password,email) values(?,?,?)';
var selectSQL = 'select * from n_user u where u.username =?';
var deleteSQL = 'delete from n_user';
//var updateSQL = 'update n_user set name="conan update"  where name="conan"';


//存储用户信息
User.prototype.save = function(callback){

    var user;
    //需要存入数据库的数据
    var sparams = [this.username];
    //执行SQL语句
    db.getConnection(function(err,conn){
        if (err){
            console.log("POOL ==> " + err);
            conn.release();
        }

        conn.query(selectSQL,sparams, function(err,result){
            if (err) {
                console.log('[query] - :'+err);
                conn.release();
                return callback(err);  //发生异常时  返回错误信息
            }
            console.log("SELECT ==> ");
            console.log('--------------------------start----------------------------');
            console.log('result:',result);
            console.log('--------------------------end----------------------------');
            user = result;

            if(user.length){
                console.log('[query] - :用户已经存在');
                conn.release();
                return callback('1');  //发生异常时  返回错误信息
            }
        });
        //需要存入数据库的数据
        var params = [this.username,this.password,this.email];
        //执行SQL语句
        conn.query(insertSQL,params, function(err,result) {

            if (err) {
                console.log('[query] - :'+err);
                conn.release();
                return callback(err);  //发生异常时  返回错误信息
            }
            console.log('--------------------------INSERT----------------------------');
            console.log('INSERT ID:',result);
            conn.release();
            return callback(null,result);
        });
    });
}


//获取用户信息
User.get = function(username,callback){

    //需要存入数据库的文档
    var params = [username];
    //执行SQL语句
    db.getConnection(function(err,conn){
        if (err) {
            console.log('[query] - :'+err);
            conn.release();
            return callback(err);  //发生异常时  返回错误信息
        }
        conn.query(selectSQL,params, function(err,user) {

            if (err) {
                console.log('[query] - :'+err);
                conn.release();
                return callback(err);  //发生异常时  返回错误信息
            }
            console.log('--------------------------start----------------------------');
            console.log('result:',user);
            console.log('--------------------------end----------------------------');
            conn.release();
            callback(null,user);
        });
    });
}


module.exports = User;








