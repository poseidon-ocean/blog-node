//关于原型链的测试


function User(user){
    this.username = user.username;
    this.email = user.email;
}

User.prototype.log = function(){
    console.log('username:'+this.username+'  email:'+this.email);
}

User.log = function(user){
    console.log('username:'+user.username+'  email:'+user.email);
}

User.log({username:'pipi',email:'111111'});


