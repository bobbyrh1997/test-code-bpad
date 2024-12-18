module.exports = {
    dashboardPage : async(req,res,next)=>{
        return res.render('dashboard/home',{
            title : 'Home'
        })
    }
}