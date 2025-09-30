import pool from "../config/db.js";

//create a new company
export async function createCompany({ name, domain }) {
    const { rows } = await pool.query(
        "INSERT INTO auths.company(name,domain) VALUES ($1, $2) RETURNING *",
        [name, domain]
    );
    return rows[0];
}

//Get all companies
export async function getAllCompany(){
    const {rows} = await pool.query(
        `SELECT * FROM auths.company`
    );
    return rows;
}

//Get company by ID
export async function getCompanyById(id){
    const {rows} = await pool.query(
        `SELECT *FROM auths.company WHERE id = $1`,
        [id]
    );
    return rows[0];

}

//Get company by Name
export async function getCompanyByName(name) {
    const { rows } = await pool.query(
        `SELECT * FROM auths.company WHERE name ILIKE $1 LIMIT 1`,
        [`%${name.trim()}%`]
    );
    return rows[0] || null; // return single company or null
}
