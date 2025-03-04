const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//const { Model } = require('mongoose');
const APIFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(new AppError('No doc found with that ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: {
        data: doc.body,
        message: 'Document deleted successfully',
      },
    });
  });

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (!req.body || Object.keys(req.body).length === 0) {
      return next(new AppError('Request body cannot be empty', 400));
    }
    // 🚨 Check if name exists
    if (!req.body.name || req.body.name.trim() === '') {
      return next(new AppError('A tour must have a name', 400));
    }
    // 🚨 Check if name exists
    if (!req.body.duration) {
      return next(new AppError('A tour must have duration', 400));
    }
    if (!req.body.maxGroupSize) {
      return next(new AppError('A tour must have a group size', 400));
    }

    // 🚨 Check if difficulty is valid
    const validDifficulties = ['easy', 'medium', 'difficult'];
    if (
      !req.body.difficulty ||
      !validDifficulties.includes(req.body.difficulty)
    ) {
      return next(
        new AppError('Difficulty is either: easy, medium, difficult', 400),
      );
    }

    if (
      req.body.ratingsAverage > 5 ||
      req.body.ratingsAverage < 1 ||
      !req.body.ratingsAverage
    ) {
      return next(new AppError('Ratings average must be between 1 and 5', 400));
    }
    if (req.body.price < req.body.priceDiscount) {
      return next(
        new AppError('Discount price should be below regular price', 400),
      );
    }
    if (!req.body.price) {
      return next(new AppError('A tour must have a price', 400));
    }
    if (!req.body.summary) {
      return next(new AppError('A tour must have a summary', 400));
    }
    // ✅ Check if imageCover exists (BEFORE difficulty)
    if (!req.body.imageCover || req.body.imageCover.trim() === '') {
      return next(new AppError('A tour must have a cover image', 400)); // 🔥 This runs first
    }
    // ✅ Validate startLocation coordinates
    if (
      !req.body.startLocation ||
      !req.body.startLocation.coordinates ||
      !Array.isArray(req.body.startLocation.coordinates) ||
      req.body.startLocation.coordinates.length !== 2 ||
      typeof req.body.startLocation.coordinates[0] !== 'number' ||
      typeof req.body.startLocation.coordinates[1] !== 'number'
    ) {
      return next(new AppError('Invalid location format', 400));
    }
    const doc = await Model.create(req.body);

    res.status(201).json({
      status: 'success',
      data: doc,
    });
  });

exports.getOne = (Model, popOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (popOptions) query = query.populate(popOptions);
    const doc = await query;

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: doc,
    });
  });

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    // To allow for nested GET reviews on tour (hack)
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const features = new APIFeatures(Model.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();
    // const doc = await features.query.explain();
    const doc = await features.query;
    //.explain();

    // SEND RESPONSE
    res.status(200).json({
      status: 'success',
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
