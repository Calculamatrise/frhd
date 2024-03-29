export default function paethPredictor(left, above, upLeft) {
	let paeth = left + above - upLeft;
	let pLeft = Math.abs(paeth - left);
	let pAbove = Math.abs(paeth - above);
	let pUpLeft = Math.abs(paeth - upLeft);
	if (pLeft <= pAbove && pLeft <= pUpLeft) {
		return left;
	} else if (pAbove <= pUpLeft) {
		return above;
	}
	return upLeft
}