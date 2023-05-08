import { fetchParking } from "../lib/parking/fetch-parking";

async function main() {
	const res = await fetchParking();
	console.log(res);
}

main();