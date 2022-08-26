import express from 'express'
const router = express.Router();
import { authenticateUser }  from '../middleWare/authentication'

import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
}  from '../controllers/reviewController'

router.route('/').post(authenticateUser, createReview).get(getAllReviews);

router
  .route('/:id')
  .get(getSingleReview)
  .patch(authenticateUser, updateReview)
  .delete(authenticateUser, deleteReview);

export default router;
