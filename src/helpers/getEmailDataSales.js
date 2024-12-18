const { getDataSales,getDataEgogoAiSales,getSubTotalDataSales,getDataSubtotalEgogoAiSales} = require("../modul/emailbrand/model/method/emailBrand");
const getMarketingSpending = require("./getMarketingSpending");
const getSalesTarget = require("./getSalesTarget");

const brandCategory = require("../modul/emailbrand/model/schema/brandCategory");
const brand = require("../modul/emailbrand/model/schema/brand");
const shopMp = require("../modul/emailbrand/model/schema/shopMp")

// Models
const salesTarget = require("../modul/emailbrand/model/schema/salesTarget");
const marketingSpending = require("../modul/emailbrand/model/schema/marketingSpending")


module.exports = {
    DataYesterday : async(start_date,end_date,arrayBrand,emailPic,idrToUsd)=>{

        let resultDataYesterday = await getDataSales(start_date,end_date,arrayBrand);

        let dataEmailSalesYesterday = []

        for(let dataYesterday of resultDataYesterday){
            try {
                let brand_name = dataYesterday.brand;
                let brand_cde = dataYesterday.brand_code;
                let gmvRp = dataYesterday.gmv_total_rp;

                if(gmvRp > 0){
                    // Find Brand Sales Target
                    let brandSalesTarget = await salesTarget.findOne({"brand_code" : brand_cde});
                    let sales_target = brandSalesTarget.daily_target
                    let sales_reach = sales_target == 0 ? 100 : parseFloat((Number(gmvRp)/Number(sales_target))*100)
    
                    dataYesterday['sales_target'] = sales_target;
                    dataYesterday['sales_reach'] = sales_reach;
                    
                    dataEmailSalesYesterday.push(dataYesterday);    
                }
            } catch (error) {
                console.log(error)   
            }
            
        };
        
        // // Check If PIC have egogo ai data
        // let checkEgogoAiUser = await brandCategory.findOne({$and : [{"email_pm" : emailPic},{"brand_id" : "9289345461a58cf08c316087"}]});
        // if(checkEgogoAiUser){
        //     let findEgogoAiData = await brand.findOne({"brand_name" : "EGOGO AI"});
        //     let findStoreEgogoAi = await shopMp.find({$and : [
        //         {"brand" : "EGOGO AI"},
        //         {"shopid" :{$exists : true}}
        //     ]});

        //     let arrayShopidPersonalStore = []

        //     for(let storeAi of findStoreEgogoAi){
        //         let shopid = storeAi.shopid;
        //         arrayShopidPersonalStore.push(shopid)
        //     };

        //     let findEgogoAiSalesData = await getDataEgogoAiSales(arrayShopidPersonalStore,start_date,end_date);

        //     for(let dataSales of findEgogoAiSalesData){
        //         // let team = findEgogoAiData.description;
        //         let team = "Personal Store";
        //         // let name = findEgogoAiData.brand_user;
        //         let name = "Hannah Xiao";
        //         let brandName = dataSales.store_name.toUpperCase();
        //         let brand_code = findEgogoAiData.brand_code;
        //         let gmv_total_rp = dataSales.gmv_total_rp;
        //         let gmv_total_usd = gmv_total_rp/idrToUsd;
        //         let in_the_team = 100;
        //         let order_count = dataSales.order_count;
        //         let product_sold = dataSales.product_sold;
        //         let avg_order_size_rp = gmv_total_rp/order_count;
        //         let avg_order_size_usd = avg_order_size_rp/idrToUsd;
        //         let avg_product_size_rp = gmv_total_rp/product_sold;
        //         let avg_product_size_usd = avg_order_size_rp/idrToUsd;
        //         let sales_target = 0;
        //         let sales_reach = sales_target != 0 ? Math.round(((gmv_total_rp/sales_target)*100)*100)/100 : 100;
    
        //         let dataPushEgogoAi = {
        //             team,
        //             name,
        //             brand : brandName,
        //             brand_code,
        //             gmv_total_rp,
        //             gmv_total_usd,
        //             in_the_team,
        //             order_count,
        //             product_sold,
        //             avg_order_size_rp,
        //             avg_order_size_usd,
        //             avg_product_size_rp,
        //             avg_product_size_usd,
        //             sales_target,
        //             sales_reach
        //         };
        //         dataEmailSalesYesterday.push(dataPushEgogoAi)
        //     }

        //     // if(findEgogoAiSalesData.length > 0){
        //     //     // let team = findEgogoAiData.description;
        //     //     let team = "Personal Store";
        //     //     // let name = findEgogoAiData.brand_user;
        //     //     let name = "Hannah Xiao";
        //     //     let brandName = findEgogoAiSalesData[0].store_name;
        //     //     let brand_code = findEgogoAiData.brand_code;
        //     //     let gmv_total_rp = findEgogoAiSalesData[0].gmv_total_rp;
        //     //     let gmv_total_usd = gmv_total_rp/idrToUsd;
        //     //     let in_the_team = 100;
        //     //     let order_count = findEgogoAiSalesData[0].order_count;
        //     //     let product_sold = findEgogoAiSalesData[0].product_sold;
        //     //     let avg_order_size_rp = gmv_total_rp/order_count;
        //     //     let avg_order_size_usd = avg_order_size_rp/idrToUsd;
        //     //     let avg_product_size_rp = gmv_total_rp/product_sold;
        //     //     let avg_product_size_usd = avg_order_size_rp/idrToUsd;
        //     //     let sales_target = 0;
        //     //     let sales_reach = sales_target != 0 ? Math.round(((gmv_total_rp/sales_target)*100)*100)/100 : 100;
    
        //     //     let dataPushEgogoAi = {
        //     //         team,
        //     //         name,
        //     //         brand : brandName,
        //     //         brand_code,
        //     //         gmv_total_rp,
        //     //         gmv_total_usd,
        //     //         in_the_team,
        //     //         order_count,
        //     //         product_sold,
        //     //         avg_order_size_rp,
        //     //         avg_order_size_usd,
        //     //         avg_product_size_rp,
        //     //         avg_product_size_usd,
        //     //         sales_target,
        //     //         sales_reach
        //     //     };
        //     //     dataEmailSalesYesterday.push(dataPushEgogoAi)
        //     // };
        // };

        return dataEmailSalesYesterday
    },
    DataMonthly : async(start_date,end_date,arrayBrand,emailPic,idrToUsd)=>{

        let resultDataMonthly = await getDataSales(start_date,end_date,arrayBrand)

        let dataEmailSalesMonthly = []

        for(let dataMonthly of resultDataMonthly){
            let brand_name = dataMonthly.brand;
            let brand_cde = dataMonthly.brand_code;
            let gmvRp = dataMonthly.gmv_total_rp;

            if(gmvRp > 0){
                // Find Brand Sales Target
                let brandSalesTarget = await salesTarget.findOne({"brand_code" : brand_cde});
                let sales_target = brandSalesTarget.monthly_target
                let sales_reach = sales_target == 0 ? 100 : parseFloat((Number(gmvRp)/Number(sales_target))*100);
    
                // Find Brand Marketing Spending
                let brandMarketingSpending = await marketingSpending.findOne({"brand_code" : brand_cde});
                let mkt_spending = brandMarketingSpending.amount_monthly;
                let roas = mkt_spending == 0 ? 0 : parseFloat(Number(gmvRp)/Number(mkt_spending));
    
                dataMonthly['mkt_spending'] = mkt_spending;
                dataMonthly['roas'] = roas;
                dataMonthly['sales_target'] = sales_target;
                dataMonthly['sales_reach'] = sales_reach;
    
                dataEmailSalesMonthly.push(dataMonthly)
            }

        };

        // let checkEgogoAiUser = await brandCategory.findOne({$and : [{"email_pm" : emailPic},{"brand_id" : "9289345461a58cf08c316087"}]});
        // if(checkEgogoAiUser){
        //     let findEgogoAiData = await brand.findOne({"brand_name" : "EGOGO AI"});
        //     let findStoreEgogoAi = await shopMp.find({$and : [
        //         {"brand" : "EGOGO AI"},
        //         {"shopid" :{$exists : true}}
        //     ]});

        //     let arrayShopidPersonalStore = []

        //     for(let storeAi of findStoreEgogoAi){
        //         let shopid = storeAi.shopid;
        //         arrayShopidPersonalStore.push(shopid)
        //     };

        //     let findEgogoAiSalesData = await getDataEgogoAiSales(arrayShopidPersonalStore,start_date,end_date);

        //     for(let dataSales of findEgogoAiSalesData){
        //         // let team = findEgogoAiData.description;
        //         let team = "Personal Store";
        //         // let name = findEgogoAiData.brand_user;
        //         let name = "Hannah Xiao";
        //         let brandName = dataSales.store_name.toUpperCase();
        //         let brand_code = findEgogoAiData.brand_code;
        //         let gmv_total_rp = dataSales.gmv_total_rp;
        //         let gmv_total_usd = gmv_total_rp/idrToUsd;
        //         let in_the_team = 100;
        //         let order_count = dataSales.order_count;
        //         let product_sold = dataSales.product_sold;
        //         let avg_order_size_rp = gmv_total_rp/order_count;
        //         let avg_order_size_usd = avg_order_size_rp/idrToUsd;
        //         let avg_product_size_rp = gmv_total_rp/product_sold;
        //         let avg_product_size_usd = avg_order_size_rp/idrToUsd;
        //         let mkt_spending = 0;
        //         let roas = 0;
        //         let sales_target = 0;
        //         let sales_reach = sales_target != 0 ? Math.round(((gmv_total_rp/sales_target)*100)*100)/100 : 100;
            
        //         let dataPushEgogoAi = {
        //             team,
        //             name,
        //             brand : brandName,
        //             brand_code,
        //             gmv_total_rp,
        //             gmv_total_usd,
        //             in_the_team,
        //             order_count,
        //             product_sold,
        //             avg_order_size_rp,
        //             avg_order_size_usd,
        //             avg_product_size_rp,
        //             avg_product_size_usd,
        //             mkt_spending,
        //             roas,
        //             sales_target,
        //             sales_reach
        //         };

        //         dataEmailSalesMonthly.push(dataPushEgogoAi)
        //     }
        //     // if(findEgogoAiSalesData.length > 0){
        //     //     // let team = findEgogoAiData.description;
        //     //     let team = "Personal Store";
        //     //     // let name = findEgogoAiData.brand_user;
        //     //     let name = "Hannah Xiao";
        //     //     let brandName = findEgogoAiSalesData[0].store_name;
        //     //     let brand_code = findEgogoAiData.brand_code;
        //     //     let gmv_total_rp = findEgogoAiSalesData[0].gmv_total_rp;
        //     //     let gmv_total_usd = gmv_total_rp/idrToUsd;
        //     //     let in_the_team = 100;
        //     //     let order_count = findEgogoAiSalesData[0].order_count;
        //     //     let product_sold = findEgogoAiSalesData[0].product_sold;
        //     //     let avg_order_size_rp = gmv_total_rp/order_count;
        //     //     let avg_order_size_usd = avg_order_size_rp/idrToUsd;
        //     //     let avg_product_size_rp = gmv_total_rp/product_sold;
        //     //     let avg_product_size_usd = avg_order_size_rp/idrToUsd;
        //     //     let mkt_spending = 0;
        //     //     let roas = 0;
        //     //     let sales_target = 0;
        //     //     let sales_reach = sales_target != 0 ? Math.round(((gmv_total_rp/sales_target)*100)*100)/100 : 100;
    
        //     //     let dataPushEgogoAi = {
        //     //         team,
        //     //         name,
        //     //         brand : brandName,
        //     //         brand_code,
        //     //         gmv_total_rp,
        //     //         gmv_total_usd,
        //     //         in_the_team,
        //     //         order_count,
        //     //         product_sold,
        //     //         avg_order_size_rp,
        //     //         avg_order_size_usd,
        //     //         avg_product_size_rp,
        //     //         avg_product_size_usd,
        //     //         mkt_spending,
        //     //         roas,
        //     //         sales_target,
        //     //         sales_reach
        //     //     };

        //     //     console.log(dataPushEgogoAi)
    
        //     //     // dataEmailSalesMonthly.push(dataPushEgogoAi)
        //     // }

        // }

        return dataEmailSalesMonthly
    },
    DataQuarterly : async(start_date,end_date,arrayBrand,emailPic,idrToUsd)=>{
        let resultDataQuarterly = await getDataSales(start_date,end_date,arrayBrand);
        
        let dataEmailSalesQuarterly = [];

        for(let dataQuarterly of resultDataQuarterly){
            let brand_name = dataQuarterly.brand;
            let brand_cde = dataQuarterly.brand_code;
            let gmvRp = dataQuarterly.gmv_total_rp;

            if(gmvRp > 0){
                // Find Brand Sales Target
                let brandSalesTarget = await salesTarget.findOne({"brand_code" : brand_cde});
                let sales_target = brandSalesTarget.quarter_target
                let sales_reach = sales_target == 0 ? 100 : parseFloat((Number(gmvRp)/Number(sales_target))*100);
    
                // Find Brand Marketing Spending
                let brandMarketingSpending = await marketingSpending.findOne({"brand_code" : brand_cde});
                let mkt_spending = brandMarketingSpending.amount_quarterly;
                let roas = mkt_spending == 0 ? 0 : parseFloat(Number(gmvRp)/Number(mkt_spending));
    
                dataQuarterly['mkt_spending'] = mkt_spending;
                dataQuarterly['roas'] = roas;
                dataQuarterly['sales_target'] = sales_target;
                dataQuarterly['sales_reach'] = sales_reach;
    
                dataEmailSalesQuarterly.push(dataQuarterly)
            }

        };

        // let checkEgogoAiUser = await brandCategory.findOne({$and : [{"email_pm" : emailPic},{"brand_id" : "9289345461a58cf08c316087"}]});
        // if(checkEgogoAiUser){
        //     let findEgogoAiData = await brand.findOne({"brand_name" : "EGOGO AI"});
        //     let findStoreEgogoAi = await shopMp.find({$and : [
        //         {"brand" : "EGOGO AI"},
        //         {"shopid" :{$exists : true}}
        //     ]});

        //     let arrayShopidPersonalStore = []

        //     for(let storeAi of findStoreEgogoAi){
        //         let shopid = storeAi.shopid;
        //         arrayShopidPersonalStore.push(shopid)
        //     };
            
        //     let findEgogoAiSalesData = await getDataEgogoAiSales(arrayShopidPersonalStore,start_date,end_date);

        //     for(let dataSales of findEgogoAiSalesData){
        //         // let team = findEgogoAiData.description;
        //         let team = "Personal Store";
        //         // let name = findEgogoAiData.brand_user;
        //         let name = "Hannah Xiao";
        //         let brandName = dataSales.store_name.toUpperCase();
        //         let brand_code = findEgogoAiData.brand_code;
        //         let gmv_total_rp = dataSales.gmv_total_rp;
        //         let gmv_total_usd = gmv_total_rp/idrToUsd;
        //         let in_the_team = 100;
        //         let order_count = dataSales.order_count;
        //         let product_sold = dataSales.product_sold;
        //         let avg_order_size_rp = gmv_total_rp/order_count;
        //         let avg_order_size_usd = avg_order_size_rp/idrToUsd;
        //         let avg_product_size_rp = gmv_total_rp/product_sold;
        //         let avg_product_size_usd = avg_order_size_rp/idrToUsd;
        //         let mkt_spending = 0;
        //         let roas = 0;
        //         let sales_target = 0;
        //         let sales_reach = sales_target != 0 ? Math.round(((gmv_total_rp/sales_target)*100)*100)/100 : 100;
    
        //         let dataPushEgogoAi = {
        //             team,
        //             name,
        //             brand : brandName,
        //             brand_code,
        //             gmv_total_rp,
        //             gmv_total_usd,
        //             in_the_team,
        //             order_count,
        //             product_sold,
        //             avg_order_size_rp,
        //             avg_order_size_usd,
        //             avg_product_size_rp,
        //             avg_product_size_usd,
        //             mkt_spending,
        //             roas,
        //             sales_target,
        //             sales_reach
        //         };

        //         dataEmailSalesQuarterly.push(dataPushEgogoAi)
        //     }
        //     // if(findEgogoAiSalesData.length > 0){
        //     //     let team = findEgogoAiData.description;
        //     //     let name = findEgogoAiData.brand_user;
        //     //     let brandName = "EGOGO AI";
        //     //     let brand_code = findEgogoAiData.brand_code;
        //     //     let gmv_total_rp = findEgogoAiSalesData[0].gmv_total_rp;
        //     //     let gmv_total_usd = gmv_total_rp/idrToUsd;
        //     //     let in_the_team = 100;
        //     //     let order_count = findEgogoAiSalesData[0].order_count;
        //     //     let product_sold = findEgogoAiSalesData[0].product_sold;
        //     //     let avg_order_size_rp = gmv_total_rp/order_count;
        //     //     let avg_order_size_usd = avg_order_size_rp/idrToUsd;
        //     //     let avg_product_size_rp = gmv_total_rp/product_sold;
        //     //     let avg_product_size_usd = avg_order_size_rp/idrToUsd;
        //     //     let mkt_spending = 0;
        //     //     let roas = 0;
        //     //     let sales_target = 750000000;
        //     //     let sales_reach = Math.round(((gmv_total_rp/sales_target)*100)*100)/100
    
        //     //     let dataPushEgogoAi = {
        //     //         team,
        //     //         name,
        //     //         brand : brandName,
        //     //         brand_code,
        //     //         gmv_total_rp,
        //     //         gmv_total_usd,
        //     //         in_the_team,
        //     //         order_count,
        //     //         product_sold,
        //     //         avg_order_size_rp,
        //     //         avg_order_size_usd,
        //     //         avg_product_size_rp,
        //     //         avg_product_size_usd,
        //     //         mkt_spending,
        //     //         roas,
        //     //         sales_target,
        //     //         sales_reach
        //     //     };
    
        //     //     dataEmailSalesQuarterly.push(dataPushEgogoAi)
        //     // }
        // };

        return dataEmailSalesQuarterly;
    },
    DataSubTotalYesterday : async(start_date,end_date,arrayBrands,emailPic,idrToUsd)=>{
        let resultDataSubtotalYesterday = await getSubTotalDataSales(start_date,end_date,arrayBrands);

        let dataEmailSubTotalYesterday = [];

        for(let subtotalYesterday of resultDataSubtotalYesterday){
            let teamSubtotal = subtotalYesterday.subtotal;
            if(teamSubtotal > 0){
                dataEmailSubTotalYesterday.push({
                    team : subtotalYesterday.team,
                    subtotal : subtotalYesterday.subtotal,
                    jmlbrand : subtotalYesterday.jmlbrand
                })
            }
        };

        // let checkEgogoAiUser = await brandCategory.findOne({$and : [{"email_pm" : emailPic},{"brand_id" : "9289345461a58cf08c316087"}]});
        // if(checkEgogoAiUser){
        //     let findEgogoAiData = await brand.findOne({"brand_name" : "EGOGO AI"});
        //     let findStoreEgogoAi = await shopMp.find({$and : [
        //         {"brand" : "EGOGO AI"},
        //         {"shopid" :{$exists : true}}
        //     ]});

        //     let arrayShopidPersonalStore = []

        //     for(let storeAi of findStoreEgogoAi){
        //         let shopid = storeAi.shopid;
        //         arrayShopidPersonalStore.push(shopid)
        //     };

        //     let findEgogoAiSubtotalData = await getDataSubtotalEgogoAiSales(arrayShopidPersonalStore,start_date,end_date);

        //     if(findEgogoAiSubtotalData.length > 0){
        //         // let team = findEgogoAiData.description;
        //         let team = "Personal Store";
        //         let subtotal = findEgogoAiSubtotalData[0].subtotal;
        //         let jmlbrand = findEgogoAiSubtotalData[0].jmlbrand;
    
        //         let dataPushSubtotalEgogoAi = {
        //             team,
        //             subtotal,
        //             jmlbrand
        //         };
    
        //         dataEmailSubTotalYesterday.push(dataPushSubtotalEgogoAi)
        //     };
        // };

        return dataEmailSubTotalYesterday;
    },
    DataSubTotalMonthly : async(start_date,end_date,arrayBrands,emailPic,idrToUsd)=>{
        let resultDataSubtotalMonthly = await getSubTotalDataSales(start_date,end_date,arrayBrands);
    
        let dataEmailSubTotalMonthly = [];

        for(let subtotalMonthly of resultDataSubtotalMonthly){
            let teamSubtotal = subtotalMonthly.subtotal;
            if(teamSubtotal > 0){
                dataEmailSubTotalMonthly.push({
                    team : subtotalMonthly.team,
                    subtotal : subtotalMonthly.subtotal,
                    jmlbrand : subtotalMonthly.jmlbrand
                })
            }
        };

        // let checkEgogoAiUser = await brandCategory.findOne({$and : [{"email_pm" : emailPic},{"brand_id" : "9289345461a58cf08c316087"}]});
    
        // if(checkEgogoAiUser){
        //     let findEgogoAiData = await brand.findOne({"brand_name" : "EGOGO AI"});
        //     let findStoreEgogoAi = await shopMp.find({$and : [
        //         {"brand" : "EGOGO AI"},
        //         {"shopid" :{$exists : true}}
        //     ]});

        //     let arrayShopidPersonalStore = []

        //     for(let storeAi of findStoreEgogoAi){
        //         let shopid = storeAi.shopid;
        //         arrayShopidPersonalStore.push(shopid)
        //     };
            
        //     let findEgogoAiSubtotalData = await getDataSubtotalEgogoAiSales(arrayShopidPersonalStore,start_date,end_date);

        //     if(findEgogoAiSubtotalData.length > 0){
        //         // let team = findEgogoAiData.description;
        //         let team = "Personal Store";
        //         let subtotal = findEgogoAiSubtotalData[0].subtotal;
        //         let jmlbrand = findEgogoAiSubtotalData[0].jmlbrand;
    
        //         let dataPushSubtotalEgogoAi = {
        //             team,
        //             subtotal,
        //             jmlbrand
        //         };
    
        //         dataEmailSubTotalMonthly.push(dataPushSubtotalEgogoAi);
        //     }


        // };

        return dataEmailSubTotalMonthly;
    },
    DataSubTotalQuarterly : async(start_date,end_date,arrayBrands,emailPic,idrToUsd)=>{
        try {
            let resultDataSubtotalQuarterly = await getSubTotalDataSales(start_date,end_date,arrayBrands);
            
            let dataEmailSubTotalQuarterly = [];
    
            for(let subtotalQuarterly of resultDataSubtotalQuarterly){
                let teamSubtotal = subtotalQuarterly.subtotal;
                if(teamSubtotal > 0){
                    dataEmailSubTotalQuarterly.push({
                        team : subtotalQuarterly.team,
                        subtotal : subtotalQuarterly.subtotal,
                        jmlbrand : subtotalQuarterly.jmlbrand
                    })
                }
            };
    
            // let checkEgogoAiUser = await brandCategory.findOne({$and : [{"email_pm" : emailPic},{"brand_id" : "9289345461a58cf08c316087"}]});
    
            // if(checkEgogoAiUser){
            //     let findEgogoAiData = await brand.findOne({"brand_name" : "EGOGO AI"});
                
            //     let findStoreEgogoAi = await shopMp.find({$and : [
            //         {"brand" : "EGOGO AI"},
            //         {"shopid" :{$exists : true}}
            //     ]});

            //     let arrayShopidPersonalStore = []

            //     for(let storeAi of findStoreEgogoAi){
            //         let shopid = storeAi.shopid;
            //         arrayShopidPersonalStore.push(shopid)
            //     };
                
            //     let findEgogoAiSubtotalData = await getDataSubtotalEgogoAiSales(arrayShopidPersonalStore,start_date,end_date)
    
            //     if(findEgogoAiSubtotalData.length > 0){
            //         // let team = findEgogoAiData.description;
            //         let team = "Personal Store";
            //         let subtotal = findEgogoAiSubtotalData[0].subtotal;
            //         let jmlbrand = findEgogoAiSubtotalData[0].jmlbrand;
        
            //         let dataPushSubtotalEgogoAi = {
            //             team,
            //             subtotal,
            //             jmlbrand
            //         };
        
            //         dataEmailSubTotalQuarterly.push(dataPushSubtotalEgogoAi)
            //     }
    
            // };
    
            return dataEmailSubTotalQuarterly; 
        } catch (error) {
            console.log(error)
        }
        
    }
}