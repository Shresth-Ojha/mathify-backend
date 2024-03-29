import { RequestHandler } from 'express';
import asyncHandler from 'express-async-handler';

import Report from '../models/report';
import ProjectError from '../helper/error';

import { ResultResponse } from '../utils/interfaces';

const getReport: RequestHandler = asyncHandler(async (req, res, next) => {
    let report;
    if (req.params.reportId) {
        // single report
        const reportId = req.params.reportId;
        const singleReport = await Report.findById(reportId);

        if (!singleReport) {
            const err = new ProjectError("Report does'nt exist.");
            err.statusCode = 404;
            throw err;
        }

        const userId = req.userId;
        const reportOf = singleReport.userId;

        if (userId !== reportOf.toString()) {
            const err = new ProjectError(
                `You can't access other user's report.`
            );
            err.statusCode = 405;
            throw err;
        }
        report = [singleReport];
    } else {
        // all reports
        const userId = req.userId;
        report = await Report.find({ userId });

        if (!report) {
            const err = new ProjectError("Report does'nt exist.");
            err.statusCode = 404;
            throw err;
        }
    }

    const resp: ResultResponse = {
        status: 'success',
        message: req.params.reportId
            ? `Fetched the report`
            : `Fetched the reports`,
        data: { report: report },
    };
    res.send(resp);
});

export { getReport };
