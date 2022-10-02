import { Webview } from "https://deno.land/x/webview@0.7.5/mod.ts";

const html =
`<!DOCTYPE html>
<html>

<head>
	<title>Rusty Deno RPS</title>
</head>

<body>
	<p id="wins">Wins: 0</p>
	<p id="draws">Draws: 0</p>
	<p id="losses">Losses: 0</p>
	<button onclick="play(0)">Rock</button>
	<button onclick="play(1)">Paper</button>
	<button onclick="play(2)">Scissors</button>
</body>
`;
const webview = new Webview();

let wins = 0;
let losses = 0;
let draws = 0;

// Determine library extension based on your OS.
let libSuffix = "";
switch (Deno.build.os) {
	case "windows":
		libSuffix = "dll";
		break;
	case "darwin":
		libSuffix = "dylib";
		break;
	default:
		libSuffix = "so";
		break;
}

const libName = `./r_p_s.${libSuffix}`;
// Open library and define exported symbols
const dylib = Deno.dlopen(
	libName,
	{
		"player_pick": {parameters: ["u8"], result: "u8"}, 
	}
);

function play(x) {
	const result = dylib.symbols.player_pick(x);
	switch (result) {
		case 0:
			webview.eval("alert('Draw!')");
			draws++;
			changeDraws();
			break;
		case 1:
			webview.eval("alert('You win!')");
			wins++;
			changeWins();
			break;
		case 2:
			webview.eval("alert('You lose!')");
			losses++;
			changeLosses();
			break;
	}
	//console.log(draws + " " + wins + " " + losses);
}


webview.bind('play', play);

//change the wins element
function changeWins() {
	webview.eval(`document.getElementById("wins").innerHTML = "Wins: " + "" + ${wins}`);
}

//change the losses element
function changeLosses() {
	webview.eval(`document.getElementById("losses").innerHTML = "Losses: " + "" + ${losses}`);
}

//change the draws element
function changeDraws() {
	webview.eval(`document.getElementById("draws").innerHTML = "Draws: " + "" + ${draws}`);
}

webview.navigate(`data:text/html,${encodeURIComponent(html)}`);
webview.run();