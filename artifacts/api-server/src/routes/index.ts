import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import jobsRouter from "./jobs";
import swipesRouter from "./swipes";
import matchesRouter from "./matches";
import pushTokensRouter from "./pushTokens";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(jobsRouter);
router.use(swipesRouter);
router.use(matchesRouter);
router.use(pushTokensRouter);

export default router;
