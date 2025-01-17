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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('username', 50); // Added username
            $table->string('email', 100)->unique(); // Updated email field length
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->string('profile_picture', 255)->nullable(); // Added profile_picture
            $table->text('bio')->nullable(); // Added bio
            $table->date('date_of_birth')->nullable(); // Added date_of_birth
            $table->string('phone', 15)->nullable(); // Added phone
            $table->string('gender', 20)->nullable(); // Added gender
            $table->string('relationship_status', 50)->nullable(); // Added relationship_status
            $table->text('address')->nullable(); // Added address
            $table->foreignId('role_id')->constrained()->onDelete('cascade'); // Added role_id with foreign key constraint

            $table->rememberToken();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
