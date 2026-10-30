<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $priceRetail = fake()->randomFloat(2, 1, 100);
        return [
            'category_id' => Category::factory(),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'price_retail' => $priceRetail,
            'price_wholesale' => $priceRetail * 0.8,
            'stock' => fake()->numberBetween(0, 100),
            'is_active' => true,
        ];
    }
}
