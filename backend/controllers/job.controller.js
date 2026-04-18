import Job from "../models/job.model.js";
// admin can post a job
export const postJob = async (req, res) => {
  try {
    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
    } = req.body;
    const userId = req.id;
    if (
      !title ||
      !description ||
      !requirements ||
      !salary ||
      !location ||
      !jobType ||
      !experience ||
      !position
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }
    const job = await Job.create({
      title,
      description,
      requirements: requirements.split(","),
      salary: Number(salary),
      location,
      jobType,
      experienceLevel: experience,
      position,
      company:companyId,
      createdBy: userId,
    });
    return res
      .status(201)
      .json({ message: "New job posted successfully", job, success: true });
  } catch (error) {
    console.log(error);
  }
};

// student can view all jobs with pagination and search by title and description
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [{title: { $regex: keyword, $options: "i"}}, 
                {description: { $regex: keyword, $options: "i"}}, 
            ]
        }   
        const jobs = await Job.find(query).populate("company").sort({createdAt:-1});
        if(!jobs){
            return res.status(404).json({message:"No jobs found",success:false});
        }
        return res.status(200).json({message:"Jobs found successfully",jobs,success:true});
    } catch (error) {
        console.log(error);
    }
};

// student can apply for a job
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;    
        const job = await Job.findById(jobId);
        if(!job){
            return res.status(404).json({message:"Job not found",success:false});
        }
        return res.status(200).json({message:"Job found successfully",job,success:true});
    } catch (error) {
        console.log(error);
    }   
};


// admin kitni jobs create kiya abhi tak
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const jobs = await Job.find({createdBy:adminId});
        if(!jobs){
            return res.status(404).json({message:"Jobs not found",success:false});
        }
        return res.status(200).json({message:"Jobs found successfully",jobs,success:true});
    } catch (error) {
        console.log(error);
    }   
};