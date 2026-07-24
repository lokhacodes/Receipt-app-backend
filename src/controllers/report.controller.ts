import { Request, Response } from "express";

import {
  createReport,
  getReports,
  getReportById,
  updateReport,
  deleteReport,
   getReportExpenses,
} from "../services/report.service";



/* ==========================================
   CREATE REPORT
========================================== */

export const createReportHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const report = await createReport(
      userId,
      req.body
    );

    return res.status(201).json({
      success: true,
      message: "Report created successfully.",
      data: report,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to create report.",
    });
  }
};

/* ==========================================
   GET ALL REPORTS
========================================== */

export const getReportsHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const reports = await getReports(userId);

    return res.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch reports.",
    });
  }
};

/* ==========================================
   GET REPORT BY ID
========================================== */

export const getReportHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const report = await getReportById(
      req.params.id,
      userId
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report.",
    });
  }
};

/* ==========================================
   UPDATE REPORT
========================================== */

export const updateReportHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const report = await updateReport(
      req.params.id,
      userId,
      req.body
    );

    if (!report) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.json({
      success: true,
      message: "Report updated successfully.",
      data: report,
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to update report.",
    });
  }
};


/* ==========================================
   GET REPORT EXPENSES
========================================== */

export const getReportExpensesHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const expenses = await getReportExpenses(
      req.params.id,
      userId
    );

    return res.json({
      success: true,
      data: expenses,
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch report expenses.",
    });
  }
};

/* ==========================================
   DELETE REPORT
========================================== */

export const deleteReportHandler = async (
  req: Request,
  res: Response
) => {
  try {
    const userId = (req as any).user.id;

    const deleted = await deleteReport(
      req.params.id,
      userId
    );

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Report not found.",
      });
    }

    return res.json({
      success: true,
      message: "Report deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete report.",
    });
  }
};