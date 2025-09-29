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
            u.global_role
            FROM auths.users u
            WHERE u.global_role ='super admin' and u.email = $1
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

export async function findUserById(id) {
    try {
        const { rows } = await pool.query(
            "SELECT u.id,u.name,u.email,u.mobile,u.profile_pic,t.name AS team_name, tm.role FROM auths.team_members tm JOIN auths.users u ON tm.user_id = u.id JOIN auths.teams t ON tm.team_id = t.id WHERE u.id = $1",
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
            "DELETE FROM auths.users WHERE id = $1 RETURNING *",
            [id]
        );
        return rows[0];
    } catch (err) {
        console.log(err.message);
    }
}


//create a new admin user

export async function createAdmin({ name, email, mobile, profile_pic, password, global_role, company_id }) {
    const { rows } = await pool.query(
        "INSERT INTO auths.users(name,email,mobile,profile_pic,password,global_role,company_id) VALUES ($1, $2, $3,$4,$5,$6,$7) RETURNING *",
        [name, email, mobile, profile_pic, password, global_role, company_id]
    );
    return rows[0];
}

//create Super Admin
export async function createSuperAdmin({ name, email, password, global_role }) {
    const { rows } = await pool.query(
        "INSERT INTO auths.users(name,email,password,global_role) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, email, password, global_role]
    );
    return rows[0];
}

// List all admins
export async function listAllAdmins() {
    const { rows } = await pool.query(
        "SELECT *FROM auths.users WHERE global_role ='admin'",
    );
    return rows;
}

//Get admin by ID
export async function getAdminById(id) {
    const { rows } = await pool.query(
        `
        SELECT 
            u.id, 
            u.name, 
            u.email, 
            u.mobile, 
            u.profile_pic, 
            u.role,
            COALESCE(
                json_agg(t.team_name) 
                FILTER (WHERE t.team_name IS NOT NULL), '[]'
            ) AS team_names
        FROM auths.users u
        LEFT JOIN auths.user_teams ut ON u.id = ut.user_id
        LEFT JOIN auths.teams t ON ut.team_id = t.id
        WHERE u.id = $1
        GROUP BY u.id, u.name, u.email, u.mobile, u.profile_pic, u.role;
        `,
        [id]
    );

    return rows[0] || null;
}

//Update admin
export async function updateAdmin(id, fields) {
    const setQuery = [];
    const values = [];
    let i = 1;

    for (const key in fields) {
        setQuery.push(`${key} = $${i}`);
        values.push(fields[key]);
        i++;
    }

    if (setQuery.length === 0) return null; // Nothing to update

    values.push(id); // last parameter is id
    const query = `
        UPDATE auths.users
        SET ${setQuery.join(", ")}
        WHERE id = $${i}
        RETURNING *;
    `;

    const { rows } = await pool.query(query, values);
    return rows[0] || null;
}


//Delete admin
export async function deleteAdmin(id) {
    const { rows } = await pool.query(
        "DELETE FROM auths.users WHERE id =$1 RETURNING *",
        [id]

    )
}

export default create;