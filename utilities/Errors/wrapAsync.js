//Error handling method used instead of try-catch block
function wrapAsync(fn)
//seending a funcction as a parameter in another function
{
    return function(err,req,res,next)
    //returning a function that executes the function received as parameter and navigates to the next method function if an error occured 
    {
        fn(req,res,next).catch(next);
        //catch block to navigate to next method
    }
}
module.exports=wrapAsync;