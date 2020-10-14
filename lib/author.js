var url = require('url');
var qs = require('querystring');
var db = require('./db');
var template = require('./template.js');
var sanitizeHtml = require('sanitize-html');

exports.index = function(request, response){
    db.query(`SELECT * FROM author`, function(error, authors){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic`, function(error2, topics){
            if(error2){
                throw error2;
            }
            var list = template.list(topics);
            var table = template.table(authors);
            var html = template.HTML_author(list,
            `<h2>Author List</h2>${table}`,
            `<form action="/author/create_process" method="post">
            <p><input type="text" name="name" placeholder="title"></p>
            <p>
                <textarea name="profile" placeholder="profile"></textarea>
            </p>
            <p>
                <input type="submit" value="create">
            </p>
            </form>`
            );
            response.writeHead(200);
            response.end(html);
        });
    })
}
exports.create_process = function(request, response){
    var body = '';
      request.on('data', function(data){
          body = body + data;
      });
      request.on('end', function(){
          var post = qs.parse(body);
          console.log(post);
          db.query(`INSERT INTO author (name, profile) VALUES(?, ?)`,
            [post.name, post.profile],
            function(error, result){
              if(error){
                throw error;
              }
              response.writeHead(302, {Location: `/author`});
              response.end();  
            })
      });
}
exports.update = function(request, response){
    var _url = request.url;
    var queryData = url.parse(_url, true).query;
    db.query(`SELECT * FROM author`, function(error, authors){
        if(error){
          throw error;
        }
        db.query(`SELECT * FROM topic`, function(error2, topics){
            if(error2){
                throw error2;
            }
            db.query(`SELECT * FROM author WHERE id=?`, [queryData.id], function(error3, author){
                var list = template.list(topics);
                if(error3){
                    throw error3;
                }
                var table = template.table(authors);
                var html = template.HTML_author(list,
                `<h2>Author List</h2>${table}`,
                `<form action="/author/update_process" method="post">
                <input type="hidden" name="id" value="${author[0].id}">
                <p><input type="text" name="name" placeholder="title" value="${sanitizeHtml(author[0].name)}"></p>
                <p>
                    <textarea name="profile" placeholder="profile">${sanitizeHtml(author[0].profile)}</textarea>
                </p>
                <p>
                    <input type="submit" value="update">
                </p>
                </form>`
                );
                response.writeHead(200);
                response.end(html);
            });
        });
    });
}
exports.update_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
  
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`UPDATE author SET name = ?, profile = ? WHERE id = ?`, 
          [post.name, post.profile, post.id],
          function(error, result){
            if(error){
              throw error;
            }
            response.writeHead(302, {Location: `/author`});
            response.end();  
          })
    });
}
exports.delete_process = function(request, response){
    var body = '';
    request.on('data', function(data){
        body = body + data;
    });
    request.on('end', function(){
        var post = qs.parse(body);
        db.query(`DELETE FROM topic WHERE author_id=?`, [post.id],
        function(error, result){
            if(error){
                throw error;
            }
            db.query(`DELETE FROM author WHERE id = ?`, [post.id],
            function(error2, result){
              if(error2){
                throw error2;
              }
              response.writeHead(302, {Location: `/author`});
              response.end();
            })
        });    
    });
}