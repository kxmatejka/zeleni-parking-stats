import { fetchParking } from "../lib/parking/fetch-parking";
import { fetchUstiNadLabem } from "../lib/parking/fetchers/fetch-usti-nad-labem";

async function main() {
	const res = await fetchUstiNadLabem();
	console.log(res);
}

main();