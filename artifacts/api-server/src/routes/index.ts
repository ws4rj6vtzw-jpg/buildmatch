import { Router, type IRouter } from "express";
import healthRouter from "./health";
import authRouter from "./auth";
import usersRouter from "./users";
import jobsRouter from "./jobs";
import swipesRouter from "./swipes";
import matchesRouter from "./matches";
import pushTokensRouter from "./pushTokens";
import promoRouter from "./promo";
import paymentsRouter from "./payments";
import uploadRouter from "./upload";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(usersRouter);
router.use(jobsRouter);
router.use(swipesRouter);
router.use(matchesRouter);
router.use(pushTokensRouter);
router.use(promoRouter);
router.use(paymentsRouter);
router.use(uploadRouter);

export default router;
