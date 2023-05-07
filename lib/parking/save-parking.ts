import { connect } from "@planetscale/database";
import type { Parking } from "./fetch-parking";

const config = {
	url: process.env["DATABASE_URL"],
};

const connection = connect(config);

export async function saveParking(parking: Parking[]) {
	await Promise.all(
		parking.map(
			(record) => connection.execute("INSERT INTO parking_spaces (name, code, city, total, free) VALUES (?, ?, ?, ?, ?)", [record.name, record.code, record.city, record.total, record.free])
		)
	);
}
