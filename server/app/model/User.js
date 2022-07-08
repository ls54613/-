const mongoose = require('mongoose')
const mongoUrl = 'mongodb://127.0.0.1:27017/login'
  mongoose.connect(mongoUrl)
  .then(() => console.log('数据库连接成功'))
  .catch(() => console.log('数据库连接失败'));
const {Schema,model} = mongoose
// 管理员表
const UserSchema = new Schema({
  username:{type:String,require:true},
  password:{type:String,require:true}
})
// 用户表
const UseSchema = new Schema({
  name:{type:String,require:true},
  date:{type:String},
  img:{type:String},
  tel:{type:String,require:true},
  address:{type:String,require:true}
})
// 菜品表
const FoodSchema = new Schema({
  name:{type:String,require:true},
  shop:{type:String,require:true},
  img:{type:String,require:true},
  category:{type:String,require:true},
  desc:{type:String,require:true},
  price:{type:String,require:true}
})
// 店铺表
const ShopSchema = new Schema({
  shop:{type:String,required:true},
  address:{type:String,required:true},
  vegList:{type:Array,default:{name:''}}
})
// 订单表
const OrderSchema = new Schema({
  date:{type:String,require:true},
  username:{type:String,require:true},
  img:{type:String,require:true},
  tel:{type:String,require:true},
  tips:{type:String,require:true},
  pro:{type:String,default:"未完成"},
  address:{type:String,require:true}
})
// 评论表
const RecommendSchema = new Schema({
  date:{type:String,require:true},
  nickname:{type:String,require:true},
  name:{type:String,require:true},
  recommend:{type:String,require:true}
})
const User = model('User',UserSchema)
const Use = model('Use',UseSchema)
const Food = model('Food',FoodSchema)
const Shop = model('Shop',ShopSchema)
const Order = model('Order',OrderSchema)
const Recommdend = model('Recommend',RecommendSchema)

module.exports = {User,Use,Food,Shop,Order,Recommdend}
