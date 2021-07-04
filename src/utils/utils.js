export function fck (num, pow = 8, bit = 2) {
  if (/^\d+\.?\d*$/.test(`${num}`)) {
    let val = parseFloat(num)
    val *= Math.pow(10, pow)
    return Number(val).toFixed(bit)
  }
  return num
}
