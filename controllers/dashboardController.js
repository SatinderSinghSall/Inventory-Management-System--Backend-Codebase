import Product from "../models/Product.js";
import Order from "../models/Order.js";

//!Dashboard Summary:
const getSummary = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // Run all DB queries in parallel
    const [
      totalProducts,
      stockResult,
      ordersToday,
      revenueResult,
      outOfStock,
      highestSaleResult,
      lowStock,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.aggregate([
        { $group: { _id: null, totalStock: { $sum: "$stock" } } },
      ]),
      Order.countDocuments({ orderDate: { $gte: startOfDay, $lte: endOfDay } }),
      Order.aggregate([
        { $group: { _id: null, totalRevenue: { $sum: "$totalPrice" } } },
      ]),
      Product.find({ stock: 0 })
        .select("name category stock")
        .populate("category", "name"),
      Order.aggregate([
        { $group: { _id: "$product", totalQuantity: { $sum: "$quantity" } } },
        { $sort: { totalQuantity: -1 } },
        { $limit: 1 },
        {
          $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "_id",
            as: "product",
          },
        },
        { $unwind: "$product" },
        {
          $lookup: {
            from: "categories",
            localField: "product.category",
            foreignField: "_id",
            as: "product.category",
          },
        },
        { $unwind: "$product.category" },
        {
          $project: {
            name: "$product.name",
            category: "$product.category.name",
            totalQuantity: 1,
          },
        },
      ]),
      Product.find({ stock: { $gt: 0, $lt: 5 } })
        .select("name category stock")
        .populate("category", "name"),
    ]);

    const totalStock = stockResult[0]?.totalStock || 0;
    const revenue = revenueResult[0]?.totalRevenue || 0;
    const highestSaleProduct = highestSaleResult[0] || {
      message: "No sales data available",
    };

    res.status(200).json({
      totalProducts,
      totalStock,
      ordersToday,
      revenue,
      outOfStock,
      highestSaleProduct,
      lowStock,
    });
  } catch (error) {
    console.error("Dashboard summary error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard summary",
      error: error.message,
    });
  }
};

export { getSummary };
