import { Router } from "express";
import { getActivity, getActivityByDate } from "@/controllers";

const activityRouter = Router();

activityRouter.get("", getActivity).get("/:date",getActivityByDate).post('/:activieId')

export { activityRouter };
