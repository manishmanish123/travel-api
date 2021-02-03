module.exports = {
    getUploadUrl: function (req, filename) {
        return req.protocol + '://' + req.get('host') + "/" + process.env.UPLOAD_FOLDER + filename
    },
};