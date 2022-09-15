const invoices = require("./invoices.json");
const plays = require("./plays.json");

console.log(statement(invoices));

function statement(invoice) { 
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances
  return renderPlainText(statementData);
}

function renderPlainText(data) { 
  let result = `Statement for ${data.customer}\n`;

  for(let aPerformance of data.performances){    
    result += ` ${playFor(aPerformance).name}: ${valueToBRL(amountFor(aPerformance)/100)} (${aPerformance.audience} seats) \n`
  }

  result+= `Amount owed is ${valueToBRL(totalAmount()/100)} \n`; 
  result+= `You earned ${totalVolumeCredits()} credits \n`; 

  return result;
}

function amountFor(aPerformance) { 
  let result = 0;
  switch (playFor(aPerformance).type) {
    case 'tragedy':
      result = 40000
      if (aPerformance.audience > 30) {
        result += 1000*(aPerformance.audience - 30)
      }
    break;

    case 'comedy':
      result = 30000
      if (aPerformance.audience > 20) {
        result += 10000 + 500 *(aPerformance.audience - 20)
      }
      
      result += 300* aPerformance.audience
    break;
  
    default:
      throw new Error(`unknown type: ${playFor(aPerformance).type}`)
  }

  return result;
}

function playFor(aPerformance) { 
  return plays[aPerformance.playId];
}

function volumeCreditsFor(aPerformance) { 
  let result = 0;
  result += Math.max(aPerformance.audience - 30, 0)
  if("comedy" === playFor(aPerformance).type) result += Math.floor(aPerformance.audience / 5);

  return result;
}

function totalVolumeCredits() { 
  let volumeCredits = 0;
  for(let aPerformance of invoices.performances){  
    volumeCredits += volumeCreditsFor(aPerformance)
  }
  return volumeCredits;
}

function valueToBRL(value) { 
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format(value);
}

function totalAmount() { 
  let result = 0;
  for(let aPerformance of invoices.performances){ 
    result += amountFor(aPerformance);
  } 
  return result;
}