const Tour = require('../models/tourModel.js');

exports.checkBody = (req, res, next) => {
  if (!req.body.name || !req.body.price) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing name or price',
    });
  }
  next();
};

exports.getAllTours = async (req, res) => {
  try {
    // const queryObj = {...req.query}
    // const excludedFields = ['page','sort','limit','fields']
    // excludedFields.forEach(el = delete queryObj[el])

    //advanced filtering
    // let queryStr = JSON.stringify(queryObj)
    // queryStr=queryStr.replace(/\b(gte|gt|lte|lt)\b/g,match=>`$${match}`)
    // console.log(JSON.parse(queryStr))
    // console.log(req.query);
    //  const query = Tour.find(JSON.parse(queryStr))
    // //execute query
    const tours = await Tour.find();
    // console.log(req.requestTime);
     //const tours = await query
    res.status(200).json({
      status: 'success',
      requestedAt: req.requestTime,
      results: tours.length,
      data: {
        tours,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: 'No',
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    console.log(req.params);

    const tour = await Tour.findById(req.params.id);

    res.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.createTour = async (req, res) => {
  try {
    console.log(req.body);
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      },
    });
  } catch (err) {
    res.status(400).json({
      status: 'fail',
      message: err,
    });
  }
};
exports.deleteTour =async (req, res) => {
    try{
        await Tour.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success',
            data: null,
          });
  } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err,
          });
    }
  
};
