import { Express, Request, Response } from "express";
import { index } from "../controllers";
import { semesterRoutes } from "./semester-route";
import { RecomendationLetterRoutes } from "./recomendation-letter-route";
import { userRoutes } from "./user-router";
import { reportParticipationRoutes } from "./report-participation-route";
import { mbkmProgramRoutes } from "./mbkm-program";
import { sksConvertionRoutes } from "./sks-convertion-route";
import { studentRoutes } from "./student-route";
import { studyProgramRoutes } from "./study-program";
import { departmentRoutes } from "./department-route";
import { academicRoutes } from "./academic-route";
import { lp3mRoutes } from "./lp3m-route";
import { summaryRoutes } from "./summary";
import { logBookRoute } from "./log-book-route";
import { mataKuliahRoute } from "./mata-kuliah-route";
import { transkripRoute } from "./transkrip-route";
import { mbkmProgramProdiRoutes } from "./mbkm-program-prodi";
import { sksConvertionSchemaRoutes } from "./sks-convertion-schema-route";
import { uploadFileRoutes } from "./upload-file-route";
import { lectureRoutes } from "./lecture-route";
import { middleware } from "../middlewares";

export const route = (app: Express) => {
	app.get(
		"/",
		middleware.ipBlackList,
		middleware.useAuthorization,
		(req: Request, res: Response) => index(req, res)
	);
	userRoutes(app);
	RecomendationLetterRoutes(app);
	semesterRoutes(app);
	reportParticipationRoutes(app);
	mbkmProgramRoutes(app);
	mbkmProgramProdiRoutes(app);
	sksConvertionRoutes(app);
	sksConvertionSchemaRoutes(app);
	studentRoutes(app);
	studyProgramRoutes(app);
	departmentRoutes(app);
	academicRoutes(app);
	lp3mRoutes(app);
	summaryRoutes(app);
	logBookRoute(app);
	mataKuliahRoute(app);
	transkripRoute(app);
	uploadFileRoutes(app);
	lectureRoutes(app);
};
