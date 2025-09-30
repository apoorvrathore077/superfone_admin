import{createCompany,getAllCompany, getCompanyById, getCompanyByName} from "../models/company.model.js";

//add company
export async function createCompanyController(req,res){
    try {
        const {name,domain} =req.body;
        if(!name || !domain){
            return res.status(400).json({message:"All fields are required"});
        }
        const company = await createCompany({name,domain});
        return res.status(201).json({
            message:"Company created successfully",
            company
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
                message: error.message,
                success: false
            })
    }
}

//get all companies
export async function getAllCompanyController(req,res){
    try {
        const companies = await getAllCompany();
        return res.status(200).json({
            companies
        })
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            message: error.message,
            success: false
        })
    }
}

//Get company by ID
export async function getCompanyByIdController(req,res) {
    try {
        const {id}=req.params;
        //Validate ID
        if(!id || isNaN(id)){
            return res.status(400).json({message:"Invalid or missing company ID" })
        }
        const company= await getCompanyById(id);
        if(!company){
            return res.status(404).json({message:"Company not found"})
        }
        res.status(200).json(company);
    } catch (error) {
        console.log(error.message);
        res.status(500).json({
        message:error.message,
        success:false
    })
    }
    
}

//Get Company by Name
export async function getCompanyByNameController(req, res) {
    try {
        const name = req.params.name;

        if (!name || name.trim() === "") {
            return res.status(400).json({ message: "Invalid or missing company name" });
        }

        const company = await getCompanyByName(name.trim());

        if (!company) {
            return res.status(404).json({ message: "Company not found" });
        }

        return res.status(200).json({
            message: "Company fetched successfully",
            company,
            success: true
        });
    } catch (error) {
        console.error(error.message);
        return res.status(500).json({
            message: error.message,
            success: false
        });
    }
}
