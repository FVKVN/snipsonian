module.exports = function writeFile({filePath, data, options = {}, fs}) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, options, (err) => {
            if (err) return reject(err);
            return resolve();
        });
    });
};
