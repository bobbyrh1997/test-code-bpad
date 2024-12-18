let moment = require('moment')

module.exports = async function(usdCurrency,yesterday,yesterdaySubtotal,yesterdaySalesData){
    let dataYesterday = '';
    let footerYesterday = '';
    let totalGmvTotal = 0;
    let totalOrder = 0;
    let totalQty = 0;
    let totalAvgOrderSizeRp = 0;
    let totalAvgProductPriceRp = 0;
    let totalSalesTarget = 0;

    for(let tempSub of yesterdaySubtotal){
        totalGmvTotal += tempSub.subtotal;
    }

    for(let groupTeam of yesterdaySubtotal){
        let tmpltData = `
        <tr> 
            <td rowspan="${groupTeam.jmlbrand + 1}" style="vertical-align: middle; background-color: white; text-align:left; font-weight: bold;font-family: calibri;" >${groupTeam.team}</td>
        </tr>`
        let no = 1;
        let subGmvTotalRp = 0;
        let subOrder = 0;
        let subProductSld = 0;
        let subAvgOrderSizeRp = 0;
        let subAvgProductPriceRp = 0;
        let subSalesTargetRp = 0;

        for(let dataYesterday of yesterdaySalesData){
            if(groupTeam.team == dataYesterday.team){
                let brandName = dataYesterday.brand;
                let namePl = dataYesterday.name;
                let gmvTotalRp = dataYesterday.gmv_total_rp;
                let gmvTotalUsd = Math.round(dataYesterday.gmv_total_usd);
                let inTheTeam = dataYesterday.in_the_team;
                let orderCount = dataYesterday.order_count;
                let productSold = dataYesterday.product_sold;
                let avgOrderSizeRp = Math.round(dataYesterday.avg_order_size_rp);
                let avgOrderSizeUsd = Math.round(dataYesterday.avg_order_size_usd);
                let avgProdctSizeRp = Math.round(dataYesterday.avg_product_size_rp);
                let avgProdctSizeUsd = Math.round(dataYesterday.avg_product_size_usd);
                let salesTarget = dataYesterday.sales_target;
                let salestargetUsd = Math.round(salesTarget/usdCurrency);
                let salesReach = Math.round(dataYesterday.sales_reach * 100)/100;
                subGmvTotalRp += gmvTotalRp;
                subOrder += orderCount;
                subProductSld += productSold;
                subAvgOrderSizeRp +=  avgOrderSizeRp;
                subAvgProductPriceRp += avgProdctSizeRp;
                subSalesTargetRp += salesTarget;
                tmpltData += `
                <tr> 
                    <td style="text-align:center;text-align:center;font-family: calibri;">${no++}</td>
                    <td style="text-align:left;font-weight:bold;font-family: calibri;">${brandName}</td>
                    <td style="text-align:left;font-family: calibri;">${namePl}</td>
                    <td style="text-align:right;font-family: calibri;">${gmvTotalRp.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${gmvTotalUsd.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${inTheTeam.toFixed(2)}%</td>
                    <td style="text-align:right;font-family: calibri;">${orderCount.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${productSold.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${avgOrderSizeRp.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${avgOrderSizeUsd.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${avgProdctSizeRp.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${avgProdctSizeUsd.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${salesTarget.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${salestargetUsd.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${salesReach.toFixed(2).toLocaleString()}%</td>
                </tr>`
            }
        }

        let subGmvTotalRpUsd = Math.round(subGmvTotalRp / usdCurrency);
        let subInTheTeam = Math.round(((subGmvTotalRp/totalGmvTotal)*100)*100)/100
        let subAvgOrderSizeUsd = Math.round(subAvgOrderSizeRp/ usdCurrency);
        let subAvgProductPriceUsd = Math.round(subAvgProductPriceRp/usdCurrency);
        let subSalesTargetUsd = Math.round(subSalesTargetRp/usdCurrency);
        let subSalesReach = subSalesTargetRp == 0 ? 100 : Math.round(((subGmvTotalRp/subSalesTargetRp)*100)*100)/100
        
        tmpltData += `
            <tr>
                <td colspan="4" style="text-align: center; font-weight: bold;font-family: calibri;">Sub Total</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subGmvTotalRp.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subGmvTotalRpUsd.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subInTheTeam.toFixed(2)}%</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subOrder.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subProductSld.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subAvgOrderSizeRp.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subAvgOrderSizeUsd.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subAvgProductPriceRp.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subAvgProductPriceUsd.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subSalesTargetRp.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subSalesTargetUsd.toLocaleString()}</td>
                <td style="text-align:right; font-weight: bold;font-family: calibri;">${subSalesReach.toFixed(2)}%</td>
            </tr>
        `
        dataYesterday += tmpltData

        totalOrder += subOrder;
        totalQty += subProductSld;
        totalAvgOrderSizeRp += subAvgOrderSizeRp;
        totalAvgProductPriceRp += subAvgProductPriceRp;
        totalSalesTarget += subSalesTargetRp;

    }

    let totalGmvTotalUsd = Math.round(totalGmvTotal/usdCurrency);
    let totalAvgOrderSizeUsd = Math.round(totalAvgOrderSizeRp/usdCurrency);
    let totalAvgProductPriceUsd = Math.round(totalAvgProductPriceRp/usdCurrency);
    let totalSalesTargetUsd = Math.round(totalSalesTarget/usdCurrency);
    let totalSalesReach = totalSalesTarget == 0 ? 100 : Math.round(((totalGmvTotal/totalSalesTarget)*100)*100)/100
    footerYesterday += `
    <tr>
        <th colspan="4" style="text-align: center; height: 44px; vertical-align: middle;">TOTAL</th>
        <th style="display: none;"></th>
        <th style="display: none;"></th>
        <th style="display: none;"></th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalGmvTotal.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalGmvTotalUsd.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;"></th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalOrder.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalQty.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalAvgOrderSizeRp.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalAvgOrderSizeUsd.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalAvgProductPriceRp.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalAvgProductPriceUsd.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalSalesTarget.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalSalesTargetUsd.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalSalesReach.toFixed(2)}%</th>
    </tr>`

    let htmlYesterday = `
    <h4 style="color: #222222;font-family: calibri;">Yesterday - <span style="font-size: 13px;">${moment(yesterday).format('YYYY/MM/DD')}</span> </h4>
    <table border="1" cellspacing="0" style="font-family: calibri;">
        <thead>
            <th>Team</th>
            <th>Rank</th>
            <th>Brand</th>
            <th>Brand PIC</th>
            <th>GMV Total<br> (Rp)</th>
            <th>GMV Total<br> (USD)</th>
            <th>% in the Team<br> (GMV)</th>
            <th>Order</th>
            <th>Sold Qty.</th>
            <th>Avg. Order Size<br> (Rp)</th>
            <th>Avg. Order Size<br> (USD)</th>
            <th>Avg. Product Price<br> (Rp)</th>
            <th>Avg. Product Price<br> (USD)</th>
            <th>Sales Target<br> (Rp)</th>
            <th>Sales Target<br> (USD)</th>
            <th>% Sales Reach</th>
        </thead>
        <tbody>
        ${dataYesterday}
        </tbody>
        <tfoot>
        ${footerYesterday}
        </tfoot>
    </table>
    `

    return htmlYesterday
}