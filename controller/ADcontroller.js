const Ad = require('../models/ad');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path'); // Use path to handle file paths in a cross-platform way

// Create a new ad (admin only)
exports.createAd = async (req, res) => {
  try {
     
    if (!req.file) {
      return res.status(400).json({
          message: 'image is required'
      });
  }
  const { title, description } = req.body;
   
      const result = await cloudinary.uploader.upload(req.file.path, { resource_type: 'auto' }, (error, data) => {
                if (error) {
                    return res.status(400).json({
                        message: error.message
                    })
                } else {
                    return data
                }
            });
            
            // Unlink the file from our local storage after upload
            fs.unlinkSync(req.file.path);

    const ad = await Ad.create({
      title,
      image: result.secure_url,
      description
    });

    res.status(201).json({ message: 'Ad created successfully',
      data:  ad });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create ad', error: error.message });
  }
};


// Get all ads
exports.getAllAds = async (req, res) => {
  try {
    const ads = await Ad.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(ads);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ads', error: error.message });
  }
};

// Get a single ad by ID
exports.getAdById = async (req, res) => {
  try {
    const ad = await Ad.findByPk(req.params.id);
    if (!ad) return res.status(404).json({ message: 'Ad not found' });

    res.status(200).json({ message: 'Ad found',
      data: ad
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch ad', error: error.message });
  }
};

// Delete an ad by ID (optional manual deletion by admin)
// exports.deleteAd = async (req, res) => {
//   try {
//     const ad = await Ad.findByPk(req.params.id);
//     if (!ad) return res.status(404).json({ message: 'Ad not found' });

//     // Check if there's an image, and if so, delete it from Cloudinary
//     if (ad.image) {
//       const publicId = ad.image.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId); // Destroy image from Cloudinary
//     }

//     // Delete the ad from the database
//     await ad.destroy();

//     res.status(200).json({ message: 'Ad deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Failed to delete ad', error: error.message });
//   }
// };


exports.deleteAd = async (req, res) => {
  try {
      const { id } = req.params;
      const ad = await Ad.findByPk(id);

      if (!ad) {
          return res.status(404).json({
              message: 'User not found'
          })
      }
      const oldFilePaths = ad.profilePic.map((e) => { return `./uploads/${e}` })
      const deleted =await Ad.destroy(id)
      
      if (deleted) {
          oldFilePaths.forEach((path) => {
              if (fs.existsSync(path)) {
                  fs.unlinkSync(path)  
          }
          })
      }
      res.status(201).json({
          message: 'user deleted successfully',
          data: deleted
          
      })
  } catch (error) {
     res.status(500).json({
      message: 'Internal Server Error ' + error.message 
     }) 
  }
}


//const path = require('path'); // Use path to handle file paths in a cross-platform way

// exports.deleteAd = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ad = await Ad.findByPk(id);

//     if (!ad) {
//       return res.status(404).json({
//         message: 'Ad not found'
//       });
//     }

//     // Assuming 'profilePic' holds an array of filenames
//     const oldFilePaths = ad.profilePic.map((file) => path.join(__dirname, `../uploads/${file}`));

//     // Delete the ad from the database
//     const deleteAd = await ad.destroy();

//     if (deleteAd) {
//       // Remove files from the local file system
//       oldFilePaths.forEach((filePath) => {
//         if (fs.existsSync(filePath)) {
//           fs.unlinkSync(filePath);
//         }
//       });
//     }

//     res.status(200).json({
//       message: 'Ad deleted successfully',
//       data: deleteAd
//     });
//   } catch (error) {
//     res.status(500).json({
//       message: 'Internal Server Error: ' + error.message
//     });
//   }
// };
