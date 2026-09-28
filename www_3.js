const http = require('http');
//moodul päringu parsimiseks
const url = require('url');
//moodul failitee haldamiseks
const path = require('path');
//moodul failide lugemiseks, ASYNC PUHUL VAJA SEDA TOETAVAT ERILISEMAT MOODULIT
//const fs = require('fs');
const fs = require('fs').promises;
const pageHead = '<!DOCTYPE html>\n<html lang="et">\n<head>\n\t<meta charset="utf-8">\n\t<title>Aleks Andrejev, veevbiprogrammeerimine</title>\n</head>\n<body>\n';
const pageBody = '\t<h1>Aleks Andrejev, veebiprogrammeerimine</h1>\n\t <p>See leht on loodud veebiprogrammeerimise kursusel <a href="https://www.tlu.ee">TLÜs</a> ning ei sislda tõsiseltvõetavat sisu!</p>\n\t<p>Esialgu tutvusime lihtsalt HTML keelega, peatselt programmeerime.</p>\n\t<hr>';
const pageBanner = '<img src="veebiprogrammeerimine_2026_TA.png" alt="">';
const pageFoot = '\n</body>\n</html>';
const dateET = require('./src/dateTimeET');

http.createServer(async function(req, res){
	//parsin urli-i
	console.log('Päring: ' + req.url);
	let currentURL = url.parse(req.url, true);
	console.log('Parsituna: ' + currentURL.pathname);
	
	//hakkame erinevaid lehti jaotama->routes
	if(currentURL.pathname === '/'){
		res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write(pageBody);
		res.write('\n\t<p><img src="avaleht.jpg" alt="Avalehe pilt" style="width: 3cm; height: 3cm; object-fit: contain;"></p>');
		res.write('<p>' + dateET.weekDay() + '</p>' + '<p>' + dateET.fullDate(1) + '</p>' + '<p>' + dateET.fullTime() + '</p>');
		res.write('\n\t<ul>');
		res.write('\n\t\t<li><a href ="/vanasona">Tänane vanasõna</a></li>');
		res.write('\n\t\t<li><a href="/minust">Miks tulin TLÜsse õppima</a></li>');
		res.write('\n\t</ul>');
		res.write(pageFoot);
		//res.write('Veeb läkski käima!');
	return res.end();
	}
	
	else if (currentURL.pathname === '/vanasona'){
		let folkWisdomPath = path.join(__dirname, 'txt', 'vanasonad.txt');
		
		try {
			let rawData = await fs.readFile(folkWisdomPath, 'utf8');
			let folkWisdom = rawData.split(';');
			let randomFolkWisdom = folkWisdom[Math.round(Math.random() * (folkWisdom.length - 1))];

			// Kui lugemine õnnestus, väljastame lehe HTML-i
			res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
			res.write(pageHead);
			res.write(pageBanner);
			res.write('\t<h1>Eesti vanasõnad</h1>\n\t<p>Siin näed tänase päeva vanasõna.</p>\n\t<hr>');
			res.write('\n\t<p><b>Tänane vanasõna:</b> ' + randomFolkWisdom + '</p>');
			res.write('\n\t<p><a href="/">Tagasi avalehele</a></p>');
			res.write(pageFoot);
			return res.end();

		} catch(err) {
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Vanasõna ei leitud');
		}
	}
	
	else if (currentURL.pathname === '/minust'){
		res.writeHead(200, {"Content-type": "text/html; charset=utf-8"});
		res.write(pageHead);
		res.write(pageBanner);
		res.write('\t<h1>Miks tulin TLÜsse õppima?</h1>\n\t<p>Tulin TLÜsse, sest Eestis on bioloogia vaid kahes kohas ning Tartu on väga kaugel ja muuhulgas ka jälestusväärne koht:P</p>\n\t<hr>');
		res.write('\n\t<p><img src="minust.jpg" alt="Minu pilt" style="width: 4cm; height: 4cm; object-fit: contain;"></p>');
		res.write('\n\t<p><a href="/">Tagasi avalehele</a></p>');
		res.write(pageFoot);
		return res.end();
	}
	
	else if(currentURL.pathname === '/veebiprogrammeerimine_2026_TA.png'){
		//teeme pildi tegeliku asukoha programmile kattesaadavaks
		let picPath = path.join(__dirname, 'Pic', currentURL.pathname);
		try {
			const data = await fs.readFile(picPath);
			res.writeHead(200, {"Content-type": "image/png"});
			res.end(data);
		} catch(err){
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Pilti ei leitud');
		}
	}
	
	else if(currentURL.pathname.endsWith('.jpg')){
		let picPath = path.join(__dirname, 'Pic', currentURL.pathname);
		try {
			const data = await fs.readFile(picPath);
			res.writeHead(200, {"Content-type": "image/jpeg"});
			res.end(data);
		} catch(err){
			res.writeHead(404, {"Content-type": "text/plain; charset=utf8"});
			return res.end('Pilti ei leitud');
		}
	}
	
	else {
		res.writeHead(404, {"Content-type": "text/plain; charset=utf-8"});
		res.end('Viga 404, ei leia sellist lehte!');
	}
}).listen(5134);