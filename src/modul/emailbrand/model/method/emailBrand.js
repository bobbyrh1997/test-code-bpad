const brand = require("../schema/brand");
const brandCategory = require("../schema/brandCategory");
const AllOrder = require("../../../../helpers/schema/allOrder");
var moment = require('moment');

module.exports = {
    getBrand : async()=>{
        return await brand.aggregate([
			{$match : { active : "1"}},
            {$project : { _id : 0, rowid : "$_id", label : "$brand_name" }}
        ])
    },
    insertEmailBrand : async(data)=>{
        return await brandCategory.insertMany(data)
    },
    getEmailBrand : async()=>{
        return await brandCategory.aggregate([
            {$lookup : {
                from : "brand",
                localField : "brand_id",
                foreignField : "_id",
                as : "brand_detail"
            }},
            {$unwind : "$brand_detail" },
            {$project : {
                _id : 0,
                rowid : "$_id",
                fk_brand : "$brand_id",
                fk_user : "$user_id",
                name_pm : "$name_pm",
                email_pm : "$email_pm",
                status : "$status",
                brand : "$brand_detail.brand_name"
            }}
        ])
    },
    getEmailBrandById : async(dataid)=>{
        return await brandCategory.find({"_id" : dataid})
    },
    updateEmailBrand : async(idCheck,data)=>{
        return await brandCategory.findOneAndUpdate({"_id" : idCheck},data)
    },
    deleteEmailBrand : async(dataid)=>{
        return await brandCategory.findByIdAndDelete(dataid);
    },
    getDataSales : async(start_date,end_date,brand_array)=>{
        let sd = start_date + ' 17:00:00';
        let ed = end_date + ' 16:59:59';

        let startDate = new Date(sd);
        let endDate = new Date(ed);

		let getData = await AllOrder.aggregate([
			{$match : {
				$and : [
					{"internal_status"	: {$nin : ["CANCELED","DRAFT","REFUNDED","REJECTED","RETURNED"]}},
					{"create_date"		: { $gte : startDate }},
					{"create_date"		: { $lte  : endDate }},
				]
			}},
			{$project : {
				store_id : {$ifNull : ["$store_id","NULL"]},
				marketplace : "$marketplace",
				store_name : "$store_name",
				invoice_no : "$invoice_no",
				create_date : "$create_date",
				internal_status : "$internal_status",
				products : "$products"
			}},
			{$lookup : {
				from : "shopMp",
				localField : "store_id",
				foreignField : "shopid",
				as : "shopMpDetail"
			}},
			{$unwind : {
				path : "$shopMpDetail",
				preserveNullAndEmptyArrays : true
			}},
			{$project : {
				marketplace : "$marketplace",
				store_name : {$ifNull : ["$shopMpDetail.brand","$store_name"]} ,
				invoice_no : "$invoice_no",
				create_date : "$create_date",
				internal_status : "$internal_status",
				products : "$products"
			}},
			{$match : {
				"store_name" : {$in : brand_array}
			}},
			{$unwind : "$products"},
			{$lookup : {
				from : "brand",
				localField : "store_name",
				foreignField : "brand_name",
				as : "brandDetail"
			}},
			{$unwind : "$brandDetail"},
			{$match : {"brandDetail.active"		:	"1"}},
			{$project : {
				invoice_no      : "$invoice_no",
				team            : "$brandDetail.description",
				marketplace			: "$marketplace",
				brand           : "$store_name",
				brand_code			: "$brandDetail.brand_code",
				nama            : "$brandDetail.brand_user",
				gmv_total_rp 	  : "$products.total",
				gmv_total_usd 	: {
					$round : [{$divide : ["$products.total",15217]},2] 
				},
				qty             : "$products.qty"
			}},
			{$group : {
				_id : {
					invoice_no : "$invoice_no",
					team : "$team",
					brand : "$brand",
					brand_code : "$brand_code",
					nama : "$nama",
					marketplace : "$marketplace"
				},
				gmv_total_rp : {$sum : "$gmv_total_rp"},
				gmv_total_usd : {$sum : "$gmv_total_usd"},
				qty : {$sum : "$qty"}
			}},
			{$project : {
				_id : 0,
				invoice_no      : "$_id.invoice_no",
				team            : "$_id.team",
				marketplace		: "$_id.marketplace",
				brand           : "$_id.brand",
				brand_code		: "$_id.brand_code",
				nama            : "$_id.nama",
				gmv_total_rp 	: "$gmv_total_rp",
				gmv_total_usd 	: "$gmv_total_usd",
				qty             : "$qty"
			}},
			{$group : {
				_id : {
					team : "$team",
					nama : "$nama",
					brand : "$brand",
					brand_code : "$brand_code"
				},
				gmv_total_rp : {
					$sum : {
						$cond : {
							if : {
								$and : [
									{$eq : ["$marketplace", "offline"]},
									{$eq : ["$gmv_total_rp", 0]}
								]
							},
							then : 0,
							else : "$gmv_total_rp"
						}
					}
				},
				gmv_total_usd : {
					$sum : {
						$cond : {
							if : {
								$and : [
									{$eq : ["$marketplace", "offline"]},
									{$eq : ["$gmv_total_rp", 0]}
								]
							},
							then : 0,
							else : "$gmv_total_usd"
						}
					}
				},
				order_count : {
					$sum : {
						$cond : {
							if : {
								$and : [
									{$eq : ["$marketplace", "offline"]},
									{$eq : ["$gmv_total_rp", 0]}
								]
							},
							then : 0,
							else : 1
						}
					}
				},
				qty : {
					$sum : {
						$cond : {
							if : {
								$and : [
									{$eq : ["$marketplace", "offline"]},
									{$eq : ["$gmv_total_rp", 0]}
								]
							},
							then : 0,
							else : "$qty"
						}
					}
				}
			}},
			{$lookup : {
				from : "allOrders",
				let : {
					"team" : "$_id.team"
				},
				pipeline : [
					{$unwind : "$products"},
					{$lookup : {
						from : "brand",
						localField : "store_name",
						foreignField : "brand_name",
						as : "brandDetail"
					}},
					{$unwind : "$brandDetail"},
					{$match : {
						$and : [
							{"internal_status" 			:	{$nin : ["CANCELED","DRAFT","REFUNDED","REJECTED","RETURNED"]}},
							{"create_date" 				: 	{ $gte : startDate }},
							{"create_date" 				:	{ $lte  : endDate }	},
							{"brandDetail.active"		:	"1"}
						]
					}},
					{$group : {
						_id : {team : "$brandDetail.description"},
						subtotal : {$sum : "$products.total"}
					}},
					{$project : {
						_id : 0,
						team : "$_id.team",
						subtotal : "$subtotal"
					}},
					{$match : {
						"$expr": {"$eq": ["$$team", "$team"]}
					}}
				],
				as : "team_detail"
			}},		
			{$project : {
				_id : 0,
				team : "$_id.team",
				name :	{$cond: {
					if: { $eq: ["$_id.brand", "EGOGO AI"] },
					then: "Hannah Xiao",
					else: "$_id.nama"
				}},
				brand : {$cond: {
					if: { $eq: ["$_id.brand", "EGOGO AI"] },
					then: "PERSONAL STORE",
					else: "$_id.brand"
				}},
				brand_code : "$_id.brand_code",
				gmv_total_rp : "$gmv_total_rp",
				gmv_total_usd : "$gmv_total_usd",
				in_the_team : {
					$multiply : [{
						$divide : ["$gmv_total_rp",{$arrayElemAt :["$team_detail.subtotal",0]}]
					},100]
				},
				order_count : "$order_count",
				product_sold : "$qty" ,
				avg_order_size_rp : {
					$cond : {
						if : {$eq : ["$gmv_total_rp",0]},
						then : 0,
						else : {
							$divide : ["$gmv_total_rp","$order_count"]
						}
					}
				},
				avg_order_size_usd : {
					$cond : {
						if : {$eq : ["$gmv_total_rp",0]},
						then : 0,
						else : {
							$divide : ["$gmv_total_usd","$order_count"]
						}
					}
				},
				avg_product_size_rp : {
					$cond : {
						if : {$eq : ["$gmv_total_rp",0]},
						then : 0,
						else : {
							$divide : ["$gmv_total_rp","$qty"]
						}
					}
				},
				avg_product_size_usd : {
					$cond : {
						if : {$eq : ["$gmv_total_rp",0]},
						then : 0,
						else : {
							$divide : ["$gmv_total_usd","$qty"]
						}
					}
				}
			}},
			{$sort : {team : -1,gmv_total_rp : -1}}
		]);

        return getData;
    },
    getSubTotalDataSales : async(start_date,end_date,brand_array)=>{
        let sd = start_date + ' 17:00:00';
        let ed = end_date + ' 16:59:59';

        let startDate = new Date(sd);
        let endDate = new Date(ed);

		let getData = await AllOrder.aggregate([
			{$match : {
				$and : [
					{"internal_status"	: {$nin : ["CANCELED","DRAFT","REFUNDED","REJECTED","RETURNED"]}},
					{"create_date" 		:   { $gte : startDate }	},
					{"create_date" 		:   { $lte  : endDate }	},
				]
			}},
			{$project : {
				store_id : {$ifNull : ["$store_id","NULL"]},
				marketplace : "$marketplace",
				store_name : "$store_name",
				invoice_no : "$invoice_no",
				create_date : "$create_date",
				internal_status : "$internal_status",
				products : "$products"
			}},
			{$lookup : {
				from : "shopMp",
				localField : "store_id",
				foreignField : "shopid",
				as : "shopMpDetail"
			}},
			{$unwind : {
				path : "$shopMpDetail",
				preserveNullAndEmptyArrays : true
			}},
			{$project : {
				marketplace : "$marketplace",
				store_name : {$ifNull : ["$shopMpDetail.brand","$store_name"]} ,
				invoice_no : "$invoice_no",
				create_date : "$create_date",
				internal_status : "$internal_status",
				products : "$products"
			}},
			{$match : {
				"store_name" : {$in : brand_array}
			}},
			{$unwind : "$products"},
			{$lookup : {
				from : "brand",
				localField : "store_name",
				foreignField : "brand_name",
				as : "brandDetail"
			}},
			{$unwind : "$brandDetail"},
			{$match : {"brandDetail.active"	: "1"}},
			{$project : {
				brand : "$store_name",
				team : "$brandDetail.description",
				marketplace : "$marketplace",
				total : "$products.total"
			}},
			{$group : {
				_id : {
					brand : "$brand",
					team : "$team",
				},
				subtotal : {
					$sum : {
						$cond : {
							if : {
								$and : [
									{$eq : ["$marketplace", "offline"]},
									{$eq : ["$total", 0]}
								]
							},
							then : 0,
							else : "$total"
						}
					}
				}
			}},
			{$group : {
				_id : {
					team : "$_id.team"
				},
				subtotal : {$sum : {
					$cond : {
						if : {$eq : ["$subtotal", 0]},
						then : 0,
						else : "$subtotal"
					}
				}},
				jmlbrand : {$sum : {
					$cond : {
						if : {$eq : ["$subtotal", 0]},
						then : 0,
						else : 1
					}
				}}
			}},
			{$project : {
				_id : 0,
				team : "$_id.team",
				subtotal : "$subtotal",
				jmlbrand : "$jmlbrand"
			}},
			{$sort : {subtotal : -1}}
		])

        // let getData = await AllOrder.aggregate([
		// 	{$unwind : "$products"},
		// 	{$lookup : {
		// 		from : "brand",
		// 		localField : "store_name",
		// 		foreignField : "brand_name",
		// 		as : "brandDetail"
		// 	}},
		// 	{$unwind : "$brandDetail"},
		// 	{$match : {
		// 		$and : [
		// 			{"store_name" 			: 	{$in : brand_array}},
		// 			{"internal_status"  	:   {$nin : ["CANCELED","DRAFT","REFUNDED","REJECTED","RETURNED"]}},
		// 			{"create_date" 			:   { $gte : startDate }	},
		// 			{"create_date" 			:   { $lte  : endDate }	},
		// 			{"brandDetail.active"	:	"1"}
		// 		]
		// 	}},
		// 	{$project : {
		// 		brand : "$store_name",
		// 		team : "$brandDetail.description",
		// 		marketplace : "$marketplace",
		// 		total : "$products.total"
		// 	}},
		// 	{$group : {
		// 		_id : {
		// 			brand : "$brand",
		// 			team : "$team",
		// 		},
		// 		subtotal : {
		// 			$sum : {
		// 				$cond : {
		// 					if : {
		// 						$and : [
		// 							{$eq : ["$marketplace", "offline"]},
		// 							{$eq : ["$total", 0]}
		// 						]
		// 					},
		// 					then : 0,
		// 					else : "$total"
		// 				}
		// 			}
		// 		}
		// 	}},
		// 	{$group : {
		// 		_id : {
		// 			team : "$_id.team"
		// 		},
		// 		subtotal : {$sum : {
		// 			$cond : {
		// 				if : {$eq : ["$subtotal", 0]},
		// 				then : 0,
		// 				else : "$subtotal"
		// 			}
		// 		}},
		// 		jmlbrand : {$sum : {
		// 			$cond : {
		// 				if : {$eq : ["$subtotal", 0]},
		// 				then : 0,
		// 				else : 1
		// 			}
		// 		}}
		// 	}},
		// 	{$project : {
		// 		_id : 0,
		// 		team : "$_id.team",
		// 		subtotal : "$subtotal",
		// 		jmlbrand : "$jmlbrand"
		// 	}},
		// 	{$match : {team : {$ne : "Egogo AI"}}},
		// 	{
		// 		$sort : {subtotal : -1}
		// 	}
		// ])

        return getData
    },
    getAllBrandsEmail : async()=>{
        let getData = await brandCategory.aggregate([
            {$lookup : {
                from :  "brand",
                localField : "brand_id",
                foreignField : "_id",
                as : "brand_detail"
            }},
            {$unwind : "$brand_detail"},
            {$project : {
                email_pm : "$email_pm",
                brand_name : "$brand_detail.brand_name",
				flagSort : "$flagSort"
            }},
            {$group : {
                _id : {
					email_pm : "$email_pm",
					flagSort : "$flagSort"
                },
                brand_name : {
                    $push : {
                        $concat : ["$brand_name"]
                    }
                }
            }},
            {$project : {
                _id : 0,
                email_pm :  "$_id.email_pm",
                brands : "$brand_name",
				flagSort : "$_id.flagSort"
            }},
			{$sort : {flagSort : 1}}
        ])

        return getData
    },
	getDataEgogoAiSales : async(array_shopid,start_date,end_date)=>{
		let sd = start_date + ' 17:00:00';
        let ed = end_date + ' 16:59:59';

		let startDate = new Date(sd);
        let endDate = new Date(ed);

		let getData = await AllOrder.aggregate([
			{$match : {
				$and : [
					{"store_id" : {$in : array_shopid}},
					{"create_date" : {$gte : startDate}},
					{"create_date" : {$lte : endDate}},
					{"internal_status"  :   {$nin : ["CANCELED","DRAFT","REFUNDED","REJECTED"]}}
				]
			}},
			{$unwind : "$products"},
			{$lookup : {
				from : "shopMp",
				localField : "store_id",
				foreignField : "shopid",
				as : "storeDetail"
			}},
			{$unwind : "$storeDetail"},
			{$group : {
				_id : {
					store_name : "$storeDetail.shopname",
					invoice_no : "$invoice_no"
				},
				price : {$sum : "$products.price"},
				qty : {$sum : "$products.qty"},
				total : {$sum : "$products.total"}
			}},
			{$group : {
				_id : {
					store_name : "$_id.store_name"
				},
				order_total : {$sum : 1},
				sold_qty : {$sum : "$qty"},
				gmv_total : {$sum : "$total"}
			}},
			{$project : {
				_id : 0,
				store_name : "$_id.store_name",
				gmv_total_rp : "$gmv_total",
				order_count : "$order_total",
				product_sold : "$sold_qty"
			}}
		]);

		return getData
	},
	getDataSubtotalEgogoAiSales : async(array_shopid,start_date,end_date)=>{
		let sd = start_date + ' 17:00:00';
        let ed = end_date + ' 16:59:59';

        let startDate = new Date(sd);
        let endDate = new Date(ed);

		let getData = await AllOrder.aggregate([
			{$match : {
				$and : [
					{"store_id" : {$in : array_shopid}},
					{"create_date" : {$gte : startDate}},
					{"create_date" : {$lte : endDate}},
					{"internal_status"  :   {$nin : ["CANCELED","DRAFT","REFUNDED","REJECTED"]}},
				]
			}},
			{$unwind : "$products"},
			{$lookup : {
				from : "shopMp",
				localField : "store_id",
				foreignField : "shopid",
				as : "storeDetail"
			}},
			{$unwind : "$storeDetail"},
			{$group : {
				_id : {
					store_name : "$storeDetail.shopname"
				},
				subtotal : {$sum : "$products.total"}
			}},
			{$group : {
				_id : 0,
				subtotal : {$sum : "$subtotal"},
				jmlbrand : {$sum : 1},
			}},
			{$project : {
				_id : 0,
				subtotal : "$subtotal",
				jmlbrand : "$jmlbrand"
			}}
		]);

		return getData
	}
}
