import { Response } from "express";
import { StatusCodes } from "http-status-codes";
import { ResponseData, ResponseDataAttributes } from "../../utilities/response";
import { Op } from "sequelize";
import { Pagination } from "../../utilities/pagination";
import { requestChecker } from "../../utilities/requestCheker";
import { UserModel } from "../../models/user";
import { MataKuliahAttributes, MataKuliahModel } from "../../models/matkul";
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
			const message = `user not registered!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.UNAUTHORIZED).json(response);
		}

		const activeSemester = await getActiveSemester();

		const page = new Pagination(+req.query.page || 0, +req.query.size || 10);
		const result = await MataKuliahModel.findAndCountAll({
			where: {
				deleted: { [Op.eq]: 0 },
				mataKuliahSemesterId: { [Op.eq]: activeSemester?.semesterId },
				...(req.query.search && {
					[Op.or]: [{ mataKuliahName: { [Op.like]: `%${req.query.search}%` } }],
				}),
				...(user.userRole === "studyProgram" && {
					mataKuliahStudyProgramId: {
						[Op.eq]: user.userId,
					},
				}),
				...(user.userRole === "department" && {
					mataKuliahDepartmentId: {
						[Op.eq]: user.userId,
					},
				}),
			},
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
	const params = <MataKuliahAttributes>req.params;

	const emptyField = requestChecker({
		requireList: ["id"],
		requestData: req.params,
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
			const message = `user not found!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const activeSemester = await getActiveSemester();

		const mataKuliah = await MataKuliahModel.findOne({
			where: {
				deleted: { [Op.eq]: 0 },
				mataKuliahSemesterId: { [Op.eq]: activeSemester?.semesterId },
				mataKuliahId: { [Op.eq]: params.id },
				...(user.userRole === "studyProgram" && {
					mataKuliahStudyProgramId: {
						[Op.eq]: user.userId,
					},
				}),
				...(user.userRole === "department" && {
					mataKuliahDepartmentId: {
						[Op.eq]: user.userId,
					},
				}),
			},
		});

		if (!mataKuliah) {
			const message = `not found!`;
			const response = <ResponseDataAttributes>ResponseData.error(message);
			return res.status(StatusCodes.NOT_FOUND).json(response);
		}

		const response = <ResponseDataAttributes>ResponseData.default;
		response.data = mataKuliah;
		return res.status(StatusCodes.OK).json(response);
	} catch (error: any) {
		const message = `unable to process request! error ${error.message}`;
		const response = <ResponseDataAttributes>ResponseData.error(message);
		return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
	}
};
