import { Router } from "express";
import { getActivity } from "@/controllers";

const activityRouter = Router();

activityRouter.get("", getActivity);

export { activityRouter };
