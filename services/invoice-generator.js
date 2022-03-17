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
  async generatePdf(user, candidates) {
    let orders = user.myCandidates;
    let document = {
      html: html,
      data: {
        orders, user,
      },
      path: "./invoices/quote.pdf",
      type: "",
    };
    return new Promise(async (resolve, reject) => {
      try {
        let response = await pdf.create(document, options);
        resolve(response);
      } catch (error) {
        reject(error);
      }
    });
  }
}
