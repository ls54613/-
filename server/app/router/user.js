const express = require('express')
const {User, Use,Food,Shop,Order,Recommdend}= require('../model/User')
const router = express.Router()

//获取用户列表
router.get('/dashboard',async(req,res)=>{
  const date = JSON.parse(req.query.data)
  const list = await Use.find()
  res.send({data:{list,date},code:200})
})
// 添加用户列表
router.post('/adduse',async(req,res)=>{
  // console.log(req.body);
  const use = await Use.findOne({name:req.body.nickName})
  if(use){return res.status(409).send('该用户已存在')}
  const newUse = await new Use(req.body).save()
  res.send({data:newUse, code:200})
})
// 删除用户
router.post('/dashboard',(req,res)=>{
   Use.deleteOne({_id:req.body.id}).then(()=>{
    // console.log(ret);
    res.send({code:200})
  })
})

// 获取或者删除菜品列表
router.get('/foods',async(req,res)=>{
  const date = JSON.parse(req.query.data)
  // 判断传过来的参数中有没有id
  // 删除数据
  if(date.id){
    Food.deleteOne({_id:date.id}).then(()=>{
      res.send({code:200})
    })
  }
  // 判断所属店铺是否存在
  else if(date.shop){
    const shop= await Shop.find()
    // 如果已存在店铺则返回存在店铺的数组
    const falg = shop.filter((value)=>{
      return (value.shop==date.shop)
    })
    // 将数组的长度返回
    const L = falg.length
    res.send({data:L,code:200})
  }
  // 获取数据
  else{
    const list = await Food.find()
    res.send({data:{list,date},code:200})
  }
})

// 添加或者修改菜品列表
router.post('/foods',async(req,res)=>{
  // console.log(req.body);
  if(req.body._id){
    Food.findByIdAndUpdate(req.body._id,req.body).then(async()=>{
      const arr = await Food.find()
      res.send({data:arr,code:200})
    })
  }else{
    const food = await Food.findOne({name:req.body.name})
  if(food){return res.status(409).send('该菜品已存在')}
  await new Food(req.body).save()
  const arr = await Food.find()
  res.send({data:arr, code:200})
  }
})

// 获取或者删除店铺列表
router.get('/shops',async(req,res)=>{
  const date = JSON.parse(req.query.data)
  // 判断传过来的参数中有没有id
  // 删除数据
  if(date.id){
    Shop.deleteOne({_id:date.id}).then(()=>{
      res.send({code:200})
    })
  }
  // 获取数据
  else{
    const list = await Shop.find()
    const arr = await Food.find()
    // 遍历店铺表
    list.forEach((item)=>{
      // 遍历菜品表
    arr.forEach((a)=>{
      // 如果菜品表的店铺名和店铺的店铺名一样
      if(item.shop==a.shop){
        // 将菜品添加到店铺的菜品列表中
      item.vegList.push({name:a.name})
      // 将重复的菜品去除
      for (var i = 0; i < item.vegList.length; i++) {
        for (var j = i + 1; j < item.vegList.length; j++) {
          if (item.vegList[i].name === item.vegList[j].name) {
            item.vegList.splice(j, 1);
            j = j - 1;
          }
        }
      }
      }
    })
    })
    res.send({data:{list,date},code:200})
  }
})

// 添加或者修改店铺列表
router.post('/shops',async(req,res)=>{
  if(req.body._id){
    Shop.findByIdAndUpdate(req.body._id,req.body).then(async()=>{
      const arr =  await Shop.find()
      res.send({data:arr,code:200})
    })
  }else{
  const shop = await Shop.findOne({shop:req.body.shop})
  if(shop){return res.status(409).send('该店铺已存在')}
  await new Shop(req.body).save()
  const arr = await Shop.find()
  res.send({data:arr, code:200})
  }
})

// 获取或者删除订单
router.get('/orders',async(req,res)=>{
  const date = JSON.parse(req.query.data)
  if(date.id){
    Order.deleteOne({_id:date.id}).then(()=>{
      res.send({code:200})
    })
  }
  // 获取数据
  else{
    const list = await Order.find()
    res.send({data:{list,date},code:200})
  }
})

// 改变订单状态
router.post('/orders',(req,res)=>{
  // console.log(req.body);
  Order.findByIdAndUpdate(req.body.id,{pro:req.body.pro}).then(()=>{
    res.send({code:200})
  })
})

// 获取评论
router.get('/recommend',async(req,res)=>{
  const date = JSON.parse(req.query.data)
  const list = await Recommdend.find()
  res.send({data:{list,date},code:200})
})

// 删除评论
router.post('/recommend',async(req,res)=>{
  // console.log(req.body.id);
  await Recommdend.deleteOne({_id:req.body.id})
  res.send({code:200})
})

// 注册
router.post('/register',async(req,res)=>{
  const user = await User.findOne({username:req.body.username})
  if(user){return res.status(409).send('该用户已存在')}
  const newUser = await new User(req.body).save()
  res.send({data:newUser, code:200})
})

// 登录
router.post('/login',async(req,res)=>{
  // 1.查询用户是否存在
  const user = await User.findOne({username:req.body.username})
  if(!user){return res.status(409).send('该用户不存在')}
  // 2.用户存在, 判断密码
  if(req.body.password !==user.password){
    return res.status(422).send('密码错误')
  }else{
    const token = {id:user._id,username:user.username}
    res.send({data:{token:token},code:200})
  }
})

// 验证登录
router.get('/verify',async(req,res)=>{
  // 1.获取token
  // const token = req.headers.authorization.split('')[1]
  const token =JSON.parse(req.query.token)
  const id = token.id
  const username = token.username
  // 2.查询用户是否存在
  const user = await User.findById(id)
  if(!user){return res.status(422).send('用户不存在')}
  // 2.查看username
  if(username!==user.username){
    res.status(422).send('用户名错误')
  }else{
    res.send({data:{name:username},code:200})
  }
})

// 退出
router.post('/logout',async(req,res)=>{
  // console.log(req.body);
  // const list = await Use.find()
  res.send({code:200})
})
module.exports = router