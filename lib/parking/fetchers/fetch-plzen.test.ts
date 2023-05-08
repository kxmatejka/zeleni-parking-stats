import { extractFreeValueFromHtmlPage } from "./fetch-plzen";
import { expect, test } from "bun:test";

test("extractFreeValueFromHtmlPage", () => {
	expect(extractFreeValueFromHtmlPage(`
		<div class="col-lg-6">
			<div class="piechart" data-color="#ffffff" data-trackcolor="rgba(250,0,0,0.5)" data-size="120" data-percent="33,3" data-width="10" data-animate="1700">
				<span class="fs-40" style="line-height:120px !important; height:120px !important; width:120px !important">
					<span class="countTo" data-speed="1700" style="line-height:120px !important; height:120px !important; width:120px !important">149</span>
				</span>
			</div>
			<small class="places-info">volných míst</small>
		</div>
	`)).toEqual(149);
});
