const db = require('../config/config');
const bcrypt = require('bcryptjs');

const User = {};

User.findByEmail=(email, result)=>{
    const sql= `
    Select 
            id,
            email,
            name,
            lastname,
            image,
            phone,
            password
    From
        users
    where 
        email=?
    `;

    db.query(
        sql,
        [email],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido: ', user);
                result(null, user[0]);
            }
        }
        
        );
}

User.findById=(id, result)=>{
    const sql= `
    Select 
            id,
            email,
            name,
            lastname,
            image,
            phone,
            password
    From
        users
    where 
        id=?
    `;

    db.query(
        sql,
        [id],
        (err, user) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Usuario obtenido: ', user);
                result(null, user);
            }
        }
        
        );
}

User.create = async (user, result) => {

    const hash = await bcrypt.hash(user.password,10);
    const sql = `
        INSERT INTO
            users(
                email,
                name,
                lastname,
                phone,
                image,
                password,
                created_at,
                updated_at
            )
        VALUES(?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query
    (
        sql,
        [
            user.email,
            user.name,
            user.lastname,
            user.phone,
            user.image,
            hash,
            new Date(),
            new Date()
        ],
        (err, res) => {
            if (err) {
                console.log('Error:', err);
                result(err, null);
            }
            else {
                console.log('Id del nuevo usuario:', res.insertId);
                result(null, res.insertId);
            }
        }
    )

}

module.exports = User;