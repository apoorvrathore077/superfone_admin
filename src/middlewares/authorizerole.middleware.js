export default function authorizeRole(requiredRole){
    return(req,res,next) =>{
        try{
            const user = req.user;
            if(!user) return res.status(400).json({message:"No user found."});
            if(user.global_role !== requiredRole) return res.status(401).json({message:"You are not authorized"});
            next();
        }catch(err){
            console.log(err.message);
            return res.status(500).json({error:err.message});
        }
    }
}