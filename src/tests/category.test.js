const request = require('supertest')
const app = require('../app')
require('../models')

const URL_CATEGORY = '/api/v1/categories'
const URL_CATEGORY_USERS = '/api/v1/users'
let TOKEN
let categoryId

beforeAll(async () => {
    const user = {
         email:"sergio@gmail.com",
         password:"sergio1234"
    }
 
    const login = await request(app)
     .post(`${URL_CATEGORY_USERS}/login`)
     .send(user)
 
     TOKEN = login.body.token
 })

test("POST -> 'URL_CATEGORY', should return status code 201, and res.body.name === body.name ", async () => {
    const body = {
        name: "Suzuli"
    }
    const res = await request(app)
        .post(URL_CATEGORY)
        .send(body)
        .set("Authorization", `Bearer ${TOKEN}`)
     categoryId = res.body.id

        expect(res.status).toBe(201)
        expect(res.body).toBeDefined()
        expect(res.body.name).toBe(body.name)
})


test("GET ALL -> 'URL_CATEGORY', should return status code 200, res.body.length === 1", async () => {
  const res = await request(app)
    .get(URL_CATEGORY)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("Delte -> 'URL_CATEGORY', should return status code 204", async () => {
    
    const res = await request(app)
        .delete(`${URL_CATEGORY}/${categoryId}`)
        .set("Authorization", `Bearer ${TOKEN}`)

        expect(res.status).toBe(204)
       
})