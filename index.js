const mysql = require('mysql');

const express = require('express');
var app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());

var mysqlConnection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    database : 'EmployeeDB',
    multipleStatements : true
  });

  mysqlConnection.connect((err)=>{
      if(!err){
          console.log("DB Connection Succeeded");
      } else {
          console.log("DB Connection Error \n Error : "+ JSON.stringify(err, undefined, 2));
      }
  });

  app.listen(3000,()=>console.log('Express server is running at port no: 3000'));

  //Get all Employees
  app.get('/employees',(req,res)=>{
      mysqlConnection.query('select * from employee',(err, rows, fields)=>{
        if(!err){
            res.send(rows);
        } else {
            console.log(err);
        }
      })
  });

  //Get an Employee
  app.get('/employees/:id',(req,res)=>{
    mysqlConnection.query('select * from employee where EmpID = ?',[req.params.id],(err, rows, fields)=>{
      if(!err){
          res.send(rows);
      } else {
          console.log(err);
      }
    })
});

//Delete an Employee
app.delete('/employees/:id',(req,res)=>{
    mysqlConnection.query('delete from employee where EmpID = ?',[req.params.id],(err, rows, fields)=>{
      if(!err){
          res.send('Deleted Successfully');
      } else {
          console.log(err);
      }
    })
});


//Insert an Employee
app.post('/employees',(req,res)=>{
    let emp = req.body;
    var sql = "SET @EmpID=?;SET @Name = ?;SET @EmpCode = ?; SET @Salary=?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.EmpCode,emp.Salary],(err, rows, fields)=>{
      if(!err){
          //res.send(rows);
          rows.forEach(element => {
              if(element.constructor == Array)
              res.send('Inserted employee id: '+ element[0].EmpID);
          });
      } else {
          console.log(err);
      }
    })
});


//Update an Employee
app.put('/employees',(req,res)=>{
    let emp = req.body;
    var sql = "SET @EmpID=?;SET @Name = ?;SET @EmpCode = ?; SET @Salary=?; \
    CALL EmployeeAddOrEdit(@EmpID,@Name,@EmpCode,@Salary);";
    mysqlConnection.query(sql,[emp.EmpID,emp.Name,emp.EmpCode,emp.Salary],(err, rows, fields)=>{
      if(!err){
          res.send("Updated Successfully");
          
      } else {
          console.log(err);
      }
    })
});