'use strict';
var pdf = require("pdf-creator-node");
var fs = require("fs");
var path = require("path");
var html = fs.readFileSync(path.join(__dirname, "./invoice.html"), "utf8");

var options = {
  format: "A3",
  orientation: "portrait",
  border: "10mm",
};

const orders = [
  {
    order: 1,
    fullname: "Tinashe Zvihwati",
    value: "3000",
  },
  {
    order: 2,
    fullname: "Tinotenda Zvihwati",
    value: "4000",
  },
  {
    order: 3,
    fullname: "Tawananyasha Zvihwati",
    value: "6000",
  },
];


module.exports = class InvoiceGenerator {
  generatePdf(user, candidateList) {
    console.log(candidateList);
    let document = {
      html: html,
      data: {
        orders, user,
      },
      path: "./invoices/output.pdf",
      type: "",
    };

    console.log(document);
    pdf.create(document, options).then((res) => { console.log(res); }).catch((error) => {
      console.error(error);
    });

    return "output.pdf"
  }
}
