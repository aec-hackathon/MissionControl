var mongoose = require('mongoose');
TriggerRecord = mongoose.model('TriggerRecord');

TriggerRecordService = {

  findAll : function(req, res){
    TriggerRecord.find({},function(err, results) {
      return res.send(results);
    });
  },

  findById : function(req, res){
    var id = req.params.id;
    TriggerRecord.findOne({'_id':id},function(err, result) {
      return res.send(result);
    });
  },

    findByCentralPath : function(req, res){
    var path = req.params.centralpath.toLowerCase();
    TriggerRecord.find({'centralPath':path},function(err, result) {
      return res.send(result);
    });
  },
  
    findByUpdaterId : function(req, res){
    var id = req.params.updaterid;
    TriggerRecord.find({'updaterId':id},function(err, result) {
      return res.send(result);
    });
  },

    /**
     * Get all editing records by Configuration Id and date range.
     * @param req
     * @param res
     */
    findByConfigId : function(req, res){
    var configid = req.params.configid;
    var from = new Date(req.query.from);
    var to = new Date(req.query.to);
    if(from && to){
        TriggerRecord
            .find({
                'configId': configid,
                'edited': {'$gte': from, '$lte': to}}, function (err, result) {
            if(err) return console.log(err);
            return res.send(result);
        })
    } else {
        TriggerRecord
            .find({'configId':configid})
            .sort('-edited')
            .exec(function(err, result) {
                if(err) return console.log(err);
                return res.send(result);
            });
    }},

  findByUniqueId : function(req, res){
    var id = req.params.uniqueid;
    TriggerRecord.find({'elementUniqueId':id},function(err, result) {
      return res.send(result);
    });
  },

  add : function(req, res) {
    TriggerRecord.create(req.body, function (err, result) {
      if (err) return console.log(err);
      return res.send(result);
    });
  },


  update : function(req, res) {
    var id = req.params.id;
    console.log('Updating ' + id);
    TriggerRecord.update({"_id":id}, req.body, {upsert:true},
      function (err, numberAffected) {
        if (err) return console.log(err);
        console.log('Updated %s instances', numberAffected.toString());
        return res.sendStatus(202);
    });
  },

  delete : function(req, res){
    var id = req.params.id;
    TriggerRecord.remove({'_id':id},function(result) {
      return res.send(result);
    });
  },
  
   deleteAllForConfig : function(req, res){
    var id = req.params.configid;
    TriggerRecord.remove({'configId':id},function(err, results) {
      return res.send(results);
    });
  },
  
  deleteAllForFile : function(req, res){
    var path = req.params.centralpath;
    TriggerRecord.remove({'centralpath':path},function(err, results) {
      return res.send(results);
    });
  },

    /**
     * Updates file path value when Configuration is changed.
     * @param req
     * @param res
     */
    updateFilePath: function(req, res){
        var before = req.body.before.replace(/\\/g, "\\").toLowerCase();
        var after = req.body.after.replace(/\\/g, "\\").toLowerCase();
        TriggerRecord
            .update(
                {'centralPath': before},
                {'$set': {'centralPath' : after}}, function (err, result) {
                    var response = {
                        status: 200,
                        message: result
                    };
                    if(err){
                        response.status = 500;
                        response.message = err;
                    } else if(!result){
                        console.log("File Path wasn't found in any Configurations Collections");
                    }
                    res.status(response.status).json(response.message);
                }
            );
    }
  };

module.exports = TriggerRecordService;