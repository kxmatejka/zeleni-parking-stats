import { expect, test } from "bun:test";
import { dailyAverage, enrichData } from "../../../pages/api/get-data";

test("dailyAverage empty", () => {
	expect(dailyAverage([])).toEqual([]);
});

test("dailyAverage make average of one record", () => {
	expect(dailyAverage([
		[
			"2023-05-06",
			[
				[
					"Pardubice",
					[
						null, 6, null, 10, 12, 15,
					],
				],
			],
		],
	])).toEqual([
		[
			"Pardubice",
			[
				[
					"2023-05-06",
					10.75,
				],
			],
		],
	]);
});

test("dailyAverage make average of one record, two places", () => {
	expect(dailyAverage([
		[
			"2023-05-06",
			[
				[
					"Pardubice",
					[
						null, 6, null, 10, 12, 15,
					],
				],
				[
					"Zelene predmesti",
					[
						null, 6, null, 10, 12, 15,
					],
				],
			],
		],
	])).toEqual([
		[
			"Pardubice",
			[
				[
					"2023-05-06",
					10.75,
				],
			],
		],
		[
			"Zelene predmesti",
			[
				[
					"2023-05-06",
					10.75,
				],
			],
		],
	]);
});

test("dailyAverage make average of multiple record", () => {
	expect(dailyAverage([
		[
			"2023-05-06",
			[
				[
					"Pardubice",
					[
						null, 6, null, 10, 12, 15,
					],
				],
			],
		],
		[
			"2023-05-07",
			[
				[
					"Pardubice",
					[
						5, 7, 9, 10, 4,
					],
				],
			],
		],
	])).toEqual([
		[
			"Pardubice",
			[
				[
					"2023-05-06",
					10.75,
				],
				[
					"2023-05-07",
					7,
				],
			],
		],
	]);
});

test("dailyAverage ignore duplicates", () => {
	expect(dailyAverage([
		[
			"2023-05-06",
			[
				[
					"Pardubice",
					[
						null, 6, null, 10, 12, 15,
					],
				],
				[
					"Pardubice",
					[
						null, 6, null, 10, 12, 15,
					],
				],
			],
		],
	])).toEqual([
		[
			"Pardubice",
			[
				[
					"2023-05-06",
					10.75,
				],
			],
		],
	]);
});

test("enrichData empty", () => {
	expect(enrichData([])).toEqual([]);
});

test("enrichData non empty", () => {
	expect(enrichData([
		[
			"Karla IV > Karlovina",
			[
				[
					"2023-05-06",
					10.75,
				],
			],
		],
	])).toEqual([
		{
			"id": "Karla IV > Karlovina",
			"days": [
				{
					"date": "2023-05-06",
					"free": 10.75,
					"occupancy": 88.05555555555556,
					"total": 90,
					"used": 79.25,
				},
			],
		},
	]);
});
