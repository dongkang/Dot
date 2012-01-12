describe("Test Runner", function() {
	it("무조건 true인지 확인한다", function() {
		expect(true).toBeTruthy();
	});
});

describe("Canvas Model", function() {
	var canvas = new Canvas;

	it("기본값으로 초기화 된다", function() {
		expect(canvas.get("width")).toBe(32);
		expect(canvas.get("height")).toBe(32);
	});

	it("브러쉬 색상이 변경 된다.", function() {
		
	});

});