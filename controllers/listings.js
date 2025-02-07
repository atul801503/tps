const Listing = require("../models/listing");

const axios = require('axios');
const MAPTILER_API_KEY =  process.env.MAP_API_KEY ;


module.exports.index = async(req,res) =>{
    let allListing =await  Listing.find({})
    res.render("listings/index.ejs",{allListing})
  }

  module.exports.renderNewForm = (req,res) =>{
    res.render("listings/new.ejs")
  }


  module.exports.showListing = async(req,res) =>{
    let {id} =  req.params;
        const listing=await Listing.findById(id)
         .populate({path:"reviews",
          populate:{
          path:"author",
         },
   }).populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    // console.log(listing);
    res.render("listings/show2.ejs",{listing});

}

module.exports.createListing = async(req,res,next) =>{
  // let responce=await geocodingClient.forwardGeocode({
  //   query: req.body.listing.location,
  //   limit: 1
  // })
  //   .send()
  const location = req.body.listing.location;
  console.log("location",location);
  const response = await axios.get(`https://api.maptiler.com/geocoding/${encodeURIComponent(location)}.json?key=${MAPTILER_API_KEY}`);
  // console.log("Response",response);
    console.log("features",response.data.features[0].geometry);
   

  let url = req.file.path;
  let filename = req.file.filename;
  // console.log(url,"and",filename);
       
  const newlisting= new Listing(req.body.listing);
  console.log(req.user);
  newlisting.owner=req.user._id;
  newlisting.image = {url,filename};
   newlisting.geometry = response.data.features[0].geometry;
   let savelisting = await newlisting.save();
  console.log(savelisting);

req.flash("success","New Listing Created");
res.redirect("/listings");


}

module.exports.renderEditForm = async(req,res) =>{
  let {id} = req.params;
 
  let listing = await Listing.findByIdAndUpdate(id);
  if(!listing){
    req.flash("error","Listing you requested for does not exist!");
    res.redirect("/listings");
  }
  let originalImageUrl = listing.image.url;
  originalImageUrl = originalImageUrl.replace("/upload","/upload/w_250");
  res.render("listings/edit.ejs", {listing,originalImageUrl});
}

module.exports.updateListing = async(req,res) =>{
  let {id} = req.params;
    let listing = await Listing.findByIdAndUpdate(id, {...req.body.listing});

    if(typeof req.file !== "undefined"){
    let url = req.file.path;
  let filename = req.file.filename;
  listing.image ={url,filename};
  await listing.save();
    }
  req.flash("success"," Listing updated!");
   res.redirect(`/listings/${id}`);
}

module.exports.destroyListing = async(req,res) => {
  let {id} = req.params;
let deletedListing = await Listing.findByIdAndDelete(id);
console.log("deleted Listing = ",deletedListing);
req.flash("success","Listing Deleted!");
res.redirect("/listings");
}


module.exports.filterListings=async(req, res)=>{
  let category=req.query.filter;
  let allListings=await Listing.find({}).where('category').in(category);    
  res.render("listings/category.ejs", {allListings: allListings, category: category});
};

module.exports.searchListings=async(req, res)=>{
  let {searchInput}=req.query;
  const regex=new RegExp(searchInput, "i");
  let searchedListing=await Listing.find({
      $or:[
          {title: {$regex: regex}},
          {description: {$regex:regex}},
          {location: {$regex: regex}},
          {country: {$regex:regex}},
          {category: {$regex: regex}}
      ]
  });
  res.render("listings/category.ejs",{allListings: searchedListing, category: searchInput});
};