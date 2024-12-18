let moment = require('moment')

module.exports = async function(usdCurrency,start_date,end_date,monthlySubTotal,monthlyDataSales){
    let dataMonthly = '';
    let footerMonthly = '';
    let totalGmvTotal = 0;
    let totalOrder = 0;
    let totalQty = 0;
    let totalAvgOrderSizeRp = 0;
    let totalAvgProductPriceRp = 0;
    let totalSalesTargetRp = 0;
    let totalMktSpendingRp = 0;

    // Get Total from query Subtotal to calculate % in the team
    for(let tempSub of monthlySubTotal){
        totalGmvTotal += tempSub.subtotal;
    }

    // Looping Template tabel data sales
    for(let groupTeam of monthlySubTotal){
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
        let subMktSpendingRp = 0;

        for(let salesMonthly of monthlyDataSales){
            if(groupTeam.team === salesMonthly.team){
                let brandName = salesMonthly.brand;
                let namePl = salesMonthly.name;
                let gmvTotalRp = salesMonthly.gmv_total_rp;
                let gmvTotalUsd = Math.round(salesMonthly.gmv_total_usd);
                let inTheTeam = salesMonthly.in_the_team;
                let orderCount = salesMonthly.order_count;
                let productSold = salesMonthly.product_sold;
                let avgOrderSizeRp = Math.round(salesMonthly.avg_order_size_rp);
                let avgOrderSizeUsd = Math.round(salesMonthly.avg_order_size_usd);
                let avgProdctSizeRp = Math.round(salesMonthly.avg_product_size_rp);
                let avgProdctSizeUsd = Math.round(salesMonthly.avg_product_size_usd);
                let mktSpendingRp = salesMonthly.mkt_spending;
                let mktSpendingUsd = Math.round(mktSpendingRp/usdCurrency);
                let roas = Math.round(salesMonthly.roas*100)/100;
                let salesTarget = salesMonthly.sales_target;
                let salestargetUsd = Math.round(salesTarget/usdCurrency);
                let salesReach = Math.round(salesMonthly.sales_reach * 100)/100;
                subGmvTotalRp += gmvTotalRp;
                subOrder += orderCount;
                subProductSld += productSold;
                subAvgOrderSizeRp +=  avgOrderSizeRp;
                subAvgProductPriceRp += avgProdctSizeRp;
                subSalesTargetRp += salesTarget;
                subMktSpendingRp += mktSpendingRp;

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
                    <td style="text-align:right;font-family: calibri;">${mktSpendingRp.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${mktSpendingUsd.toLocaleString()}</td>
                    <td style="text-align:right;font-family: calibri;">${roas == 0 ? '-' : roas}</td>
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
        let subMktSpendingUsd = Math.round(subMktSpendingRp/usdCurrency);
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
            <td style="text-align:right; font-weight: bold;font-family: calibri;">${subMktSpendingRp.toLocaleString()}</td>
            <td style="text-align:right; font-weight: bold;font-family: calibri;">${subMktSpendingUsd.toLocaleString()}</td>
            <td style="text-align:right; font-weight: bold;font-family: calibri;">${subMktSpendingRp == 0 ? "-" : parseFloat(Number(subGmvTotalRp)/Number(subMktSpendingRp)).toFixed(2).toLocaleString()}</td>
            <td style="text-align:right; font-weight: bold;font-family: calibri;">${subSalesTargetRp.toLocaleString()}</td>
            <td style="text-align:right; font-weight: bold;font-family: calibri;">${subSalesTargetUsd.toLocaleString()}</td>
            <td style="text-align:right; font-weight: bold;font-family: calibri;">${subSalesReach.toFixed(2)}%</td>
            </tr>
        `
        dataMonthly += tmpltData;

        totalOrder += subOrder;
        totalQty += subProductSld;
        totalAvgOrderSizeRp += subAvgOrderSizeRp;
        totalAvgProductPriceRp += subAvgProductPriceRp;
        totalSalesTargetRp += subSalesTargetRp;
        totalMktSpendingRp += subMktSpendingRp;

    }

    let totalGmvTotalUsd = Math.round(totalGmvTotal/usdCurrency);
    let totalAvgOrderSizeUsd = Math.round(totalAvgOrderSizeRp/usdCurrency);
    let totalAvgProductPriceUsd = Math.round(totalAvgProductPriceRp/usdCurrency);
    let totalMktSpendingUsd = Math.round(totalMktSpendingRp/usdCurrency);
    let totalSalesTargetUsd = Math.round(totalSalesTargetRp/usdCurrency);
    let totalSalesReach = totalSalesTargetRp == 0 ? 100 : Math.round(((totalGmvTotal/totalSalesTargetRp)*100)*100)/100

    footerMonthly += `
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
        <td style="text-align:right;font-family: calibri;">${totalMktSpendingRp.toLocaleString()}</td>
        <td style="text-align:right;font-family: calibri;">${totalMktSpendingUsd.toLocaleString()}</td>
        <td style="text-align:right;font-family: calibri;">${totalMktSpendingRp==0 ? "-" :parseFloat(totalGmvTotal/totalMktSpendingRp).toFixed(2)}</td>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalSalesTargetRp.toLocaleString()}</th>
        <th style="height: 44px; vertical-align: middle; text-align: right;">${totalSalesTargetUsd.toLocaleString()}</th>
        <td style="text-align:right; font-weight: bold;font-family: calibri;">${totalSalesReach.toFixed(2)}%</td>
    </tr>`

    let htmlMonthly = `
    <h4 style="color: #222222;font-family: calibri;">Month-to-date - <span style="font-size: 13px;">${moment(start_date).format('YYYY/MM/DD')} - ${moment(end_date).format('YYYY/MM/DD')}</span> </h4>
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
            <th>Marketing Spending<br> (Rp)</th>
            <th>Marketing Spending<br> (USD)</th>
            <th>ROAS</th>
            <th>Sales Target<br> (Rp)</th>
            <th>Sales Target<br> (USD)</th>
            <th>% Sales Reach</th>
        </thead>
        <tbody>
        ${dataMonthly}
        </tbody>
        <tfoot>
        ${footerMonthly}
        </tfoot>
    </table>
    `

    return htmlMonthly;
}