process.env.NODE_ENV = "test";
const request = require('supertest');
const app = require('../app');
const db = require('../db');

let testCompany;
beforeEach(async function() {
    const result = await db.query(`INSERT INTO companies(code, name, description) VALUES('
                apple', 'Apple', 'blah blah') RETURNING  code, name, description`);
    testCompany = result.rows[0];
});

afterEach(async function() {
    await db.query(`DELETE FROM companies `);
});
afterAll(async function() {
    await db.end();
})

// describe("Oof, hope this works", () => {
//     test("Oh lawd...it didn't", () => {
//         console.log(testCompany);
//         expect(1).toBe(1);
//     })
// })

describe("GET /companies", function() {
    test("Get a list of one company", async function() {
        const res = await request(app).get('/companies')
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual({ companies: [testCompany] })
    });
});

// describe("GET /companies/:code", function() {
//     test("Get a single company", async function() {
//         const res = await request(app).get(`/companies/${testCompany.code}`);
//         expect(res.statusCode).toEqual(200);
//         expect(res.body).toEqual({
//             company: [testCompany]
//         });
//     });
//     test("Responds with 404 if company is not found", async function() {
//         const res = await request(app).get(`/companies/0`);
//         expect(res.statusCode).toEqual(404);
//     });
// });