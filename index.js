const express=require('express');
const app=express();
const path=require('path');
const mod=require('./moudle/index');
const formidable = require('formidable');
const ObjectId=require('mongodb').ObjectID;

app.set('view engine','jade');
app.set('views',path.join(__dirname,'views'));
app.use(express.static('./static'));

app.get('/board',function (req,res) {
    let page=req.query.page;
    mod.find('message',{},{'pageamount':4,'page':page,sort:{'time':-1}},function (err,result) {
        if(err) throw err;
        mod.getCount('message',function (count) {
            res.render('index',{results:result,pages:Math.ceil(count/4)})
        });
    });
});
app.get('/delete',function (req,res) {
    let id=req.query.id;
    mod.deleteOne('message',{'_id':ObjectId(id)},function (err,result) {
       if(err) throw err;
        res.redirect('/board')
    })
})
app.post('/',function (req,res) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files){
        mod.insert('message',{'name':fields.name,'msg':fields.msg,'time':new Date()},function (err,result) {
            if(err) throw err;
            res.redirect('/board')
        })
    });
})

app.use(function (req,res) {
    res.render('notfind')
});

app.listen(3000);