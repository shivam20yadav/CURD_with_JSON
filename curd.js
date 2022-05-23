var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var flat = require('flat');
var _a = require('./readfile_fun'), readfile = _a.readfile, writefile = _a.writefile;
var app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.get('/', function (req, res) {
    readfile('employee.json', 'utf8').then(function (data) {
        console.log(data);
    });
});
app.post('/add', function (req, res) {
    readfile('employee.json', 'utf8').then(function (obj) {
        try {
            if (obj == null) {
                throw new Error('File is empty');
            }
            var id = obj.length + 1;
            var employee = {
                id: id,
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                email: req.body.email,
                phone: req.body.phonenumber
            };
            var falt_emp = flat(obj);
            if (employee.first_name && employee.last_name && employee.phone && employee.email) {
                if (!employee.phone.match(/^[0-9]{10}$/)) {
                    res.send('Please enter a valid phone number');
                }
                else if (!employee.first_name.match(/^[A-Z][a-z]{1,20}$/)) {
                    res.send('Please enter a valid first name');
                }
                else if (!employee.last_name.match(/^[A-Z][a-z]{1,20}$/)) {
                    res.send('Please enter a valid last name');
                }
                else if (!employee.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
                    res.send('Please enter a valid email');
                }
                var flag = 1;
                for (var i = 0; i < obj.length; i++) {
                    if (obj[i].phone == employee.phone) {
                        flag = 0;
                        res.send('Phone number already exists');
                        break;
                    }
                    if (obj[i].email == employee.email) {
                        flag = 0;
                        res.send('email already exists');
                        break;
                    }
                }
                if (flag == 1) {
                    obj.push(employee);
                    fs.writeFile('employee.json', JSON.stringify(obj), function (err) {
                        if (err) {
                            throw err;
                        }
                        res.send('Employee added successfully');
                    });
                }
            }
            else {
                res.send('Please fill all the fields');
                console.log('Please fill all the fields');
            }
        }
        catch (error) {
            console.log(error);
        }
    })["catch"](function (err) {
        console.log(err);
    });
});
app["delete"]('/delete/:id', function (req, res) {
    readfile('employee.json', 'utf8').then(function (obj) {
        var id = req.params.id;
        obj.findIndex(function (employee) {
            if (employee.id === Number(id)) {
                obj.splice(obj.indexOf(employee), 1);
                fs.writeFile('employee.json', JSON.stringify(obj), function (err) {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        res.send('Data deleted successfully');
                    }
                });
            }
        });
    })["catch"](function (err) {
        console.log(err);
    });
});
app.put('/update/:id', function (req, res) {
    readfile('employee.json', 'utf8').then(function (obj) {
        var id = req.params.id;
        var temp = [];
        obj.findIndex(function (employee) {
            if (employee.id === Number(id)) {
                employee.first_name = req.body.firstname;
                employee.last_name = req.body.lastname;
            }
            temp.push(employee);
        });
        fs.writeFile('employee.json', JSON.stringify(temp), function (err) {
            if (err) {
                console.log(err);
            }
            else {
                res.send('Data updated successfully');
            }
        });
    })["catch"](function (err) {
        console.log(err);
    });
});
app.listen(3000, function () {
    console.log('Server is running on port 3000');
});
