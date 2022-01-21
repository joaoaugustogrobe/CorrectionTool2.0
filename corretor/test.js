let a =cleanString("\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0003ans\u0001\u0000\u0000\u0000\u0000\u0000\u0000\u0003 = \u0001\u0000\u0000\u0000\u0000\u0000\u0000\t 0.33761\n");
console.dir(a)

function cleanString(input) {
    var output = "";
    for (var i=0; i<input.length; i++) {
        if (input.charCodeAt(i) <= 127 && input.charCodeAt(i) >= 11) {
            output += input.charAt(i);
        }
    }
    return output;
}