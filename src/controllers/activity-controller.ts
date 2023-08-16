import { AuthenticatedRequest } from "@/middlewares";
import { Response } from "express";
import httpStatus from "http-status";
import activityService from "@/services/activity-services";

export async function getActivity(req: AuthenticatedRequest, res: Response) {
  try {
    const activities = await activityService.getAllActivities();
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}

export async function getActivityByDate(req: AuthenticatedRequest, res: Response) {
  const { date } = req.params;
  console.log('controller date= '+date)
  
  try {
    const activities = await activityService.findActivitiesByDate(date);
    return res.status(httpStatus.OK).send(activities);
  } catch (error) {
    return res.sendStatus(httpStatus.NOT_FOUND);
  }
}
