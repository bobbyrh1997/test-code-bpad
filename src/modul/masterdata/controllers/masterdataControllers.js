const AuthModel = require("../../auth/model/AuthModel");
const instansiModel = require("../model/instansiModel");
const vehicleModel = require("../model/vehicleModel");

let bcrypt 				= require('bcrypt');
var salt = bcrypt.genSaltSync(10)


module.exports = {
    listUserPage : async(req,res,next)=>{
        let dataUser = await AuthModel.find();
        return res.render('masterdata/userList',{
            title : 'Data User',
            dataUser
        })
    },
    addUserPage : async(req,res,next)=>{
        let dataInstansi = await instansiModel.find();
        console.log(dataInstansi)
        return res.render('masterdata/userAdd',{
            title : 'Data User',
            dataInstansi
        })
    },
    addUserData : async(req,res,next)=>{
        let {
            fullname,
            email,
            password,
            nip,
            instansi
        } = req.body;

        let pass_encrypt = bcrypt.hashSync(password,salt);

        let dataUser = {
			fullname,
			email,
			password: pass_encrypt,
			nip,
            instansi,
			createdAt : new Date()
		};

        let saveUser = await AuthModel.create(dataUser);
        if(saveUser){
            res.json({ code:200, title:'Add User Success!'})
		}

    },
    listInstansiPage : async(req,res,next)=>{
        let dataInstansi = await instansiModel.find();
        return res.render('masterdata/instansiList',{
            title : 'Data Instansi',
            dataInstansi
        })
    },
    addInstansiPage : async(req,res,next)=>{
        return res.render('masterdata/instansiAdd',{
            title : 'Tambah Instansi'
        })
    },
    addInsansiData : async(req,res,next)=>{
        let namaInstansi = req.body.namaInstansi;
        let kodeInstansi = req.body.kodeInstansi;
        let statusInstansi = req.body.statusInstansi;

        let dataInstansi = {
            namaInstansi,
            kodeInstansi,
            statusInstansi
        };

        let saveInstansi = await instansiModel.create(dataInstansi);
        
        return res.json({ code:200, title:'Success Save data!', message: ''})

    },
    listVehiclePage : async(req,res,next)=>{
        return res.render('masterdata/vehicleList',{
            title : 'Data Kendaraan'
        })
    }
}