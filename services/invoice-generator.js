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


module.exports = class InvoiceGenerator {
  async generatePdf(user, orders) {
    let document = {
      html: html,
      data: {
        orders, user,
      },
      path: "./invoices/output.pdf",
      type: "",
    };
    pdf.create(document, options).then((res) => { console.log(res); }).catch((error) => {
      console.error(error);
    });

    return "output.pdf"
  }
}
