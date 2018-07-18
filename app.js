const { handler } = require('./handler')
const http = require('http')
const { PORT = 3000 } = process.env

const DOMAIN_RE = /\b((?=[a-z0-9-]{1,63}\.)(xn--)?[a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,63}\b/

http.createServer((req, res) => {
  let url = require('url').parse(req.url)
  let { pathname } = url
  let id = pathname.slice(1, pathname.length)
  if (
    pathname === '/' ||
    /favicon\.\w{2,4}/.test(id) ||
    !DOMAIN_RE.test(id)
  ) {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.statusCode = 200
    res.end(JSON.stringify({}))
    return
  }
  handler({ pathParameters: { id } }, {}, (err, data) => {
    res.setHeader('Content-Type', 'application/json')
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.statusCode = data.statusCode
    res.end(data.body)
  })
}).listen(PORT)