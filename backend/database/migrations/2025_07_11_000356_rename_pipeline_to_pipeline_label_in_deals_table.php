<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('deals', function (Blueprint $table) {
            if (Schema::hasColumn('deals', 'pipeline')) {
                $table->renameColumn('pipeline', 'pipeline_label');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deals', function (Blueprint $table) {
            if (Schema::hasColumns('deals', 'pipeline_label')) {
                $table->renameColumn('pipeline_label', 'pipeline');
            }
        });
    }
};
