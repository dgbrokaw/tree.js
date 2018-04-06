var b32 = 0x100000000, f = 0xf, b = []
   ,str = ['0','1','2','3','4','5','6','7','8','9','a','b','c','d','e','f'];

// Returns a random hex number with 16 digets as string.
export default function id() {
  var i = 0;
  var r = Math.random()*b32;
  b[i++] = str[r & f];
  b[i++] = str[r>>>4 & f];
  b[i++] = str[r>>>8 & f];
  b[i++] = str[r>>>12 & f];
  b[i++] = str[r>>>16 & f];
  b[i++] = str[r>>>20 & f];
  b[i++] = str[r>>>24 & f];
  b[i++] = str[r>>>28 & f];
  r = Math.random()*b32;
  b[i++] = str[r & f];
  b[i++] = str[r>>>4 & f];
  b[i++] = str[r>>>8 & f];
  b[i++] = str[r>>>12 & f];
  b[i++] = str[r>>>16 & f];
  b[i++] = str[r>>>20 & f];
  b[i++] = str[r>>>24 & f];
  b[i++] = str[r>>>28 & f];
  return "_" + b.join("");
}
