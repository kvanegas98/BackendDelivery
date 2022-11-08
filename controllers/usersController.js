const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
module.exports = {

    login(req,res){
        const {email, password} = req.body;

        User.findByEmail(email, async(err, myUser) => {
console.log("User: ",myUser);
console.log("password: ",password);
            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error al encontrar el email',
                    error: err
                });
            }
            if(!myUser){
                return res.status(401).json({ //No autorizada
                    success: false,
                    message: 'El email no fue econtrado',
                    error: err
                });
            }

            const isPasswordValid= await bcrypt.compare(password, myUser.password);
            console.log("isPasswordValid: ",isPasswordValid);

            if(isPasswordValid){
                const token = jwt.sign({id:myUser.id, email: myUser.email}, keys.secretOrKey,{});

                const data ={
                    id: `${myUser.id}`,
                    name: myUser.name,
                    lastname: myUser.lastname,
                    email: myUser.email,
                    phone: myUser.phone,
                    image: myUser.image,
                    session_token: `Jwt ${token}`,
                }

                return res.status(201).json({
                    success: true,
                    message: 'El usuario fue autenticado',
                    data: data
                });
            }
            else{
                return res.status(401).json({
                    success: false,
                    message: 'El password no es correcto',
                    error: err
                });
            }
            

          

        });

    },

    register(req, res) {

        const user = req.body; // CAPTURO LOS DATOS QUE ME ENVIE EL CLIENTE
        User.create(user, (err, data) => {

            if (err) {
                return res.status(501).json({
                    success: false,
                    message: 'Hubo un error con el registro del usuario',
                    error: err
                });
            }

            return res.status(201).json({
                success: true,
                message: 'El registro se realizo correctamente',
                data: data // EL ID DEL NUEVO USUARIO QUE SE REGISTRO
            });

        });

    }

}