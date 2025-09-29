import pool from "../config/db.js";

export async function create({ name, email, mobile, profile_pic, password, company_id, global_role }) {
    // Optional: validate company exists
    const companyResult = await pool.query(
        `SELECT id FROM auths.company WHERE id = $1`,
        [company_id]
    );
    if (!companyResult.rows.length) {
        throw new Error("Company not found");
    }

    // Insert user
    const { rows } = await pool.query(
        `INSERT INTO auths.users (name, email, mobile, profile_pic, password, company_id,global_role)
     VALUES ($1, $2, $3, $4, $5, $6,$7)
     RETURNING *`,
        [name, email, mobile, profile_pic, password, company_id, global_role]
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
             u.company_id,
             u.password,
             u.global_role,
             t.name AS team_name,
             tm.role
      FROM auths.users u
      LEFT JOIN auths.team_members tm ON tm.user_id = u.id
      LEFT JOIN auths.teams t ON tm.team_id = t.id
      WHERE (u.global_role = 'admin' OR tm.role = 'admin')
        AND u.email = $1
      `,
            [email]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export async function findUserByName(name) {
    try {
        const { rows } = await pool.query(
            `SELECT id, name, email, global_role
       FROM auths.users
       WHERE name = $1`,
            [name]
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
                u.id,
                u.name,
                u.email,
                u.mobile,
                u.profile_pic,
                t.name AS team_name,
                tm.role
             FROM auths.users u
             LEFT JOIN auths.team_members tm ON tm.user_id = u.id
             LEFT JOIN auths.teams t ON tm.team_id = t.id
            WHERE u.global_role NOT IN('admin','super admin')
            `
        );
        return rows;
    } catch (err) {
        document.writeln("Error: ", err.message);
    }
}

export async function findUserById(id) {
    try {
        const { rows } = await pool.query(
            `
            SELECT 
            u.id,
            u.name,
            u.email,
            u.mobile,
            u.profile_pic,
            t.name AS team_name,
            tm.role
            FROM auths.users u
            LEFT JOIN auths.team_members tm ON tm.user_id = u.id
            LEFT JOIN auths.teams t ON tm.team_id = t.id
            WHERE u.id = $1 AND u.global_role != 'admin'
            `,
            [id]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export async function deleteUser(id) {
    try {
        const { rows } = await pool.query(
            "DELETE FROM auths.users WHERE id = $1 AND global_role = 'agent' RETURNING *",
            [id]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}

export default create;