const fss = require('fs');
async function readfile(path: any, string: any) {
    return new Promise((resolve, reject) => {
      fss.readFile(path, string, (err: any, data: any) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

async function writefile(path: any, data: any) {
    return new Promise((resolve, reject) => {
        fss.writeFile(path, data, (err: any) => {
            if (err) {
                reject(err);
            }
            resolve('Data added successfully');
        }
        );
    }
    );
}
module.exports = {readfile, writefile};
