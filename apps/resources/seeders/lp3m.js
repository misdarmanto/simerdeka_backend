"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
	async up(queryInterface, Sequelize) {
		await queryInterface.bulkInsert("lp3m", [
			{
				lp3mId: "e44f033b-856b-40e0-946c-166dba272644",
				lp3mName: "lp3m",
				lp3mEmail: "lp3m@itera.ac.id",
			},
		]);
	},

	async down(queryInterface, Sequelize) {
		await queryInterface.bulkDelete("lp3m", null, {});
	},
};
