const request = require('supertest')
const app = require('../app')


const URL_BASE = '/api/v1/users'
let TOKEN
let userId
beforeAll(async () => {
   const user = {
        email:"sergio@gmail.com",
        password:"sergio1234"
   }

   const login = await request(app)
    .post(`${URL_BASE}/login`)
    .send(user)

    TOKEN = login.body.token
})

test("GET ALL -> 'URL_BASE' should return status code 200, res.body to be defined and res.body. length === 1", async() => {
    const res = await request(app)
        .get(URL_BASE)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("Post -> 'URL_BASE', should return status code 201, res.body to be defined and res.body.firstName === user.firstName", async () => {
    const userBody = {
        firstName: "Jalmar",
        lastName: "Villarreal",
        email:"jalmar@gmail.com",
        password:"jalmar1234",
        phone:"+593993994519"
    }
    const res = await request(app)
        .post(URL_BASE)
        .send(userBody)

     userId= res.body.id   

    expect(res.status).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(userBody.firstName)
})

test("Put -> 'URL_BASE/:id', should return status code 201, res.body to be defined and res.body.firstName === user.firstName", async () => {
    const user = {
        firstName: "roan",
        lastName: "Villa",
    }
    const res = await request(app)
        .put(`${URL_BASE}/${userId}`)
        .send(user)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(user.firstName)
})

test("POst -> 'URL_BASE/login', should return estatus code 200, res.body.email === user.email and res.body.token to be defined" , async() => {
   const user = {
        email:"jalmar@gmail.com",
        password:"jalmar1234"
   }
   const res = await request(app)
    .post(`${URL_BASE}/login`)
    .send(user)

    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.user.email).toBe(user.email)
    expect(res.body.token).toBeDefined()
})

test("POst -> 'URL_BASE/login', should return estatus code 401, res.body.email === user.email and res.body.token to be defined" , async() => {
    const user = {
         email:"jalmar@gmail.com",
         password:"invalid password"
    }
    const res = await request(app)
     .post(`${URL_BASE}/login`)
     .send(user)
 
     expect(res.status).toBe(401)
 })


test("Delete -> 'URL_BASE/:id', should return status code 201, res.body to be defined and res.body.firstName === user.firstName", async () => {
    
    const res = await request(app)
        .delete(`${URL_BASE}/${userId}`)
        .set('Authorization', `Bearer ${TOKEN}`)

    expect(res.status).toBe(204)
})