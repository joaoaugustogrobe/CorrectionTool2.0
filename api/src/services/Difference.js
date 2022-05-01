module.exports = {
    equal(str1, str2) {
        const regexParser = /(?:ans[\s]?=[\s]?)?[\s]*(.*)/m; // remove ans= from string
        const _str1 = str1.match(regexParser)[1];
        const _str2 = str2.match(regexParser)[1];
        return _str1 == _str2;
    },
    diff(str1, str2) {
        return !this.equal(str1, str2);
    }
}