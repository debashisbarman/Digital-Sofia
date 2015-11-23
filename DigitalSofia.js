/*!
 * Digital Sofia 1.0.2 (http://www.debashisbarman.in/Digital-Sofia)
 * Created by Debashis Barman (http://www.debashisbarman.in)
 * Licensed under http://creativecommons.org/licenses/by-sa/3.0
 */

var Twit = require('twit');

var Sofia = new Twit({
	consumer_key: 'ZscsM5NR4IlEpC2tF73qzyUFN',
	consumer_secret: 'Mml7W3lxFQ2rnIY75zq5DCuwnxsN4R6TDVdOC65TEUgEG43X9s',
	access_token: '4313023152-4BEFmk7D3zTBV7Qt4B1UEz1tQYwtxRqi3OAvYgw', 
	access_token_secret: '4odlLpBsCodxDEC6rXFe61dO2Q0sR4yyJSqBJ5TYczhOY'
});

var Client = require('node-rest-client').Client;

var wordnik = {
	hasDictionaryDef: false,
	includePartOfSpeech: "verb-transitive",
	minCorpusCount: 0,
	maxCorpusCount: -1,
	minDictionaryCount: 1,
	maxDictionaryCount: -1,
	minLength: 5,
	maxLength: -1,
	limit: 2,
	api_key: "bcfa8705c0c8020bf5628a433290158a307a01f196fd69145"
};

client = new Client();

var stream = Sofia.stream('user');

stream.on('follow', SofiaGotNewFollower);

stream.on('tweet', SofiaReply);

function SofiaTweet(message) {

	var tweet = {
		status: message
	}

	Sofia.post('statuses/update', tweet, SofiaTweeted);

	function SofiaTweeted(error, data, response) {
		if (error) {
			console.log("Sofia could not tweet, " + error);
		} 
		else {
			console.log("Sofia tweeted : " + message);
		}
	}
}

function SofiaRetweet() {

	var query = {
		q: "DebashisBarman OR #technology OR #design OR #randomthoughts",
		result_type: "recent",
	}

	Sofia.get('search/tweets', query, SofiaGotLatestTweet);

	function SofiaGotLatestTweet (error, data, response) {
		if (error) {
			console.log('Sofia could not find latest tweet, : ' + error);
		}
		else {
			var id = {
				id : data.statuses[0].id_str
			}

			Sofia.post('statuses/retweet/:id', id, SofiaRetweeted);
			
			function SofiaRetweeted(error, response) {
				if (error) {
					console.log('Sofia could not retweet, : ' + error);
				}
				else {
					console.log('Sofia retweeted : ' + id.id);
				}
			}
		}
	}
}

function SofiaGotNewFollower(data) {

	var screenName = data.source.screen_name;

	SofiaTweet('Hi @' + screenName + ' ! Thank you for following me.');	
}

function SofiaReply(data) {

	var replyto = data.in_reply_to_screen_name;
	var text = data.text;
	var from = data.user.screen_name;

	if (replyto == 'digitalsofia') {
		SofiaTweet('@' + from + ' ! Thank you for tweeting me.');	
	}
}

function SofiaWordTweet() {
	
	var date = new Date();

	var wordnikURL = 'http://api.wordnik.com:80/v4/words.json/wordOfTheDay?date=' + date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
	console.log(wordnikURL);

	for(var option in wordnik) {
		wordnikURL = wordnikURL + "&" + option + "=" + wordnik[option];
	}

	var args = {
		headers: {
			'Accept':'application/json'
		}
	}

	client.get(wordnikURL, args, function (data, response) {
	
		if (response.statusCode === 200) {

			var result = JSON.parse(data);

			if (result.definitions[0].text.length > 140) {
				SofiaTweet('Sofia\'s #WordOfTheDay is ' + result.word.capitalizeFirstLetter() + ', ' + result.definitions[0].partOfSpeech);
			}
			else {
				SofiaTweet('Sofia\'s #WordOfTheDay is ' + result.word.capitalizeFirstLetter() + ', ' + result.definitions[0].partOfSpeech + ' (1/2)');
				SofiaTweet(result.word.capitalizeFirstLetter() + ' : ' + result.definitions[0].text + ' (2/2)');
			}
		} 
	});
}

String.prototype.capitalizeFirstLetter = function() {
	return this.charAt(0).toUpperCase() + this.slice(1);
}

SofiaWordTweet(wordnik);
setInterval(SofiaWordTweet, 24*60*60*1000);

SofiaRetweet();
setInterval(SofiaRetweet, 30*60*1000);
