const invoices = require("./invoices.json");
const plays = require("./plays.json");

invoices.map(function (invoice, index) { 
  console.log(statement(invoice, plays));
})

function statement(invoice, plays) { 
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `Statement for ${invoice.customer}\n`;
  const format = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2
  }).format;

  for(let perf of invoice.performances){
    const play = plays[perf.playId];
    let thisAmount = 0;

    switch (play.type) {
      case 'tragedy':
        thisAmount = 40000
        if (perf.audience > 30) {
          thisAmount += 1000*(perf.audience - 30)
        }
      break;

      case 'comedy':
        thisAmount = 30000
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 *(perf.audience - 20)
        }
        
        thisAmount += 300* perf.audience
      break;
    
      default:
        throw new Error('unknown type: ${play.type}')
    }

    //Soma créditos por volume
    volumeCredits += Math.max(perf.audience, 0)
    // soma um crédito extra para cada dez esoectadores de comédia
    if("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    //Exibe a linha para esta requisição
    result += ` ${play.name}: ${format(thisAmount/100)} (${perf.audience} seats) \n`
    totalAmount += thisAmount;
  }

  result+= `Amount owed is ${format(totalAmount/100)} \n`; 
  result+= `You earned ${volumeCredits} credits \n`; 

  return result;
}