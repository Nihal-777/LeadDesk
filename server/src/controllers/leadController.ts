import { Request, Response, NextFunction } from 'express';
import { Lead } from '../models/Lead';

// Create a Lead (Public)
export const createLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, budget, message } = req.body;

    const newLead = new Lead({
      name,
      email,
      budget,
      message,
      status: 'New', // Default status
    });

    await newLead.save();

    res.status(201).json({
      success: true,
      message: 'Lead captured successfully.',
      lead: newLead,
    });
  } catch (error) {
    next(error);
  }
};

// Get Leads with Paginated, Sorted, and Filtered Query (Protected)
export const getLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const status = (req.query.status as string) || 'All';

    // Construct DB Query
    const query: any = {};

    // Filter by Status
    if (status !== 'All') {
      query.status = status;
    }

    // Search by Name or Email
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skipIndex = (page - 1) * limit;

    // Fetch leads & total count (paginated)
    const totalFiltered = await Lead.countDocuments(query);
    const leads = await Lead.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .skip(skipIndex)
      .limit(limit);

    // Fetch global statistics for dashboard cards & charts
    const totalLeads = await Lead.countDocuments({});
    const newLeads = await Lead.countDocuments({ status: 'New' });
    const contactedLeads = await Lead.countDocuments({ status: 'Contacted' });
    const closedLeads = await Lead.countDocuments({ status: 'Closed' });

    // Fetch budget aggregates for charts
    const budgetStats = await Lead.aggregate([
      {
        $group: {
          _id: '$budget',
          count: { $sum: 1 }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      leads,
      stats: {
        totalLeads,
        newLeads,
        contactedLeads,
        closedLeads,
        budgetStats
      },
      pagination: {
        totalLeads: totalFiltered,
        totalPages: Math.ceil(totalFiltered / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Search Leads Dedicated Endpoint (Protected)
export const searchLeads = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const q = (req.query.q as string) || '';
    if (!q) {
      return res.status(200).json({
        success: true,
        leads: [],
      });
    }

    const leads = await Lead.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ],
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      leads,
    });
  } catch (error) {
    next(error);
  }
};

// Update Lead Status (Protected)
export const updateLeadStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const lead = await Lead.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );

    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: `Lead status updated to ${status}.`,
      lead,
    });
  } catch (error) {
    next(error);
  }
};

// Delete Lead (Protected)
export const deleteLead = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    const lead = await Lead.findByIdAndDelete(id);
    if (!lead) {
      return res.status(404).json({
        success: false,
        message: 'Lead not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Lead deleted successfully.',
      lead,
    });
  } catch (error) {
    next(error);
  }
};
