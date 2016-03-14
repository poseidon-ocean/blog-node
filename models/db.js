var settings = require('../settings'),
    Db = require('mysql').Db,
    Connection = require('mysql').Connection,
    Server = require('mysql').Server;

//设置数据库名、地址、端口
module.exports = new Db(settings.db,new Server(settings.host,Connection.DEFAULT_PORT),{save:true});