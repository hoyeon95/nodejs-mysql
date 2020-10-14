var sanitizeHtml = require('sanitize-html');

module.exports = {
  HTML:function(title, list, body, control){
    return `
    <!doctype html>
    <html>
    <head>
      <title>WEB1 - ${title}</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${control}
      ${body}
    </body>
    </html>
    `;
  },list:function(topics){
    var list = '<ul>';
    var i = 0;
    while(i < topics.length){
      list += `<li><a href="/?id=${topics[i].id}">${sanitizeHtml(topics[i].title)}</a></li>`;
      i++;
    }
    list = list+'</ul>';
    return list;
  },tag:function(authors, author_id){
    var tag = '';
    var i = 0;
    while(i < authors.length){
      var selected = '';
      if(authors[i].id === author_id){
        selected = ' selected';
      }
      tag += `<option value="${authors[i].id}"${selected}>${sanitizeHtml(authors[i].name)}</option>`
      i++;
    }
    return `
    <select name="author">
    ${tag}
    </select>`;
  }, HTML_author:function(list, table, body){
    return `
    <!doctype html>
    <html>
    <head>
      <title>Author</title>
      <meta charset="utf-8">
    </head>
    <body>
      <h1><a href="/">WEB</a></h1>
      <a href="/author">author</a>
      ${list}
      ${table}
      ${body}
    </body>
    </html>
    `;
  }, table:function(authors){
    var list = "";
    var i = 0;
    while(i < authors.length){
      list += `<tr>
               <td>${sanitizeHtml(authors[i].name)}</td>
               <td>${sanitizeHtml(authors[i].profile)}</td>
               <td><a href="/author/update?id=${authors[i].id}">update</a></td>
               <td><form action="/author/delete_process" method="post">
               <input type="hidden" name="id" value="${authors[i].id}">
               <input type="submit" value="delete">
               </form></td>
               </tr>`
      i++;
    }
    return `
    <!doctype html>
    <html>
    <meta charset="utf-8">
    <head>
      <title>table</title>
    </head>
    <body>
      <table border = "1">
        <th>title</th>
        <th>profile</th>
        <th>update</th>
        <th>delete</th>
        ${list}
      </table>
    </body>
    </html>
    `;
  }
}