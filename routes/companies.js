const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");
const slugify = require("slugify");

router.get('/', async(req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows });
    } catch (e) {
        return next(e);
    }
});

/** Get {company: {code, name, description}}  */

// router.get('/:code', async(req, res, next) => {
//     try {
//         const { code } = req.params;
//         const cResults = await db.query(`SELECT c.code, c.name, c.description FROM companies AS c WHERE c.code = $1`, [code]);
//         const iResults = await db.query(`SELECT id FROM invoices WHERE comp_code = $1`, [code]);
//         if (cResults.rows.length === 0) {
//             throw new ExpressError(`Company: ${code} not found`, 404)
//         }
//         const company = cResults.rows[0];
//         const invoices = iResults.rows;
//         company.invoices = invoices.map(i => i.id);
//         return res.json({ company: cResults.rows[0] })
//     } catch (e) {
//         return next(e)
//     }
// });
/** when viewing details for a company, you can see the names of the industries for that company
 * {"company":"ibm","name":"accounting","description":"Big blue.","industries":["accounting","finance","management","marketing"]}
 */
router.get('/:code', async(req, res, next) => {
    try {
        const { code } = req.params;
        const results = await db.query(`SELECT * FROM companies AS c 
        LEFT JOIN companies_industries AS ci
        LEFT JOIN industries as i ON i.code = ci.in_code
        ON c.code = ci.comp_code
        WHERE c.code = $1`, [code]);
        console.log(results);
        if (results.rows.length === 0) {
            throw new ExpressError(`Company: ${code} not found`, 404)
        }
        const { name, description } = results.rows[0];
        const industries = results.rows.map(n => n.name);
        return res.json({ company: code, name, description, industries })
    } catch (e) {
        return next(e);
    }
})

// router.get('/', async function(req, res, next) {
//     try {
//         const results = await db.query(`SELECT code, name * FROM companies ORDER BY name`);
//         return res.json({
//             companies: results.rows[0]
//         });
//     } catch (e) {
//         return next(e);
//     }
// })


// router.get('/:code', async function(req, res, next) {
//     try {
//         const { code } = req.params;
//         const results = await db.query(`SELECT code, name, description FROM companies WHERE code = $1`, [code]);
//         if (results.rows.length === 0) {
//             throw new ExpressError(`Company with this ${code} not found`, 404);
//         }
//         console.log(results);
//         return res.json({ companies: results.rows[0] })
//     } catch (e) {
//         return next(e)
//     }
// })
/** Adds a company */
router.post('/', async(req, res, next) => {
    try {
        const { code, name, description } = req.body;
        // const code = slugify(name, {
        //     // replacement: '-',
        //     // remove: '[^*+~.()!:@]\$',
        //     lower: true
        // });
        const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [code, name, description]);
        return res.status(201).json({ company: results.rows[0] })
    } catch (e) {
        return next(e)
    }
});

// router.post('/', async(req, res, next) => {
//     try {
//         const results = await db.query(`INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description`, [req.body.code, req.body.name, req.body.description]);
//         return res.status(201).json({ company: results.row[0] });
//     } catch (err) {
//         return next(err);
//     }
// });
/** Edit existing company */
router.put('/:code', async(req, res, next) => {
    try {
        const { name, description } = req.body;
        const { code } = req.params;
        const results = await db.query(`UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, code]);
        return res.json(results.rows[0]);
    } catch (err) {
        return next(err);
    }
});

/** Deletes company */
router.delete('/:code', async(req, res, next) => {
    try {
        const results = db.query(`DELETE FROM companies WHERE code = $1`, [req.params.code]);
        return res.json({ msg: "Deleted" });
    } catch (e) {
        return next(e)
    }
})

module.exports = router;