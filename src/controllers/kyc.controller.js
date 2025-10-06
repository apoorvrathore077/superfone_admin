import { createKYCRecord } from "../models/kyc.model.js";

/**
 * Company Admin submits KYC form with multiple documents
 */
export async function submitKyc(req, res) {
  try {
    const userId = req.user.id; // logged in admin

    // Ensure company_id exists and is a number
    const companyId = parseInt(req.user.company_id, 10);
    if (!companyId) {
      return res.status(400).json({ success: false, message: "Admin does not have a company_id assigned" });
    }

    // Merge companyId into kycData
    const kycData = req.body;
    kycData.company_id = companyId;

    // Check uploaded documents
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: "Documents are required" });
    }

    // Map uploaded files to file names only (no full path)
    kycData.documents = req.files.map(file => file.originalname);

    // Validate required fields
    const requiredFields = [
      'company_name','registration_no','gst_number','pan_number',
      'director_name','director_mobile','director_email',
      'company_website','company_address','documents'
    ];

    for (let field of requiredFields) {
      if (!kycData[field] || (Array.isArray(kycData[field]) && kycData[field].length === 0)) {
        return res.status(400).json({ success: false, message: `${field} is required` });
      }
    }

    // Create KYC record in DB
    const kycRecord = await createKYCRecord(userId, kycData);

    res.status(201).json({ success: true, kyc: kycRecord });

  } catch (err) {
    console.error(err);

    // Handle unique constraint violation
    if (err.code === '23505') {
      return res.status(400).json({ success: false, message: 'Duplicate entry detected' });
    }

    res.status(500).json({ success: false, error: err.message });
  }
}
