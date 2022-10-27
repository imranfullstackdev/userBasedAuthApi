const express = require("express");
const PooL = require("../db/db");
const pool = require("../db/db");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const auth = require("../Auth/Auth");

//get all user
router.get("/", async (req, res) => {
  const getAllUser = await pool.query("select * from crudtable2");
  res.send(getAllUser.rows);
  console.log(getAllUser.rows);
});

router.get("/about", auth, async (req, res) => {
  console.log(res.user);
  console.log("user id ", res.id);
  const user = res.id;

  const theuser = await pool.query(`select * from crudtable2 where id=$1`, [
    user,
  ]);
  res.send({ user: theuser.rows });
});

// post all user
router.post("/post", async (req, res) => {
  const { name, email, password, Cpassword, phonenumber, qualification, work } =
    req.body;
  console.log(req.body);
  if (
    (!name, !email, !password, !Cpassword, !phonenumber, !qualification, !work)
  ) {
    res.status(400).send({ err: "please fill all the credential" });
  } else if (password !== Cpassword) {
    res.status(400).send({ err: "password dont Match" });
    console.log(password);
    console.log("cpasswod", Cpassword);
  } else {
    const aUser = await pool.query(`select * from crudtable2 where email=$1`, [
      req.body.email,
    ]);
    const salt = await bcrypt.genSalt(10);
    const hasspassword = await bcrypt.hash(password, salt);
    const hasscpassword = await bcrypt.hash(Cpassword, salt);

    if (aUser.rows.length > 0) {
      res.status(400).send({ err: "user already exist" });
    } else {
      let role=7;
      const AddUser = await pool.query(
        `insert into crudtable2 (name,email,password,Cpassword,phonenumber,qualification,work,role) values($1,$2,$3,$4,$5,$6,$7,$8) returning *`,
        [
          name,
          email,
          hasspassword,
          hasscpassword,
          phonenumber,
          qualification,
          work,
          role,
        ]
      );
      res.send(AddUser.rows);
      // console.log(AddUser.rows);
    }
  }
});

// USER LOGIN
router.post("/login", async (req, res) => {
  // const { email, password } = req.body;
  const auser = await pool.query("select * from crudtable2 where email=$1", [
    req.body.email,
  ]);

  // if user already exist
  if (auser.rows.length > 0) {
    const verifypassword = await bcrypt.compare(
      req.body.password,
      auser.rows[0].password
    );
    if (verifypassword) {
      const token = jwt.sign({ id: auser.rows[0].id }, process.env.secretKey);
      // console.log(token);
      res.send({
        token: token,
        user: { ...auser.rows[0] },
        role: auser.rows[0].role,
        expiresIn: "1hr",
      });
      console.log(auser.rows[0].role)
    }
  } else {
    res.status(400).send({ err: "Invalid Credential" });
  }
});

// edit
router.put("/put/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, password, Cpassword, phonenumber, qualification, work,role } =
    req.body;
  const editUser = await pool.query(
    `update crudtable2 set name=$1,email=$2,password=$3,Cpassword=$4,phonenumber=$5,qualification=$6,work=$7, where id=$8 `,
    [name, email, password, Cpassword, phonenumber, qualification, work, id,role]
  );
  res.send({ suc: "edited Sucesfully" });
});

// delete user
router.delete("/dlt/:id", async (req, res) => {
  const { id } = req.params;
  const deleteUser = await pool.query(`delete from crudtable2 where id=$1`, [
    id,
  ]);
  res.send({ sus: "Deleted Sucessfully" });
});
module.exports = router;
