const SubCategory = require('../models/subCategory');

exports.createSubCategory = async (req, res) => {
  try {
    const { name, categoryId } = req.body;

    const existing = await SubCategory.findOne({ where: { name } });
    if (existing) {
      return res.status(400).json({ message: 'Subcategory already exists' });
    }

    const subcategory = await SubCategory.create({ name, categoryId });

    res.status(201).json({
      message: 'Subcategory created successfully',
      data: subcategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getAllSubCategories = async (req, res) => {
  try {
    const subCategories = await SubCategory.findAll();
    res.status(200).json({
      message: 'Subcategories fetched successfully',
      data: subCategories,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.getSubCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findByPk(id);

    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    res.status(200).json({
      message: 'Subcategory fetched successfully',
      data: subCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.updateSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, categoryId } = req.body;

    const subCategory = await SubCategory.findByPk(id);

    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    subCategory.name = name || subCategory.name;
    subCategory.categoryId = categoryId || subCategory.categoryId;

    await subCategory.save();

    res.status(200).json({
      message: 'Subcategory updated successfully',
      data: subCategory,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

exports.deleteSubCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const subCategory = await SubCategory.findByPk(id);

    if (!subCategory) {
      return res.status(404).json({ message: 'Subcategory not found' });
    }

    // If subcategories exist (for nested categories), delete them
    if (subCategory.getSubCategories) {
      const subCats = await subCategory.getSubCategories();
      for (const sub of subCats) {
        await sub.destroy();
      }
    }

    await subCategory.destroy();

    res.status(200).json({ message: 'Subcategory deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
};

