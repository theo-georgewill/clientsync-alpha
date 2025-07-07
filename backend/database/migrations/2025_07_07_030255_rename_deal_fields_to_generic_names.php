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
        // Deals table
        Schema::table('deals', function (Blueprint $table) {
            if (Schema::hasColumn('deals', 'hubspot_id')) {
                $table->renameColumn('hubspot_id', 'deal_id');
            }
        });

        // Pipelines table
        Schema::table('pipelines', function (Blueprint $table) {
            if (Schema::hasColumn('pipelines', 'hubspot_id')) {
                $table->renameColumn('hubspot_id', 'pipeline_id');
            }
        });

        // Stages table
        Schema::table('stages', function (Blueprint $table) {
            if (Schema::hasColumn('stages', 'hubspot_id')) {
                $table->renameColumn('hubspot_id', 'stage_id');
            }
        });

        // Companies table
        Schema::table('companies', function (Blueprint $table) {
            if (Schema::hasColumn('companies', 'hubspot_id')) {
                $table->renameColumn('hubspot_id', 'company_id');
            }
        });

        // Contacts table
        Schema::table('contacts', function (Blueprint $table) {
            if (Schema::hasColumn('contacts', 'hubspot_id')) {
                $table->renameColumn('hubspot_id', 'contact_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Deals table
        Schema::table('deals', function (Blueprint $table) {
            if (Schema::hasColumn('deals', 'deal_id')) {
                $table->renameColumn('deal_id', 'hubspot_id');
            }
        });

        // Pipelines table
        Schema::table('pipelines', function (Blueprint $table) {
            if (Schema::hasColumn('pipelines', 'pipeline_id')) {
                $table->renameColumn('pipeline_id', 'hubspot_id');
            }
        });

        // Stages table
        Schema::table('stages', function (Blueprint $table) {
            if (Schema::hasColumn('stages', 'stage_id')) {
                $table->renameColumn('stage_id', 'hubspot_id');
            }
        });

        // Companies table
        Schema::table('companies', function (Blueprint $table) {
            if (Schema::hasColumn('companies', 'company_id')) {
                $table->renameColumn('company_id', 'hubspot_id');
            }
        });

        // Contacts table
        Schema::table('contacts', function (Blueprint $table) {
            if (Schema::hasColumn('contacts', 'contact_id')) {
                $table->renameColumn('contact_id', 'hubspot_id');
            }
        });
    }
};
