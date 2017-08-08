const MongoClient = require('mongodb').MongoClient;
function _mongos(callback) {
    const url='mongodb://localhost:27017/board';
    MongoClient.connect(url, function(err, db) {
        if(err){
            callback(err, null);
            return;
        }
        callback(err, db);
    });
}

exports.insert=function (collection,json,callback) {
    _mongos(function (err,db) {
        db.collection(collection).insert(json,function (err,result) {
            callback(err,result);
            db.close();
        })
    })
};
exports.find=function (collection,json,c,d) {
    let result=[];
    if(arguments.length ==3){
        var callback=c;
        var skipnumber=0;
        var limit=0;
    }else if(arguments.length==4){
        let args=c;
        var callback=d;
        var skipnumber = args.pageamount * args.page || 0;
        var limit = args.pageamount || 0 ;
        var sort=args.sort || {};
    }else{
        throw new Error("find函数的参数个数，必须是3个，或者4个。");
        return;
    }
    _mongos(function (err,db) {
        let cursor=db.collection(collection).find(json).skip(skipnumber).limit(limit).sort(sort);
        cursor.each(function (err,doc) {
            if(err){
                callback(err,null);
                return;
            }
            if(doc !=null){
                result.push(doc)
            }else{
                callback(null,result);
                db.close();
            }
        })
    })
};
exports.deleteOne=function (collection,json,callback) {
    _mongos(function (err,db) {
        db.collection(collection).deleteOne(json,function (err,result) {
            if(err) throw err;
            callback(err,result);
            db.close();
        })
    })
};
exports.updateMany=function (collection,json1,json2,callback) {
    _mongos(function (err,db) {
        db.collection(collection).updateMany(json1,json2,function (err,result) {
            if(err) throw err;
            callback(err,result);
            db.close();
        })
    })
};
exports.getCount=function (collection,callback) {
    _mongos(function (err,db) {
        db.collection(collection).count({}).then(function(count) {
            callback(count);
            db.close();
        });
    })
}