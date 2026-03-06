// --- STAN GRY ---
let balances = {
btc: parseFloat(localStorage.getItem("btc")||0),
eth: parseFloat(localStorage.getItem("eth")||0),
doge: parseFloat(localStorage.getItem("doge")||0),
ltc: parseFloat(localStorage.getItem("ltc")||0),
ada: parseFloat(localStorage.getItem("ada")||0)
};

let speed = parseFloat(localStorage.getItem("speed")||0.000001);
let mining = null;
let history = JSON.parse(localStorage.getItem("history")||[]);

let chart = document.getElementById("chart");
let ctx = chart.getContext("2d");

// --- CENY KRYPTOWALUT ---
let prices = {btc:30000, eth:2000, doge:0.07, ltc:150, ada:0.5};
function updatePrices(){
for(let coin in prices){
prices[coin] *= 1 + (Math.random()-0.5)/50;
}
document.getElementById("prices").innerHTML = Object.keys(prices).map(c=>c.toUpperCase()+": $"+prices[c].toFixed(2)).join("<br>");
}
setInterval(updatePrices,5000);

// --- FUNKCJE KOPANIA ---
function update(){
document.getElementById("btc").innerText = "BTC: "+balances.btc.toFixed(8);
document.getElementById("eth").innerText = "ETH: "+balances.eth.toFixed(8);
document.getElementById("doge").innerText = "DOGE: "+balances.doge.toFixed(8);
document.getElementById("ltc").innerText = "LTC: "+balances.ltc.toFixed(8);
document.getElementById("ada").innerText = "ADA: "+balances.ada.toFixed(8);
document.getElementById("speed").innerText = speed.toFixed(6);

localStorage.setItem("btc", balances.btc);
localStorage.setItem("eth", balances.eth);
localStorage.setItem("doge", balances.doge);
localStorage.setItem("ltc", balances.ltc);
localStorage.setItem("ada", balances.ada);
localStorage.setItem("speed", speed);
localStorage.setItem("history", JSON.stringify(history));

drawChart();
}

function start(){
if(mining) return;
mining = setInterval(()=>{
balances.btc += speed;
balances.eth += speed*0.02;
balances.doge += speed*50;
balances.ltc += speed*0.005;
balances.ada += speed*0.01;

history.push(balances.btc);
if(history.length>30) history.shift();

update();
},1000);
}

function stop(){clearInterval(mining);mining=null;}

// --- REALNE MINERY ---
const miners = {
"Antminer S19": {price:3000, speed:0.00005},
"WhatsMiner M30S++": {price:2800, speed:0.000045},
"Antminer S19 Pro": {price:4000, speed:0.00006},
"AvalonMiner 1246": {price:3200, speed:0.00005}
};

function buyMiner(name){
const miner = miners[name];
let confirmation = confirm(`Kup ${name} za $${miner.price}? Symulacja płatności.`);
if(confirmation){
speed += miner.speed;
alert(`${name} zakupiony! Prędkość kopania +${miner.speed.toFixed(6)} BTC/s`);
update();
}
}

// --- GIEŁDA ---
function buyCoin(){
let coin = document.getElementById("coinSelect").value;
let amount = parseFloat(document.getElementById("amount").value);
if(isNaN(amount)||amount<=0) return;
let cost = amount*prices[coin];
if(balances.btc >= cost){
balances.btc -= cost;
balances[coin] += amount;
update();
}else alert("Za mało BTC!");
}

function sellCoin(){
let coin = document.getElementById("coinSelect").value;
let amount = parseFloat(document.getElementById("amount").value);
if(isNaN(amount)||amount<=0) return;
if(balances[coin]>=amount){
balances[coin]-=amount;
balances.btc += amount*prices[coin];
update();
}else alert("Nie masz tyle coina!");
}

// --- WYKRES ---
function drawChart(){
ctx.clearRect(0,0,chart.width,chart.height);
ctx.beginPath();
ctx.strokeStyle="#22c55e";
ctx.lineWidth=2;
for(let i=0;i<history.length;i++){
let x = i*(chart.width/30);
let y = chart.height - (history[i]/0.01)*chart.height;
if(y>chart.height) y=chart.height;
if(i==0) ctx.moveTo(x,y);
else ctx.lineTo(x,y);
}
ctx.stroke();
}

// --- TRYB DZIEŃ/NOC ---
function setDayNight(){
let h = new Date().getHours();
if(h>=6 && h<18) document.body.classList.add("day");
else document.body.classList.remove("day");
}
setDayNight();
setInterval(setDayNight,60000);

update();
