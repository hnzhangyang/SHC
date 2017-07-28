function trim(str) {
    if (str.trim) {
        return str.trim()
    }

    return str
        .replace(/^\s*/, '')
        .replace(/\s*$/, '')
}

module.exports = {
    trim: trim
}