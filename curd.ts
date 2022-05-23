export{}
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const flat = require('flat');
const {readfile, writefile} = require('./readfile_fun');
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (res) => {
  readfile('employee.json', 'utf8').then((data: any) => {
    res.send(data);
  });
});
app.post('/add', (req, res) => {
  readfile('employee.json', 'utf8').then((obj: any) => {
    try {
      if (obj == null) {
        throw new Error('File is empty');
      }
      const id = obj.length + 1;
      const employee = {
        id,
        first_name: req.body.firstname,
        last_name: req.body.lastname,
        email: req.body.email,
        phone: req.body.phonenumber,
      };
      const falt_emp = flat(obj);
      if (employee.first_name && employee.last_name && employee.phone && employee.email) {
        if (!employee.phone.match(/^[0-9]{10}$/)) {
          res.send('Please enter a valid phone number');
        } else if (!employee.first_name.match(/^[A-Z][a-z]{1,20}$/)) {
          res.send('Please enter a valid first name');
        } else if (!employee.last_name.match(/^[A-Z][a-z]{1,20}$/)) {
          res.send('Please enter a valid last name');
        } else if (!employee.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
          res.send('Please enter a valid email');
        } 
        var flag = 1;
        for(let i = 0; i < obj.length; i++){
            if(obj[i].phone == employee.phone ){
                flag = 0;
                res.send('Phone number already exists');
                break;
            }
            if(obj[i].email == employee.email){
                flag = 0;
                res.send('email already exists');
                break;
            }
        }
        if(flag == 1){
            obj.push(employee);
            fs.writeFile('employee.json', JSON.stringify(obj), (err: any) => {
                if (err) {
                    throw err;
                }
                res.send('Employee added successfully');
            });
        }
      } else {
        res.send('Please fill all the fields');
        console.log('Please fill all the fields');
      }
    } catch (error) {
      console.log(error);
    }
  }).catch((err: any) => {
    console.log(err);
  });
});
app.delete('/delete/:id', (req, res) => {
  readfile('employee.json', 'utf8').then((obj: any) => {
    const { id } = req.params;
    obj.findIndex((employee) => {
      if (employee.id === Number(id)) {
        obj.splice(obj.indexOf(employee), 1);
        fs.writeFile('employee.json', JSON.stringify(obj), (err: any) => {
          if (err) {
            console.log(err);
          } else {
            res.send('Data deleted successfully');
          }
        });
      }
    });
  }).catch((err: any) => {
    console.log(err);
  });
});
app.put('/update/:id', (req, res) => {
  readfile('employee.json', 'utf8').then((obj: any) => {
    const { id } = req.params;
    const temp = [];
    obj.findIndex((employee) => {
      if (employee.id === Number(id)) {
        employee.first_name = req.body.firstname;
        employee.last_name = req.body.lastname;
        employee.phone = req.body.phonenumber;
        employee.email = req.body.email;
      }
      temp.push(employee);
    });
    fs.writeFile('employee.json', JSON.stringify(temp), (err: any) => {
      if (err) {
        console.log(err);
      } else {
        res.send('Data updated successfully');
      }
    });
  }).catch((err: any) => {
    console.log(err);
  });
});
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});