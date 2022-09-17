const invoices = require("./invoices.json");
const createStatementData = require("./createStatementData");

console.log(statement(invoices));
// console.log(htmlStatement(invoices));

function statement(invoice) { 
  return renderPlainText(createStatementData(invoice));
}

function renderPlainText(data) { 
  let result = `Statement for ${data.customer}\n`;

  for(let aPerformance of data.performances){    
    result += ` ${aPerformance.play.name}: ${valueToBRL(aPerformance.amount)} (${aPerformance.audience} seats) \n`
  }

  result+= `Amount owed is ${valueToBRL(data.totalAmount)} \n`; 
  result+= `You earned ${data.totalVolumeCredits} credits \n`; 

  return result;
}

function htmlStatement(invoice) { 
  return renderHtml(createStatementData(invoice));
}

function renderHtml(data) { 
  let result = `<h1>Statement for ${data.customer}</h1>\n`;

  result += "<table>\n";
  result += "<tr><th>play</th><th>seats</th><th>cost</th>\n";
  for(let aPerformance of data.performances){    
    result += `<tr><td>${aPerformance.play.name}</td><td>${aPerformance.audience}</td><td>${valueToBRL(aPerformance.amount)}</td></tr>\n`
  }
  result += "</table>\n";

  result+= `<p>Amount owed is <em>${valueToBRL(data.totalAmount)}</em></p> \n`; 
  result+= `<p>You earned <em>${data.totalVolumeCredits}</em> credits</p> \n`; 

  return result;
}

function valueToBRL(value) { 
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(value/100);
}