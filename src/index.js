const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require('uuid');
const { Pool } = require('pg');
const dotenv = require("dotenv");

dotenv.config({ path: require('find-config')('.env') });

const app = express();

app.use(express.json());
app.use(cors({
    origin: '*',
}));

const pool = new Pool({
    connectionString: 'postgres://user24:Zg6nx4EIbRrdwdp9aXnBgV9SeT8lFEsP@dpg-cnbhks8l5elc73fl66kg-a.oregon-postgres.render.com/machoodb24',
    ssl: {
        rejectUnauthorized: false // Disable SSL certificate validation (not recommended for production)
    }
});

app.get("/", async (req, res) => {
    try {
        // const sql = "CREATE TABLE IF NOT EXISTS employee (_id SERIAL PRIMARY KEY, name VARCHAR(100), department VARCHAR(100), dob VARCHAR(100),gender VARCHAR(100), designation VARCHAR(255), salary INT)";
        // await pool.query(sql);
        // res.json({ message: "Employee Table created successfully" });
        res.json({ message: "Hello from backend" });

        // const sqlDelete = "DROP TABLE IF EXISTS employee";
        // await pool.query(sqlDelete);
        // res.json({ message: "Employee Table deleted successfully" });
    } catch (error) {
        console.error("Error creating table:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
// });

// Create an employee
app.post("/createEmployee", async (req, res) => {
    try {
        const uuid = uuidv4();
        const insertValues = [req.body.name, req.body.department, req.body.dob, req.body.gender, req.body.designation, req.body.salary];
        const sql = `INSERT INTO employee (name, department, dob, gender, designation, salary) VALUES ($1, $2, $3, $4, $5, $6)`;
        const result = await pool.query(sql, insertValues);
        res.json({ message: "Employee created successfully", result : result });
    } catch (error) {
        console.error("Error creating employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Fetch all employee data
app.get("/employeeData", async (req, res) => {
    try {
        const sql = "SELECT * FROM employee";
        const result = await pool.query(sql);
        // console.log("RESULT", result)
        res.json(result.rows);
    } catch (error) {
        console.error("Error fetching employee data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});
 
// Fetch one employee's data by ID
app.get("/employee/:id", async (req, res) => {
    try {
        const sql = "SELECT * FROM employee WHERE _id = $1";
        // console.log("req.params.id",req.params.id)
        const result = await pool.query(sql, [req.params.id]);
        if (result.rows.length === 0) {
            res.status(404).json({ message: "Employee not found" });
        } else {
            // console.log("result",result)
            res.json(result.rows[0]);
        }
    } catch (error) {
        console.error("Error fetching employee data:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Update an employee's data
app.put("/editEmployee/:id", async (req, res) => {
    try {
        const sql = `UPDATE employee SET name = $1, department = $2, dob = $3, gender = $4, designation = $5, salary = $6 WHERE _id = $7`;
        const updateValues = [req.body.name, req.body.department, req.body.dob, req.body.gender, req.body.designation, req.body.salary, req.params.id];
        await pool.query(sql, updateValues);
        res.json({ message: "Employee updated successfully" });
    } catch (error) {
        console.error("Error updating employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

// Delete an employee
app.delete("/deleteEmployee/:id", async (req, res) => {
    try {
        const sql = "DELETE FROM employee WHERE _id = $1";
        await pool.query(sql, [req.params.id]);
        res.json({ message: "Employee deleted successfully" });
    } catch (error) {
        console.error("Error deleting employee:", error);
        res.status(500).json({ message: "Internal server error" });
    }
});

app.listen(process.env.PORT || 4000, () => {
    console.log("Server Started");
});
