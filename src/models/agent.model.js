import pool from "../config/db.js";

//Get all agents
export async function getAgent(){
    const {rows} = await pool.query(
        `SELECT * FROM auths.users WHERE global_role = 'agent'`
    );
    return rows;
}


//get agent by ID
export async function getAgentById(id) {
    const { rows } = await pool.query(
        `
        SELECT id, name, email, mobile, profile_pic, company_id, global_role
        FROM auths.users
        WHERE id = $1 AND global_role = 'agent'
        `,
        [id]
    );
    return rows[0] || null;
}

//List agents under admin
export async function listAgentsUnderAdmin(adminId) {
    const { rows } = await pool.query(
        `
        SELECT u.id, u.name, u.email, u.mobile, u.profile_pic, u.company_id, u.global_role
        FROM auths.users u
        WHERE u.company_id = (
            SELECT company_id 
            FROM auths.users 
            WHERE id = $1 AND global_role = 'admin'
        )
        AND u.global_role = 'agent'
        `,
        [adminId]
    );
    return rows;
}

//Update agent
export async function updateAgent(id, fields) {
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

//Delete agent
export async function deleteAgent(id) {
    const { rows } = await pool.query(
        `DELETE FROM auths.users 
         WHERE id = $1 AND global_role = 'agent'
         RETURNING *`,
        [id]
    );
    return rows[0] || null;
}
