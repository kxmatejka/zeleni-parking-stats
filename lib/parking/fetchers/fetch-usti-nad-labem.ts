import fetch from "node-fetch";

const CONFIG = {
	"marianska-skala": {
		id: 1,
		name: "Mariánská skála ",
		code: "usti-nad-label-marianska-skala",
		total: 171,
	},
	"hlavni-nadrazi": {
		id: 2,
		name: "Hlavní nádraží ",
		code: "usti-nad-labem-nove-divadlo",
		total: 95,
	},
};

type ParkingHousesNames = keyof typeof CONFIG;

async function fetchParkingHouse(name: ParkingHousesNames) {
	const config = CONFIG[name];
	const response = await fetch(`https://www.usti-nad-labem.cz/components/magul/parkovani/index.php?id=${config.id}`);
	const html = await response.text();
	const free = extractFreeValueFromHtmlPage(html); 

	return {
		name: config.name,
		code: config.code,
		city: "usti-nad-labem",
		total: config.total,
		free,
	};
}

export function extractFreeValueFromHtmlPage(html: string): number {
	const result = html.match(/\<div class="progress-bar.+>([0-9]+).+<\/div>/);
	const numberInResult = result ? result[1] : "";

	return parseInt(numberInResult, 10);
}

export async function fetchUstiNadLabem() {
	return await Promise.all([
		fetchParkingHouse("marianska-skala"),
		fetchParkingHouse("hlavni-nadrazi"),
	]);
}
