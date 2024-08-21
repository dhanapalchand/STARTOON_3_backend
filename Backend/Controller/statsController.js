const User = require('../Models/userModel');

const getStats = async (req, res) => {
  try {

    const totalCount = await User.countDocuments();

    const currentYear = new Date().getFullYear();
    const startDate = new Date(currentYear, 0, 1);
    const endDate = new Date(currentYear + 1, 0, 1);

    const monthlyCounts = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: { $month: "$lastLogin" },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const monthlyData = Array.from({ length: 12 }, (_, index) => {
      const month = index + 1;
      const found = monthlyCounts.find(item => item._id === month);
      return { month, count: found ? found.count : 0 };
    });

    const currentMonth = new Date().getMonth() + 1; 
    const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
    const endOfMonth = new Date(currentYear, currentMonth, 1);

    const dateWiseCounts = await User.aggregate([
      {
        $match: {
          lastLogin: { $gte: startOfMonth, $lt: endOfMonth }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$lastLogin" } },
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);

    const dateWiseData = Array.from({ length: new Date(currentYear, currentMonth, 0).getDate() }, (_, index) => {
      const date = new Date(currentYear, currentMonth - 1, index + 1);
      const dateStr = date.toISOString().split('T')[0];
      const found = dateWiseCounts.find(item => item._id === dateStr);
      return { date: dateStr, count: found ? found.count : 0 };
    });

    res.status(200).json({ totalCount, monthlyData, dateWiseData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStats };
