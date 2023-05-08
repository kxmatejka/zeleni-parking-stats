import fetch from "node-fetch";

const CONFIG = {
	rychtarka: {
		name: "Parkovací dům Rychtářka",
		code: "plzen-parkovaci-dum-rychtarka",
		total: 447,
	},
	"nove-divadlo": {
		name: "Parkovací dům Nové Divadlo",
		code: "plzen-parkovaci-dum-nove-divadlo",
		total: 166,
	},
};

type ParkingHousesNames = keyof typeof CONFIG;

export function extractFreeValueFromHtmlPage(html: string): number {
	const result = html.match(/\<span class="countTo".+>([0-9]+)<\/span>/);
	const numberInResult = result ? result[1] : "";

	return parseInt(numberInResult, 10);
}

async function fetchParkingHouse(name: ParkingHousesNames) {
	const response = await fetch(`https://www.parkingplzen.cz/cz/parkovaci-domy/parkovaci-dum-${name}/`);
	const html = await response.text();
	const free = extractFreeValueFromHtmlPage(html); 
	const config = CONFIG[name];

	return {
		name: config.name,
		code: config.code,
		city: "plzen",
		total: config.total,
		free,
	};
}

export async function fetchPlzen() {
	return await Promise.all([
		fetchParkingHouse("rychtarka"),
		fetchParkingHouse("nove-divadlo"),
	]);
}
