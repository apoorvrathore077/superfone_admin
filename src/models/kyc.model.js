import pool from "../config/db.js";

export async function createKYCRecord(userId, kycData) {
  const { company_id,company_name,registration_no,gst_number,pan_number,director_name,director_mobile,director_email,company_website,company_address,documents } = kycData;
  const result = await pool.query(
    `INSERT INTO auths.company_kyc(company_id,company_name,registration_no,gst_number,pan_number,director_name,director_mobile,director_email,company_website,company_address,documents)
     VALUES ($1, $2, $3, $4, $5, $6,$7,$8,$9,$10,$11) RETURNING *`,
    [company_id,company_name,registration_no,gst_number,pan_number,director_name,director_mobile,director_email,company_website,company_address,documents]
  );
  return result.rows[0];
}

