/*
 * DigitalSofia.js
 * Version 1.0.0
 * Created by Debashis Barman (http://www.debashisbarman.in)
 */

var Twit = require('twit');

var Sofia = new Twit({
	consumer_key:		'ZscsM5NR4IlEpC2tF73qzyUFN',
	consumer_secret:	'Mml7W3lxFQ2rnIY75zq5DCuwnxsN4R6TDVdOC65TEUgEG43X9s',
	access_token:		'4313023152-4BEFmk7D3zTBV7Qt4B1UEz1tQYwtxRqi3OAvYgw', 
	access_token_secret:	'4odlLpBsCodxDEC6rXFe61dO2Q0sR4yyJSqBJ5TYczhOY'
});

function SofiaRetweet() {
	Sofia.get('search/tweets', {q: "#randomthoughts OR #technology OR #news OR DebashisBarman", result_type: "recent"}, function (error, data,response) {
		if (!error) {
			var retweetId = data.statuses[0].id_str;
			Sofia.post('statuses/retweet/' + retweetId, { }, function (err, response) {
				if (response) {
					console.log('Retweeted Tweet ID: ' + retweetId);
				}
				if (error) {
					console.log('Retweet Error: ', err);
				}
			});
		} else {
			console.log('Search Error: ', err);
		}
	});
}

SofiaRetweet();
setInterval(SofiaRetweet, 60*60*1000);
