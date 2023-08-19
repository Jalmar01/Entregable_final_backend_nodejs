const request = require('supertest')
const app = require('../app')
const Category = require('../models/Category')
require('../models')

const URL_PRODUCT = '/api/v1/products'
const URL_USER = '/api/v1/users/login'
let TOKEN
let product
let category
let productId
beforeAll(async () => {
    const user = {
        email:"sergio@gmail.com",
        password:"sergio1234"
    }
    const res = await request(app)
        .post(URL_USER)
        .send(user)

    TOKEN = res.body.token

    const categoryBody = {
        name:"Moto"
    }
    category = await Category.create(categoryBody)


    product = {
        title:"Suzuki",
        description:"Gn-125",
        price:1799.99,
        categoryId:category.id
    }
})


test("POST -> 'URL_PRODUCT' should return status code 201,res.body to be defined and  res.body.title === product.title", async() => {
   
    const res = await request(app)
        .post(URL_PRODUCT)
        .send(product)
        .set('Authorization', `Bearer ${TOKEN}`)

    productId = res.body.id
    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)

   
})

test("GET ALL-> 'URL_PRODUCT' should return status code 200,res.body.length === 1", async() => {
   
    const res = await request(app)
        .get(URL_PRODUCT)
        
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].category).toBeDefined()
    expect(res.body[0].category.id).toBe(category.id)
})

test("GET FILTER-> 'URL_PRODUCT?category=id' should return status code 200,res.body.length === 1 and to be defined res.body[0].category.id", async() => {
   
    const res = await request(app)
        .get(`${URL_PRODUCT}?category=${category.id}`)
        
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].category).toBeDefined()
    expect(res.body[0].category.id).toBe(category.id)
})

test("DET ONE -> 'URL_PRODUCT/:id' should return status code 200,res.body to be defined and  res.body.title === product.title", async() => {
   
    const res = await request(app)
        .get(`${URL_PRODUCT}/${productId}`)
       
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(product.title)
   
})

test("UPDATE -> 'URL_PRODUCT/:id' should return status code 200,res.body to be defined and  res.body.title === productUpdate.title", async() => {
   const productUpdate = {
     title:"Yamaha",
     description:"DT-175",
   }

    const res = await request(app)
        .put(`${URL_PRODUCT}/${productId}`)
        .send(productUpdate)
        .set('Authorization', `Bearer ${TOKEN}`)
       
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.title).toBe(productUpdate.title)
   
})

test("DELETE -> 'URL_PRODUCT/:id' should return status code 204", async() => {
    
     const res = await request(app)
         .delete(`${URL_PRODUCT}/${productId}`)
         .set('Authorization', `Bearer ${TOKEN}`)
        
     expect(res.status).toBe(204)
 
     await category.destroy()
    
 })

