import pool from "../config/db.js";

export async function create({ name, email, mobile, profile_pic, password }) {
    const { rows } = await pool.query(
        "INSERT INTO auths.users(name,email,mobile,profile_pic,password) VALUES ($1, $2, $3,$4,$5) RETURNING *",
        [name, email, mobile, profile_pic, password]
    );
    return rows[0];
}

export async function findUserByEmail(email) {
    try {
        const { rows } = await pool.query(
            `
            SELECT u.id,
            u.name,
            u.email,
            u.mobile,
            u.profile_pic,
            u.password,
            t.name AS team_name,
            tm.role
            FROM auths.team_members tm
             JOIN auths.users u ON tm.user_id = u.id
             JOIN auths.teams t ON tm.team_id = t.id
             WHERE tm.role = 'admin' AND u.email = $1
            `,
            [email]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export async function findUserByMobile(mobile) {
    try {
        const { rows } = await pool.query(
            'SELECT * FROM auths.users WHERE mobile = $1',
            [mobile]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export async function findAllUsers() {
    try {
        const { rows } = await pool.query(
            `SELECT  
                u.name,
                u.email,
                u.mobile,
                u.profile_pic,
                t.name AS team_name,
                tm.role
             FROM auths.team_members tm
             JOIN auths.users u ON tm.user_id = u.id
             JOIN auths.teams t ON tm.team_id = t.id
            `
        );
        return rows;
    } catch (err) {
        document.writeln("Error: ", err.message);
    }
}

export async function findUserById(id){
    try{
        const{rows} = await pool.query(
            "SELECT u.id,u.name,u.email,u.mobile,u.profile_pic,t.name AS team_name, tm.role FROM auths.team_members tm JOIN auths.users u ON tm.user_id = u.id JOIN auths.teams t ON tm.team_id = t.id WHERE u.id = $1",
            [id]
        );
        return rows[0];
    }catch(err){
        console.log(err.message);
    }
}

export async function deleteUser(id){
    try{
        const{rows} = await pool.query(
            "DELETE FROM auths.users WHERE id = $1 RETURNING *",
            [id]
        );
        return rows[0];
    }catch(err){
        console.log(err.message);
    }
}

export default create;