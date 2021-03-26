module.exports = {
    getUploadUrl: function (req, filename) {
        return req.protocol + '://' + req.get('host') + "/" + process.env.UPLOAD_FOLDER + filename
    },
    getRegex: function(string){
        return {
            $regex: new RegExp('^' + string.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&') + '$', 'i')
        }
    }
};