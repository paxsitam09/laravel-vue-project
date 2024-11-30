<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\User;
use App\Models\Category;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function getStats()
    {
        try {
            $itemCount = Item::count();
            $userCount = User::count();
            $categoryCount = Category::count();

            return response()->json([
                'totalItems' => $itemCount,
                'totalUsers' => $userCount,
                'totalCategories' => $categoryCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error fetching dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}