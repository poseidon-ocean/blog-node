var db = require("./db");
var markdown = require("markdown").markdown;


function Post(post){
    this.author = post.author;
    this.title = post.title;
    this.post = post.post;
};

var insertSQL = 'INSERT INTO n_post(author,title,post) VALUES(?,?,?)';
var selectSQL = "select p.author,p.title,p.post, date_format(p.time+'', '%Y-%m-%d %H:%m:%S') as time from n_post p";

//存储发布内容
Post.prototype.save = function(callback){

    //需要存入数据库的数据
    var params = [this.author,this.title,this.post];
    //执行SQL语句
    db.getConnection(function(err,conn){
        if (err) {
            console.log('[query] - :'+err);
            conn.release();
            return callback(err);  //发生异常时  返回错误信息
        }
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
Post.get = function(post,callback){

    //查询条件
    var params = [];
    //执行SQL语句
    db.getConnection(function(err,conn){
        if (err) {
            console.log('[query] - :'+err);
            conn.release();
            return callback(err);  //发生异常时  返回错误信息
        }
        conn.query(selectSQL,params, function(err,posts) {

            if (err) {
                console.log('[query] - :'+err);
                conn.release();
                return callback(err);  //发生异常时  返回错误信息
            }
            console.log('--------------------------start----------------------------');
            console.log('result:',posts);
            console.log('--------------------------end----------------------------');
            conn.release();
            //解析markdown为html
           /*
           *  posts.forEach(function(doc){
            doc.post = markdown.toHTML(doc.post);
            });*/
            callback(null,posts);
        });

    });

}

module.exports = Post;





