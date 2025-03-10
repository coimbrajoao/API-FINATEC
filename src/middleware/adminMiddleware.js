const admin= middleware =>{
    return (req,res,next) =>{
        console.log(req.user.admin);
        if(req.user && req.user.admin){
            return next();
        }else{
            res.status(401).send('User is not an admin');
        }
    }
}

module.exports= {admin};