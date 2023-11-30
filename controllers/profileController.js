import Profile from '../models/Profile.js';

export const createProfileController = async (req, res) => {
  try {
    const {
      name,
      location,
      bio,
      experience,
      education: educationData,
      skills: skillsData,
      exp,
      email,
      phone,
    } = req.body;
    const createdBy = req.user._id;

    // Handle the case when educationData and skillsData are strings
    const education = typeof educationData === 'string' ? JSON.parse(educationData) : educationData;
    const skills = typeof skillsData === 'string' ? JSON.parse(skillsData) : skillsData;

    const newProfileData = {
      name,
      location,
      bio,
      experience,
      education,
      skills,
      exp,
      createdBy,
      email,
      phone,
    };

    // Check if req.file exists before accessing its properties
    if (req.files && req.files.photo) {
      newProfileData.photo = {
        data: req.files.photo[0].buffer,
        contentType: req.files.photo[0].mimetype,
      };
    }

    // Check if req.files and req.files.resume exist before accessing their properties
    if (req.files && req.files.resume) {
      newProfileData.resume = {
        data: req.files.resume[0].buffer,
        contentType: req.files.resume[0].mimetype,
      };
    }

    console.log('Received files:', req.files); // Add this line for logging

    const newProfile = new Profile(newProfileData);

    const savedProfile = await newProfile.save();
    res.status(201).json(savedProfile);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

  export const updateProfileController = async (req, res) => {
    try {
      const createdBy = req.params.createdBy;
  
      // Check if the profile exists
      const existingProfile = await Profile.findOne({ createdBy });
  
      if (!existingProfile) {
       return  res.status(404).json({ error: 'Profile not found' });
        
      }
  
      // Extract updated details from the request body
      const { name, location, bio, experience, education, skills, exp, email, phone } = req.body;
  
      // Update the profile fields
      existingProfile.name = name || existingProfile.name;
      existingProfile.location = location || existingProfile.location;
      existingProfile.bio = bio || existingProfile.bio;
      existingProfile.experience = experience || existingProfile.experience;
      existingProfile.education = education || existingProfile.education;
      existingProfile.skills = skills || existingProfile.skills;
      existingProfile.exp = exp || existingProfile.exp;
      existingProfile.email = email || existingProfile.email;
      existingProfile.phone = phone || existingProfile.phone;
  
      if (req.files && req.files.photo) {
        existingProfile.photo = {
          data: req.files.photo[0].buffer,
          contentType: req.files.photo[0].mimetype,
        };
      }
  
      // Check if req.files and req.files.resume exist before accessing their properties
      if (req.files && req.files.resume) {
        existingProfile.resume = {
          data: req.files.resume[0].buffer,
          contentType: req.files.resume[0].mimetype,
        };
      }
  
      // Save the updated profile
      const updatedProfile = await existingProfile.save();
  
      res.status(200).json(updatedProfile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };


  export const getProfileController = async (req, res) => {
    try {
      const createdBy = req.params.createdBy;
  
      // Check if the profile exists
      const userProfile = await Profile.findOne({ createdBy });
  
      if (!userProfile) {
        return res.status(404).json({ error: 'Profile not found' });
      }
  
      const { photo, resume, ...profileData } = userProfile.toObject();
    const profileWithPhoto = {
      ...profileData,
      photo: {
        data: photo ? photo.data.toString('base64') : null, // Convert Buffer to base64
        contentType: photo ? photo.contentType : null,
      },
      resume: {
        data: resume ? resume.data.toString('base64') : null, // Convert Buffer to base64
        contentType: resume ? resume.contentType : null,
      },
    };
  //console.log(profileWithPhoto);
      res.status(200).json(profileWithPhoto);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };