export default {
	font: "monospace",
	fontSize: "10px",
	letterSpacing: 1,
	A(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	B(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	C(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	D(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 4 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 4 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 4 + offset, y + parseInt(this.fontSize));
	},
	E(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	F(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	G(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	H(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	I(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	J(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	K(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	L(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	M(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	N(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	O(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	P(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
	},
	Q(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.moveTo(x + parseInt(this.fontSize) + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize) / 2);
	},
	R(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	S(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	T(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	U(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	V(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	W(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
	},
	X(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	Y(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.moveTo(x + offset, y);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	Z(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	0(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	1(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 4 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	2(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	3(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
	},
	4(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	5(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	6(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
	},
	7(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	8(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	9(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	"."(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y + parseInt(this.fontSize) / 1.2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	","(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y + parseInt(this.fontSize) / 1.5);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 5 + offset, y + parseInt(this.fontSize) * 1.2);
	},
	":"(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize) / 2);
		ctx.moveTo(x + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	";"(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize) / 2);
		ctx.moveTo(x + offset, y + parseInt(this.fontSize) / 4);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize) / 1.5);
		ctx.lineTo(x - parseInt(this.fontSize) / 4 + offset, y + parseInt(this.fontSize));
	},
	"!"(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize) / 3);
		ctx.moveTo(x + offset, y + parseInt(this.fontSize) / 1.2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	"?"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + offset, y);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize) / 3);
		ctx.moveTo(x + offset, y + parseInt(this.fontSize) / 1.2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	"+"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.moveTo(x + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize) / 2);
	},
	"="(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 1.6 + offset, y - parseInt(this.fontSize) / 5);
		ctx.lineTo(x + parseInt(this.fontSize) / 1.6 + offset, y - parseInt(this.fontSize) / 5);
		ctx.moveTo(x - parseInt(this.fontSize) / 1.6 + offset, y + parseInt(this.fontSize) / 5);
		ctx.lineTo(x + parseInt(this.fontSize) / 1.6 + offset, y + parseInt(this.fontSize) / 5);
	},
	"-"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
	},
	"_"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) + offset, y + parseInt(this.fontSize));
	},
	"("(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	")"(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	"["(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	"]"(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
	},
	"{"(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	"}"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	"<"(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 1.6);
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 1.6);
	},
	"'"(ctx, x, y, offset) {
		ctx.moveTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize) / 1.6);
	},
	"\""(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize) / 1.6);
		ctx.moveTo(x + parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize) / 1.6);
	},
	"@"(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x - parseInt(this.fontSize) / 5 + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x - parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 5 + offset, y + parseInt(this.fontSize) / 2);
	},
	"#"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 5 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x + parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 5 + offset, y + parseInt(this.fontSize));
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize) / 2);
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 2);
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize) / 2);
	},
	"Δ"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	"∫"(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 5 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + offset, y + parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 5 + offset, y + parseInt(this.fontSize));
	},
	"/"(ctx, x, y, offset) {
		ctx.moveTo(x + parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x - parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	},
	"\\"(ctx, x, y, offset) {
		ctx.moveTo(x - parseInt(this.fontSize) / 2 + offset, y - parseInt(this.fontSize));
		ctx.lineTo(x + parseInt(this.fontSize) / 2 + offset, y + parseInt(this.fontSize));
	}
}