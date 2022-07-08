// 引入express
const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./router/user')
const cors = require('cors')
const app = new express()
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))
// 路由
app.use(routes)

app.listen(3000,()=>{
  console.log('server listen at 3000');
})