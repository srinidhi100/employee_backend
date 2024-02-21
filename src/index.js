const express = require("express")
const cors = require("cors")
const mysql = require('mysql')
const app = express();
// const mongoose = require("mongoose")
const dotenv = require("dotenv")

dotenv.config({ path: require('find-config')('.env') })
// const JWT_SECRET = process.env.JWT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET
// const URL = 'mongodb://srinidhirocks12:KcQag9ix0WlY8V9k@ac-d3etyjy-shard-00-00.fzfrz1o.mongodb.net:27017,ac-d3etyjy-shard-00-01.fzfrz1o.mongodb.net:27017,ac-d3etyjy-shard-00-02.fzfrz1o.mongodb.net:27017/?ssl=true&replicaSet=atlas-12og5e-shard-0&authSource=admin&retryWrites=true&w=majority'
//const URL = (`${process.env.START_MONGO}${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}${process.env.END_MONGO}${process.env.DB_NAME}${process.env.LAST_MONGO}`)
// console.log('URL', URL)

const { v4: uuidv4 } = require('uuid');




// mongoose.connect(URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log('Connected!')).catch((err) => console.log('error', err));

// const employeeModule = require('./models/employee_details.js')


const db = mysql.createConnection({
    host: "localhost",
    user: 'root',
    password: "",
    database: "machoodb"
})


app.use(express.json())

app.use(cors({
    origin: '*',
    // credentials: true,
    // exposedHeaders: ['Set-Cookie']
}))

// app.set("trust proxy", 1);


app.get("/", (req, res) => {
    res.send("Hello World From BACKEND");
})
//Create a employee
app.post("/createEmployee", async (req, res) => {
    try {
        const uuid = uuidv4();
        console.log("uuid",typeof(uuid))
        console.log("sdadsadasdasda", req.body.name)
        const sql = `INSERT INTO employee (name,department,dob,gender,designation,salary,_id) VALUES (?,?,?,?,?,?,?)` ;
        const insertValues =[ req.body.name ,  req.body.department ,  req.body.dob ,  req.body.gender ,  req.body.designation ,  req.body.salary , uuid ]
        // Generate a UUID
        // console.log('Generated UUID:', uuid);
        // const insertValues = [req.body.name, req.body.department, req.body.dob, req.body.gender, req.body.designation, req.body.salary, uuid];
        db.query(sql,insertValues, (err, data) => {
            if (err) { res.status(500).json({ message: err }) }
            res.send(data)
        })
        // const newemployeeModule = new employeeModule({
        //     name: req.body.name,
        //     department: req.body.department,
        //     dob: req.body.dob,
        //     gender: req.body.gender,
        //     designation: req.body.designation,
        //     salary: req.body.salary
        // })
        // newemployeeModule.save().then((docs) => {
        //     res.send({ message: "Success ceated", employeeId: docs._id })
        // }).catch((err) => { console.log("Erroer:", err) })

    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: error })
    }
})

// All employee data
app.get("/employeeData/", async (req, res) => {
    try {
        console.log("req.params,", req.params)
        console.log("req.query,", req.query)
        // MONGO DB -->>
        // employeeModule.find({ })
        //     .then((docs) => {
        //         console.log("docs",docs)
        //         res.send({ message: "Success", tabledocs: docs })
        //     })


        //SQL
        const sql = "SELECT * FROM employee";
        db.query(sql, (err, data) => {
            if (err) return res.status(500).json({ message: err })
            res.send(data)
        })
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
})

//One employee data (To View)
app.get("/employee/:id", async (req, res) => {
    try {
        console.log("Id of the emmployee")
        console.log("req.params,", typeof(req.params.id))
        console.log("req.query,", req.query)

        // employeeModule.find({ _id: req.params.id })
        //     .then((docs) => {
        //         console.log("docs", docs)
        //         res.send({ message: "Success", tabledocs: docs })
        //     })
        const sql = `SELECT * FROM employee WHERE _id = ?`;
        const sqlQueryid =  req.params.id;
        db.query(sql,sqlQueryid, (err, data) => {
            if (err) {return res.status(500).json({ message: err})}
            res.status(200).json(data)
        })
    }
    catch (error) {
        res.status(500).json({ message: error })
    }
})

//Edit or delete one employee data

// Update 1 Document
app.post("/editEmployee/:id", async (req, res) => {
    try {
        // employeeModule.updateOne(
        //     // Filter criteria
        //     { _id: req.params.id },
        //     // Update data
        //     {
        //         $set: {
        //             name: req.body.name,
        //             department: req.body.department,
        //             dob: req.body.dob,
        //             gender: req.body.gender,
        //             designation: req.body.designation,
        //             salary: req.body.salary
        //         }
        //     }
        // )
        //     .then(result => {
        //         res.status(200).json({ message: "Successfully Edited" })
        //         console.log(`Matched count: ${result.matchedCount}`);
        //         console.log(`Modified count: ${result.modifiedCount}`);
        //     })
        //     .catch(error => {
        //         console.error('Error occurred:', error);
        //     })
        const sql = `UPDATE employee SET name = ?, department = ?, dob = ?, gender = ?, designation = ?,salary = ? WHERE _id = ?`;
        const updateValues = [req.body.name, req.body.department, req.body.dob, req.body.gender, req.body.designation, req.body.salary, req.params.id];
        db.query(sql, updateValues, (err, data) => {
            if (err) {
                console.log("ERRORRR: ", err);
                return res.status(500).json({ message: err })
            }
            res.send(data)
        })

    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: error })
    }
})

//Delete deleteEmployee
app.put("/deleteEmployee/:id", async (req, res) => {
    try {
        console.log("DELETE", req)
        // employeeModule.deleteOne(
        //     // Filter criteria
        //     { _id: req.params.id }
        // )
        //     .then(result => {
        //         console.log(`Deleted count: ${result.deletedCount}`);
        //         res.status(200).json({ message: "Successfully deleted" })
        //     })
        //     .catch(error => {
        //         console.error('Error occurred:', error);
        //     })
        const sql = `DELETE FROM employee WHERE _id = ${req.params.id}`
        db.query(sql, (err, data) => {
            if (err) {
                console.log("ERRORRR: ", err);
                return res.status(500).json({ message: err })
            }
            res.send(data)
        })
    } catch (error) {
        console.log("error", error)
        res.status(500).json({ message: error })
    }
})

app.listen(process.env.PORT || 4000, async () => {
    console.log("Server Starrted");

})