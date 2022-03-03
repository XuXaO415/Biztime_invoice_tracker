const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");




router.get("/", async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM industries`);
        return res.json({
            industries: results.rows
        });
    } catch (e) {
        return next(e);
    }
});

// router.get("/:code", async(req, res, next) => {
//     try {
//         const results = await db.query(`SELECT * FROM industries`);
//         return res.json({
//             industries: results.rows
//         });
//     } catch (e) {
//         return next(e);
//     }
// });

router.post("/", async(req, res, next) => {
    try {
        const { code, name } = req.body;
        const results = await db.query(`INSERT INTO industries (code, name) VALUES ($1, $2) RETURNING code, name`, [code, name]);
        return res.status(201).json({ industries: results.rows[0] });
    } catch (e) {
        return next(e);
    }
})

// router.post("/", async(req, res, next) => {
//     try {

//     } catch (e) {
//         return next(e);
//     }
// })


module.exports = router;