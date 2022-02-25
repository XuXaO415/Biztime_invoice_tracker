const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");



router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(`SELECT code, name * FROM companies ORDER BY name`);
        return res.json({
            companies: results.rows
        });
    } catch (e) {
        return next(e);
    }
});
router.get('/:code', async(req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`${code}, 404 not found`)
        }
        return res.send({ companies: results.rows[0] })
    } catch (e) {
        return next(e)
    }
});

// router.post('/', async(req, res, next) => {
//     try {

//     }
// });

// router.put('/', async(req, res, next) => {
//     try {

//     }
// });

// router.delete('/:code', async(req, res, next) => {
//     try {
//         const results = db.query(`DELETE FROM companies WHERE code = $1`, [req.params.code]);
//         return res.send({ msg: "Deleted" });
//     } catch (e) {
//         return next(e)
//     }
// });

module.exports = router;