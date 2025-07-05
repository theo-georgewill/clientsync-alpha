<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
{
    DB::statement('SET FOREIGN_KEY_CHECKS = 0;');
    Schema::dropIfExists('deals');
    DB::statement('SET FOREIGN_KEY_CHECKS = 1;');

    Schema::create('deals', function (Blueprint $table) {
        $table->id();
        $table->string('hubspot_id')->index();
        $table->string('dealname')->nullable();
        $table->string('pipeline_id')->index();
        $table->string('pipeline')->nullable();
        $table->string('stage_id')->index();
        $table->string('stage')->nullable();
        $table->decimal('amount', 12, 2)->nullable();
        $table->timestamps();
    });
}


    public function down(): void
    {
        // Reverse by dropping the table
        Schema::dropIfExists('deals');
    }
};
