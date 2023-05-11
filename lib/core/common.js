module.exports = {
  stripWhitespace: stripWhitespace
}

function stripWhitespace (str) {
    if (!str) { return str; }
    return str.trim();
};
