module.exports = {
    getAllBrandCategory : function(con,callback){
        con.query(`SELECT bc.rowid, bc.fk_brand,bc.fk_user, bc.name_pm, bc.email_pm, bc.status, b.label brand FROM llx_brand_category bc LEFT JOIN llx_brands b ON bc.fk_brand = b.rowid ORDER BY bc.rowid DESC`, callback)
    },
    getListEmail : function(con,callback){
        con.query(`SELECT bc.fk_user, bc.name_pm, bc.email_pm, bc.status FROM llx_brand_category bc LEFT JOIN llx_brands b ON bc.fk_brand = b.rowid ORDER BY bc.rowid DESC`, callback)
    },
    getAllBrandCategoryByid : function(con,rowid,callback){
        con.query(`SELECT * FROM llx_brand_category WHERE rowid = ${rowid}`, callback)
    },

}