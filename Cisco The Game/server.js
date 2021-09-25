var http = require('http');
var Url = require('url');
var fs = require('fs');

function badReq(res,info)
{
	res.writeHead(400, {'Content-Type': 'text/plain'});
	res.end(info || 'Bad request');
}
function notFound(res)
{
	res.writeHead(404);
	res.end();
}

var allowedExtensions = {"js":true,'html':true,'css':true,'png':true,'gif':true,'jpg':true,'txt':true,'ico':true};
var contentTypes = {"js":"text/javascript","html":"text/html","css":"text/css","png":"image/png","gif":"image/gif","jpg":"image/jpeg"};
var reqTraverse = /\.\./;
var reqExt = /\.([^.]+)$/;
http.createServer(function (req, res) {
	var urlPath = Url.parse(req.url).pathname;
	var extRes = reqExt.exec(urlPath);
	var c1 = !reqTraverse.test(urlPath);
	var c2 = !!extRes && allowedExtensions[extRes[1]];
	if (c1 && c2)
	{
		fs.readFile(urlPath.substr(1),function (err, data) {
			if (err)
				notFound(res);
			else
			{
				var headers = {};
				if (contentTypes[extRes[1]])
					headers['Content-Type'] = contentTypes[extRes[1]];
				res.writeHead(200,headers);
				res.end(data);
			}
		});
	} else
	{
		badReq(res);
	}
}).listen( 7777, process.env.OPENSHIFT_NODEJS_IP );

console.log('Server running on port ' + 7777);