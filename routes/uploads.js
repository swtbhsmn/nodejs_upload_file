const express = require("express");
const bodyParser = require('body-parser');
const multer = require("multer");
const cors = require('./cors');
const storage = multer.diskStorage(
        {
            destination:(req,file,callback)=>{
                callback(null,'public/uploads');
            },

            filename:(req,file,callback)=>{
                callback(null,file.originalname)
            }
        }
);


const fileTypeValidation = (req,file,callback)=>{
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/)){
        return callback(new Error("Check file extension!"));
    }
    callback(null,true);
}

const upload = multer({storage:storage,fileFilter:fileTypeValidation});

const uploadRouter = express.Router();
uploadRouter.use(bodyParser.json());
uploadRouter.route('/')
.options(cors.corsWithOptions,(req,res)=>{res.statusCode=200;})
.get(cors.cors,(req,res)=>{
    res.end("Uplad Not Valid!");
})
.post(cors.corsWithOptions,upload.single("upload_file"),(req,res)=>{
  res.statusCode = 200;
  res.setHeader('Content-Type',"application/json");
  res.send({status:"Successfully File Uploaded",fileInfo:req.file});
  
})
module.exports = uploadRouter;