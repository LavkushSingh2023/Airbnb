const Listing = require("../init/models/listing.js");

module.exports.index = async (req, res, next) => {
    try {
        let allListings = await Listing.find({});
        res.render("listings/index.ejs", { allListings });
    } catch (err) {
        next(err);
    }
};

module.exports.renderFormToCreateNewListing = (req, res) => {
    res.render("listings/new.ejs")
};

module.exports.showListingInDetail = async (req, res) => {
    let { id } = req.params;
    let lists = await Listing.findById(id).populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });
    if (!lists) {
        req.flash("error", "Listing that you search for showing in detail does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", { lists });
};

module.exports.createNewListing = async (req, res) => {

    let url = req.file ? req.file.path : undefined;              // imp because if we not write undefined it is not fetching default img and throwing error
    let filename = req.filee ? req.file.filename : undefined;

    const newListing = new Listing(req.body.listing);   // imp
    newListing.owner = req.user._id;
    newListing.image = {url, filename};
    await newListing.save();
    req.flash("success", "New listing created!");
    res.redirect("/listings");
};

module.exports.renderFormToEditListing = async (req, res) => {
    let { id } = req.params;
    let editableLists = await Listing.findById(id);
    if (!editableLists) {
        req.flash("error", "Listing that you search for edit does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/edit", { editableLists });
};

module.exports.updateListing = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});  // imp
   
    if(typeof req.file !== 'undefined'){
        let url = req.file.path;
        let filename = req.file.filename;
        console.log(url," and   ", filename)
        listing.image = {url, filename}
        await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/show/${id}`);       //imp
};

module.exports.deleteListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted!");
    res.redirect("/listings")
};