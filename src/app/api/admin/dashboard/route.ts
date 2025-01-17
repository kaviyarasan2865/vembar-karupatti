import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Product from '@/models/Product';
import Category from '@/models/Category';
import Order from '@/models/Order';

export async function GET() {
  try {
    await connectDB();

    // Get total products
    const totalProducts = await Product.countDocuments();

    // Get total categories
    const totalCategories = await Category.countDocuments();

    // Get orders and calculate revenue
    const orders = await Order.find();
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);

    // Get monthly sales data
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" }
          },
          total: { $sum: "$total" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 6 }
    ]);

    // Get products by category
    const productsByCategory = await Product.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category"
        }
      }
    ]);

    return NextResponse.json({
      totalProducts,
      totalCategories,
      totalOrders,
      totalRevenue,
      monthlySales: monthlySales.map(item => ({
        label: `${item._id.month}/${item._id.year}`,
        value: item.total
      })),
      productsByCategory: productsByCategory.map(item => ({
        label: item.category[0]?.name || 'Uncategorized',
        value: item.count
      }))
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard data' },
      { status: 500 }
    );
  }
} 