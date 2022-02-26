process.env.NODE_ENV = "test";
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany
beforeEach(async() => {
    const result = await db.query('INSERT INTO companies (code, name) VALUES ("apple", "Apple", "Ruthless conglomerate") RETURNING code, name, description');
    test = result.rows[0]
})

afterEach(async() => {
    await db.query(`DELETE FROM companies`);
})
afterAll(async() => {
    await db.end();
})

// describe("Oof, hope this works", () => {
//     test("Oh lawd...it didn't", () => {
//         console.log(testCompany);
//         expect(1).toBe(1);
//     })
// })

describe("GET /companies", () => {
    test("Get a list with one company", async() => {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ companies: [testCompany] })
    })
})