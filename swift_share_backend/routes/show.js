const router = require('express').Router();
const File = require('../models/file');

router.get('/:uuid', async (req, res) => {
    try {
        const file = await File.findOne({ uuid: req.params.uuid });
        // Link expired
        if(!file) {
            return res.send( { error: 'Link has been expired.'});
        } 
        return res.send( { uuid: file.uuid, fileName: file.filename, fileSize: file.size, downloadLink: `${process.env.CLIENT_URL}/download_now/${file.uuid}` });
    } catch(err) {
        return res.send({ error: 'Something went wrong.'});
    }
});


module.exports = router;