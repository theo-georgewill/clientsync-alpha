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
        Schema::table('pipelines', function (Blueprint $table) {
            $table->unsignedBigInteger('hubspot_account_id')->nullable()->after('id');
        });

        Schema::table('stages', function (Blueprint $table) {
            $table->unsignedBigInteger('hubspot_account_id')->nullable()->after('id');
        });

        Schema::table('deals', function (Blueprint $table) {
            $table->unsignedBigInteger('hubspot_account_id')->nullable()->after('id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pipelines', function (Blueprint $table) {
            $table->dropColumn('hubspot_account_id');
        });

        Schema::table('stages', function (Blueprint $table) {
            $table->dropColumn('hubspot_account_id');
        });

        Schema::table('deals', function (Blueprint $table) {
            $table->dropColumn('hubspot_account_id');
        });
    }
};
