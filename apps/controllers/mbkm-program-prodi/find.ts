import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { Pagination } from "../../utilities/pagination";
import { requestChecker } from "../../utilities/requestCheker";
import { MbkmProgramAttributes, MbkmProgramModel } from "../../models/mbkm-program";
import { MbkmProgramProdiModel } from "../../models/mbkm-program-prodi";
import { UserModel } from "../../models/user";
import { getActiveSemester } from "../../utilities/active-semester";

export const findAll = async (req: any, res: Response) => {
	const emptyField = requestChecker({
		requireList: ["x-user-id"],
		requestData: req.headers,
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const user = await UserModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				userId: { [Op.eq]: req.header("x-user-id") },
			},
		});

		if (!user) {
			const message = `access denied!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}

		const activeSemester = await getActiveSemester();

		const page = new Pagination(+req.query.page || 0, +req.query.size || 10);
		const result = await MbkmProgramProdiModel.findAndCountAll({
			where: {
				deleted: { [Op.eq]: 0 },
				mbkmProgramProdiSemesterId: { [Op.eq]: activeSemester?.semesterId },
				...(req.query.search && {
					[Op.or]: [{ programName: { [Op.like]: `%${req.query.search}%` } }],
				}),

				...(req.query.programId && {
					mbkmProgramProdiProgramId: {
						[Op.eq]: req.query.programId,
					},
				}),
				...(req.query.mbkmProgramProdiStudyProgramId && {
					mbkmProgramProdiStudyProgramId: {
						[Op.eq]: req.query.mbkmProgramProdiStudyProgramId,
					},
				}),
				...(req.query.semesterId && {
					mbkmProgramProdiSemesterId: {
						[Op.eq]: req.query.semesterId,
					},
				}),
				...(user?.userRole === "studyProgram" && {
					mbkmProgramProdiStudyProgramId: {
						[Op.eq]: user.userId,
					},
				}),
				...(user?.userRole === "department" && {
					mbkmProgramProdiDepartmentId: {
						[Op.eq]: user.userId,
					},
				}),
			},

			include: [
				{
					model: MbkmProgramModel,
					as: "mbkmPrograms",
				},
			],
			order: [["id", "desc"]],
			...(req.query.pagination == "true" && {
				limit: page.limit,
				offset: page.offset,
			}),
		});

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = page.data(result);
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};

export const findOne = async (req: any, res: Response) => {
	const params = <MbkmProgramAttributes>req.params;

	const emptyField = requestChecker({
		requireList: ["id", "x-user-id"],
		requestData: { ...req.params, ...req.headers },
	});

	if (emptyField) {
		const message = `invalid request parameter! require (${emptyField})`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.BAD_REQUEST).json(response);
	}

	try {
		const user = await UserModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				userId: { [Op.eq]: req.header("x-user-id") },
			},
		});

		if (!user) {
			const message = `access denied!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}

		const activeSemester = await getActiveSemester();

		const result = await MbkmProgramProdiModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				mbkmProgramProdiSemesterId: { [Op.eq]: activeSemester?.semesterId },
				mbkmProgramProdiProgramId: { [Op.eq]: params.id },
				...(user?.userRole === "studyProgram" && {
					mbkmProgramProdiStudyProgramId: {
						[Op.eq]: user.userId,
					},
				}),
				...(user?.userRole === "department" && {
					mbkmProgramProdiDepartmentId: {
						[Op.eq]: user.userId,
					},
				}),
			},
			include: [
				{
					model: MbkmProgramModel,
					as: "mbkmPrograms",
				},
			],
		});

		if (!result) {
			const message = `not found!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = result;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
