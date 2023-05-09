
import { extractFreeValueFromHtmlPage } from "./fetch-usti-nad-labem";
import { expect, test } from "bun:test";

const html = `<!doctype html>
<html lang="en">
  <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta http-equiv="refresh" content="60" />
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
  </head>
<body>
<div style="float: left; display: flex; padding: 6px; width: 130px"><a href="https://mapy.cz/s/3guU8" target="_blank" style="color: black">Mariánská skála </a></div>
<div class="progress" style="height: 40px; margin: 10px; flex: 100%;" alt="8. 5. 2023 (11:50)" title="8. 5. 2023 (11:50)">
  <div class="progress-bar bg-success progress-bar-striped" role="progressbar" style="width: 20.46783625731%" aria-valuenow="35" aria-valuemin="0" aria-valuemax="171">35 / 171</div>
</div>
<div style="clear: both"></div>

</body>
</html>`;

test("extractFreeValueFromHtmlPage 1", () => {
	expect(extractFreeValueFromHtmlPage(html)).toEqual(35);
});
