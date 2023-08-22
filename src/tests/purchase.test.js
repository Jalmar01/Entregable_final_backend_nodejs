const request = require('supertest')
const app = require('../app');
const Product = require('../models/Product');
require('../models')

const URL_PURCHASE = '/api/v1/purchase'
const URL_USER = '/api/v1/users/login'
const URL_CART =  '/api/v1/cart'
let TOKEN
let userId
let productBody
let product 
let bodyCart


beforeAll(async () => {
    // inicio de sesion
    const user = {
        email:"sergio@gmail.com",
        password:"sergio1234"
    }
    const res = await request(app)
        .post(URL_USER)
        .send(user)

    TOKEN = res.body.token

    userId = res.body.user.id

    // product
    productBody = {
        title:"Suzuki",
        description:"Gn-125",
        price:1799.99,
    };

    product = await Product.create(productBody)
    // cart
    bodyCart = {
        quantity: 1,
        productId:product.id
    }
    await request(app)
        .post(URL_CART)
        .send(bodyCart)
        .set("Authorization", `Bearer ${TOKEN}`)
});


test("POST -> 'URL_PURCHASE', should return status code 201, res.body.quantity === bodyCart.quantity", async () => {
    const res = await request(app)
        .post(URL_PURCHASE)
        .set("Authorization", `Bearer ${TOKEN}`)
 
    expect(res.status).toBe(201)
    expect(res.body[0].quantity).toBe(bodyCart.quantity)

})

test("GET-> 'URL_PURCHASE', should return staus code 200, and res.body.length ===1", async() =>{
    const res = await request(app)
    .get(URL_PURCHASE)
    .set("Authorization", `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].userId).toBe(userId)
    expect(res.body[0].product).toBeDefined()
    expect(res.body[0].product.id).toBe(product.id)

    await product.destroy()
})