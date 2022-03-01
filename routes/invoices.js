const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");

router.get("/", async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM invoices`);
        return res.json({ invoices: results.rows });
    } catch (e) {
        return next(e);
    }
});

router.get("/:id", async(req, res, next) => {
    try {
        const { id } = req.params;
        const invoiceResults = await db.query(`SELECT id, comp_code, amt, paid, add_date, paid_date FROM invoices WHERE id = $1`, [id]);
        // console.log(invoiceResults);
        return res.json({ invoices: invoiceResults.rows[0] });
    } catch (e) {
        return next(e);
    }
});

router.post("/", async(req, res, next) => {
    try {
        const { comp_code, amt } = req.body;
        const results = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES($1, $2) RETURNING id, comp_code, amt, paid, add_date, paid_date `, [comp_code, amt]);
        return res.status(201).json({ invoice: results.rows[0] });
    } catch (e) {
        return next(e);
    }
});



router.put("/:id", async(req, res, next) => {
    try {
        const { amt, paid, paid_date } = req.body;
        // const { id } = req.params;
        const results = await db.query(
            `UPDATE invoices SET amt=$1, paid=$2, paid_date=$3 WHERE id=$4 RETURNING id, amt, paid,  paid_date`, [req.params.id, amt, paid, paid_date]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice ${id} not found`, 404);
        }
        return res.json(results.rows[0]);
    } catch (err) {
        return next(err);
    }
});

router.delete("/:id", async(req, res, next) => {
    try {
        const results = db.query(`
DELETE FROM invoices WHERE id = $1 `, [
            req.params.id
        ]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Invoice ${id} not found`, 404)
        }
        return res.json({ status: "Deleted" });
    } catch (e) {
        return next(e);
    }
});

module.exports = router;