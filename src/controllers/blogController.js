const blogModel = require("../models/blogModel");
const authorModel = require("../models/authorModel");
const { isValid } = require("../validator/validator");

/////////////////////////////POST BLOG API///////////////////////////

const createBlog = async function (req, res) {
  try {
    let blog = req.body
    if (!isValid(blog.title)) {
      return res.status(400).send({ status: false, msg: "title is required" })
    }
    if (!isValid(blog.body)) {
      return res.status(400).send({ status: false, msg: "body is required" })
    }
    if (!isValid(blog.category)) {
      return res.status(400).send({ status: false, msg: "category is required" })
    }
    if (!isValid(blog.authorId)) {
      return res.status(400).send({ status: false, msg: "authorId is required" })
    }

    let authorIdByUser = blog.authorId
    let authorId = await authorModel.findById(authorIdByUser)
    if (authorId == null) {
      res.status(400).send({
        status: false,
        msg: "enter the valid authorId"
      })
    }
    else {
      let blogCreated = await blogModel.create(blog)
      res.status(201).send({
        status: true,
        data: blogCreated
      })
    }
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}
//////////////////////GET BLOGS API ///////////////////////////////
const getBlogs = async function (req, res) {
  try {
    let data = req.query;
    let specificBlog = await blogModel.find({
      $and: [data,
        { isDeleted: false },
        { isPublished: true }
      ]
    }).populate("authorId")
    if (specificBlog.length == 0) {
      return res.status(404).send({
        status: false,
        msg: "Blog not found"
      })
    }
    res.status(200).send({
      status: true,
      data: specificBlog
    })
  }
  catch (error) {
    res.status(500).send({ msg: error.message })
  }
}
/////////////////////////////PUT BLOG API ///////////////////////////

const updateBlog = async function (req, res) {
  try {
    let id = req.params.blogId;
    let data = req.body;
    let blog = await blogModel.findOne({ _id: id, isDeleted: false });
    if (blog === null) {
      return res.status(404).send('No such blog found');
    }
    if (data.title) {
      blog.title = data.title
    };
    if (data.category) {
      blog.category = data.category
    };
    if (data.body) {
      blog.body = data.body
    };
    if (data.tags) {
      blog.tags.push(data.tags);
    }
    if (data.subcategory) {
      blog.subcategory.push(data.subcategory);
    }
    blog.isPublished = true;
    blog.publishedAt = new Date();
    let updateData = await blogModel.findByIdAndUpdate({ _id: id }, blog, {
      new: true,
    });
    res.status(200).send({ status: true, msg: updateData });
  } catch (err) {
    res.status(500).send({ msg: 'Error', error: err.message });
  }
};
//////////////////////////////DELETE BY PATH PARAM API///////////////////////

const deleteBlogByPath = async function (req, res) {
  try {
    let blogId = req.params.blogId;
    if (!blogId)
      res.status(400).send({ status: false, msg: "Please include an blogId" });
    let blog = await blogModel.findById(blogId);
    if (!blog)
      return res.status(404).send({ status: false, msg: "BLOG NOT FOUND" });
    if (blog.isDeleted == true) {
      res.status(400)
        .send({ status: false, msg: "This data is already deleted" });
    }
    let newData = await blogModel.findOneAndUpdate(
      { _id: blogId },
      { $set: { isDeleted: true, deletedAt: new Date() } },
      { new: true }
    );
    res.status(200);
  } catch (err) {
    res.status(500).send({ status: false, msg: "ERROR", error: err.message });
  }
};
//////////////////////////DELETE BY QUERY PARAM////////////////////////////

const deleteBlogByQuery = async function (req, res) {
  try {
    let data = req.query;

    if (data.authorId) {
      if (data.authorId != req.decoded.authorId)
        return res.status(401).send({
          status: false,
          msg: "authorId is not valid",
        });
    }
    if (Object.keys(data).length == 0) {
      return res.status(400).send({
        status: false,
        msg: "no query params available ",
      });
    }

    data.isDeleted = false;

    const deleteData = await blogModel.updateMany(data, {
      $set: {
        isDeleted:false,
        deletedAt: Date(),
      },
    });
    if (!deleteData) {
      return res.status(404).send({
        status: false,
        msg: "query data not found ",
      });
    }

    res.status(200).send({
      status: true,
      data: deleteData,
      msg: "data deleted succssesful",
    });
    console.log(deleteData);
  } catch (error) {
    res.status(500).send({
      status: false,
      msg: error.message,
    });
  }
};



module.exports.createBlog = createBlog;
module.exports.getBlogs = getBlogs;
module.exports.updateBlog = updateBlog;
module.exports.deleteBlogByPath = deleteBlogByPath;
module.exports.deleteBlogByQuery = deleteBlogByQuery;







