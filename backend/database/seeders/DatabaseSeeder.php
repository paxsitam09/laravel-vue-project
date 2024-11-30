<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@test.com',
            'password' => 'password'
        ]);
        
        Category::factory()->create([
            'name' => 'Basic Item',
        ]);
        Category::factory()->create([
            'name' => 'Normal Item',
        ]);
        Category::factory()->create([
            'name' => 'Top Item',
        ]);
    }
}
