# koa returning 'Not Found'

最近在看koa，用koa+mysql搭了个简单demo环境后准备试一下，然后就一直返回Not Found，把数据库相关操作注释掉之后又好了，最后发现原因是logger中间件里的`next()`前没加`return` 。。。[喷水]

## Code

```js
const Koa = require('koa');
const route = require('koa-route');
const cors = require('koa2-cors');
const knex = require('knex');

const app = new Koa();
const mysql = knex({
  client: 'mysql',
  connection: {
    host: 'localhost',
    user: 'root',
    password: '***',
    database: 'test'
  },
  debug: true,
  pool: {
    min: 0,
    max: 7
  },
  acquireConnectionTimeout: 10000,
  migrations: {
    tableName: 'migrations'
  }
});

const getCodeById = id => mysql.select().table('test').where('a_tid', id);

const logger = (ctx, next) => {
  console.log(`${new Date().toLocaleString()} ${ctx.request.method} ${ctx.request.url}`);
  return next(); // **前边要加return**
}

const test = async ctx => {
  let res = {};
  try {
    res.data = await getCodeById(1);
    res.status = 1;
    res.msg = 'SUCCESS';
  } catch (error) {
    console.log('error: ', error);
    res.data = [];
    res.status = 0;
    res.msg = 'FAIL';
  }
  ctx.response.body = res;
};

app.use(cors());
app.use(logger);
app.use(route.get('/test', test));
app.listen(3000);
```

后来发现已经有现成的koa-logger了[#允悲]wwww

## Answers from stackoverflow

> **It seems that if you want to use a common function as middleware, you have to return the next function**.

### Why common function as middlerware have to return the next function

> **I think it's because you have to return a promise from your middleware to work with other middlewares. The next return a promise, as you return it, you return a promise. See this issue for more discussions github.com/koajs/koa/issues/997.**

### See more：

[nodejs(koa):Can't set headers after they are sent](https://stackoverflow.com/questions/45134394/nodejskoacant-set-headers-after-they-are-sent)

[koa2+koa-router+mysql keep returning 'Not Found'](https://stackoverflow.com/questions/43389601/koa2koa-routermysql-keep-returning-not-found#)
