describe("Utility", function() {
	it("css prefix를 추출한다.", function() {
		var vendor = $.browser,
			p = "";
		if (vendor["mozilla"]) p = "-moz-";
		if (vendor["webkit"]) p = "-webkit-";
		if (vendor["opera"]) p = "-o-";

		expect(dot.Util.cssPrefix()).toBe(p);
	});
	it("다국어 지원 텍스트를 가져온다.", function() {
		dot.Text.change("ko");
		expect(dot.Text.get("LANGUAGE")).toBe("언어");
		dot.Text.change("en");
		expect(dot.Text.get("LANGUAGE")).toBe("Language");
	});
});

describe("Canvas Model", function() {
	var c = new dot.Canvas;	// 16x16 사이즈 캔버스 생성

	beforeEach(function() {
		c.setColor("");
	});

	it("기본값(16x16)으로 초기화 된다", function() {
		expect(c.get("width")).toBe(16);
		expect(c.get("height")).toBe(16);
	});

	it("실사이즈(320px x 320px)으로 초기화 된다", function() {
		expect(c.get("actualWidth")).toBe(320);
		expect(c.get("actualHeight")).toBe(320);
	});

	it("그려진 데이터가 저장되고 있다.", function() {
		c.point(0, 0);
		expect(c.get("pixel")[0][0]).toBe("#000000");
		c.point(319, 319);
		expect(c.get("pixel")[15][15]).toBe("#000000");
		c.point(0, 0);
		expect(c.get("pixel")[0][0]).toBeNull();
	});

	it("브러쉬 색상이 변경 된다.", function() {
		c.setColor("#ff0000");
		expect(c.get("color")).toBe("#ff0000");
		c.setColor("#aa00CC");
		expect(c.get("color")).toBe("#aa00cc");
		c.setColor("");
		expect(c.get("color")).toBe("#000000");
	});

	it("데이터를 모두 삭제 한다.", function() {
		var p, valid = null;
		c.clearPixel(true);
		p = c.get("pixel");
		for (var x=0; x<16; x++) {
			for (var y=0; y<16; y++) {
				valid = p[x][y];
			}
		}
		expect(valid).toBeFalsy();
	});

	it("그리드 상태를 변경 한다.", function() {
		c.setGridMode(false);
		expect(c.get("grid")).toBeFalsy();
		c.setGridMode();
		expect(c.get("grid")).toBeTruthy();
	});

	it("그리기, 움직이기 상태를 변경 한다.", function() {
		expect(dot.CANVAS_MODE.DRAW).toBe("draw");
		expect(dot.CANVAS_MODE.HAND).toBe("hand");
		c.setHandMode();
		expect(c.get("mode")).toBe(dot.CANVAS_MODE.HAND);
		c.setHandMode(false);
		expect(c.get("mode")).toBe(dot.CANVAS_MODE.DRAW);
	});

	it("undo, redo 실행하면 상태 복원을 한다.", function() {
		c.clearPixel(true);
		expect(c.get("history").length).toBe(0);

		c.point(0, 0);
		c.point(319, 319);
		c.undo();
		expect(c.get("pixel")[0][0]).toBe("#000000");
		expect(c.get("pixel")[15][15]).toBeFalsy();
		c.undo();
		expect(c.get("pixel")[0][0]).toBeFalsy();
		expect(c.get("pixel")[15][15]).toBeFalsy();
		c.redo();
		expect(c.get("pixel")[0][0]).toBe("#000000");
		c.setColor("#ff0000");
		c.point(319, 319);
		expect(c.get("pixel")[15][15]).toBe("#ff0000");
		c.undo(); 
		c.redo(); 
		c.redo();
		expect(c.get("pixel")[15][15]).toBe("#ff0000");
	});

});