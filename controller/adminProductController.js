const mongooose = require("mongoose");
const productModel = require("../model/productModel");
const categoryModel = require("../model/categoryModel");
const brandModel = require("../model/brandModel");

const sharp = require("sharp");

const viewProducts = async (req, res) => {
  try {
    const categoryList = await categoryModel.find();
    const brandList = await brandModel.find();
    const productList = await productModel
      .find()
      .populate(["category", "brand"]);
    res.render("admin/product", {
      session: req.session.admin,
      DocumentTitle: "Product Management",
      categories: categoryList,
      brands: brandList,
      products: productList,
    });
  } catch (err) {
    console.log("admin product page showing " + err);
    res.redirect("/admin/dashboard");
  }
};

const addProducts = async (req, res) => {
  try {
    let frontImage = `${req.body.name}_front_image_${Date.now()}.png`;
    sharp(req.files.frontImage[0].buffer)
      .toFormat("png")
      .png({ quality: 80 })
      .toFile(`public/img/products/${frontImage}`);
    req.body.frontImage = frontImage;
    let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
    sharp(req.files.thumbnail[0].buffer)
      .toFormat("png")
      .png({ quality: 80 })
      .toFile(`public/img/products/${thumbnail}`);
    req.body.thumbnail = thumbnail;
    const newImages = [];
    for (i = 0; i < 3; i++) {
      let imageName = `${req.body.name}_image${i + 1}_${Date.now()}.png`;
      sharp(req.files.images[i].buffer)
        .toFormat("png")
        .png({ quality: 80 })
        .toFile(`public/img/products/${imageName}`);
      newImages.push(imageName);
    }
    req.body.images = newImages;
    req.body.category = new mongooose.Types.ObjectId(req.body.category);
    req.body.brand = new mongooose.Types.ObjectId(req.body.brand);

    const size = req.body.sizes  
        const stock = req.body.stock 
        const sizesStock = [] 
        for(let i=0; i<size.length; i++){ 
            sizesStock.push({ 
                size:size[i],  
                stock:stock[i] 
            }) 
        } 
        console.log("sizesStock : "+sizesStock) 
        req.body.sizeAndStock =sizesStock 
        req.body.updatedBy = req.session.admin.name  
 
         //fields inside req.body and collection fields should match with each other 
         const newProduct = new productModel(req.body); 
         await newProduct.save();

    console.log("product added succesfully");
    res.redirect("/admin/productManagement");
  } catch (err) {
    console.log("error in admin side add product " + err);
  }
};

const showEditProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const editProduct = await productModel
      .findOne({ _id: id })
      .populate(["category", "brand"]);
      console.log("edit product"+editProduct);
    const categoryList = await categoryModel.find();
    const brandList = await brandModel.find();
    if (editProduct) {
      res.render("admin/editProducts", {
        session: req.session.admin,
        DocumentTitle: "Product Management",
        categories: categoryList,
        brands: brandList,
        product: editProduct
      });
    } else { 
      res.redirect("/admin/dashboard");
    }
  } catch (err) {
    console.log("error in rendering edit product page -" + err);
  }
};

const saveEditProduct = async (req, res) => {
  try {
    if (JSON.stringify(req.files) !== "{}") {
      
      if (req.files.frontImage) {
        let frontImage = `${req.body.name}_front_image_${Date.now()}.png`;
        sharp(req.files.frontImage[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`public/img/products/${frontImage}`);
        req.body.frontImage = frontImage;
        console.log("kajjknj",req.body.frontImage);
      }
      if (req.files.thumbnail) {
        let thumbnail = `${req.body.name}_thumbnail_${Date.now()}.png`;
        sharp(req.files.thumbnail[0].buffer)
          .toFormat("png")
          .png({ quality: 80 })
          .toFile(`public/img/products/${thumbnail}`);
        req.body.thumbnail = thumbnail;
      }
      if (req.files.images) {
        const newImages = [];
        for (i = 0; i < 3; i++) {
          imageName = `${req.body.name}_image${i + 1}${Date.now()}.png`;
          sharp(req.files.images[i].buffer)
            .toFormat("png")
            .png({ quality: 80 })
            .toFile(`public/img/products/${imageName}`);
          newImages.push(imageName);
        }
        req.body.images = newImages;
      }
    }
    req.body.category = new mongooose.Types.ObjectId(req.body.category);
    req.body.brand = new mongooose.Types.ObjectId(req.body.brand);

    const size = req.body.sizes
    const stock = req.body.stock
    const sizesStock = []
    for(let i= 0;i < size.length;i++){
      sizesStock.push({
        size:size[i],
        stock:stock[i]
      })
    }
    req.body.sizeAndStock = sizesStock
    req.body.category = new mongooose.Types.ObjectId(req.body.category);
    req.body.brand = new mongooose.Types.ObjectId(req.body.brand);
    req.body.updatedBy = req.session.admin.name

    await productModel.findByIdAndUpdate(req.params.id,req.body)
    
    res.redirect("/admin/productManagement");
  } catch (err) { 
    console.log("Error in saving edit product-" + err);
    res.redirect("/admin/dashboard");
  }
};

const changeListing = async (req, res) => {
  try {
    const currentProduct = await productModel.findById(req.params.id);
    let currentListing = currentProduct.listed;
    if (currentListing == true) {
      currentListing = false;
    } else {
      currentListing = true;
    }
    currentListing = Boolean(currentListing);
    console.log(currentProduct);
    await productModel.updateOne(
      {
        _id: currentProduct._id,
      },
      {
        $set:{
          listed:currentListing
        }
      }
    );
    res.json({
      data: "success",
    });
  } catch (err) {
    console.log(`error in change listing - ${err}`);
    res.redirect("/admin/dashboard");
  }
};
module.exports = {
  viewProducts,
  addProducts,
  showEditProduct,
  saveEditProduct,
  changeListing,
};
