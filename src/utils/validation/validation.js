function existsOrError(value, msg) {
    if (!value) throw msg;
    if (Array.isArray(value) && value.length === 0) throw msg;
    if (typeof value === "string" && !value.trim()) throw msg;
}

function notExistsOrError(value, msg) {
    try {
        existsOrError(value, msg);
    } catch (msg) {
        return;
    }
    throw msg;
}

function equalsOrError(valueA, valueB, msg) {
    if (valueA !== valueB) throw msg;
}

function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    if (!re.test(email)) throw "Invalid e-mail";
}

module.exports = {
    existsOrError,
    notExistsOrError,
    equalsOrError,
    validateEmail,
};