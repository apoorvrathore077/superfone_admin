export default function errorHandler(err,req,res,next){
    console.error(err.stack);
    res.status(500)
    .json({
        sucess:"false",
        message:err.message || "Internal Server Error"
    });
}