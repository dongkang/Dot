describe("Utility", function() {
	it("css prefix를 추출한다.", function() {
		var vendor = $.browser,
			p = "";
		if (vendor["mozilla"]) p = "-moz-";
		if (vendor["webkit"]) p = "-webkit-";
		if (vendor["opera"]) p = "-o-";

		expect(dot.Util.cssPrefix()).toBe(p);
	});
});

describe("Canvas Model", function() {
	var c = new dot.Canvas;

	it("기본값(16x16)으로 초기화 된다", function() {
		expect(c.get("width")).toBe(16);
		expect(c.get("height")).toBe(16);
	});

	it("브러쉬 색상이 변경 된다.", function() {
		c.setColor("#ff0000");
		expect(c.get("color")).toBe("#ff0000");
		c.setColor("#aa00CC");
		expect(c.get("color")).toBe("#aa00cc");
		c.setColor("");
		expect(c.get("color")).toBe("#000000");
	});

});