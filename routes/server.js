const express = require('express');
const router = express.Router();

router.get('/status', async (req, res, next) =>{    
    res.send({status:'ok'})
});

router.get('/shutdown', async (req, res, next) =>{    
    process.exit(0)
});

module.exports = router;