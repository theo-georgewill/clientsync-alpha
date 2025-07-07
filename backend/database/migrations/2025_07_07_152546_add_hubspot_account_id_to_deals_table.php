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
            // If hubspot_account_id does not exist yet:
            if (!Schema::hasColumn('deals', 'hubspot_account_id')) {
                $table->unsignedBigInteger('hubspot_account_id')->nullable()->after('id');
            }

            // Add the foreign key constraint
            $table
                ->foreign('hubspot_account_id')
                ->references('id')
                ->on('hubspot_accounts')
                ->onDelete('cascade'); // Adjust cascade behavior if needed
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('deals', function (Blueprint $table) {
            $table->dropForeign(['hubspot_account_id']);
            $table->dropColumn('hubspot_account_id');
        });
    }
};
