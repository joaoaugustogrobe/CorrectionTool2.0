

export function parseOutput(input) {
    var output = "";
    for (var i = 0; i < input.length; i++) {
        if (input.charCodeAt(i) <= 127 && input.charCodeAt(i) >= 11) {
            output += input.charAt(i);
        }
    }
    return output;
}