<?php

use App\Http\Controllers\ContactController;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page (Public)
Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// Contact Form Submission
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// TEMPORARY ROUTE - Delete after using once!
Route::get('/fix-admin-password-once', function () {
    $user = User::where('email', 'admin@hardrock.com')->first();

    if (!$user) {
        return response()->json([
            'error' => 'Admin user not found',
            'message' => 'No user with email admin@hardrock.com exists in the database'
        ], 404);
    }

    // Update password and ensure is_admin is set
    $user->password = Hash::make('password');
    $user->is_admin = true;
    $user->save();

    return response()->json([
        'success' => true,
        'message' => 'Admin password has been fixed! DELETE THIS ROUTE NOW!',
        'user' => [
            'email' => $user->email,
            'is_admin' => $user->is_admin
        ]
    ]);
});

// Admin Dashboard (Protected by admin middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/contacts', [\App\Http\Controllers\Admin\ContactController::class, 'index'])->name('contacts.index');
    Route::delete('/contacts/{contact}', [\App\Http\Controllers\Admin\ContactController::class, 'destroy'])->name('contacts.destroy');
});

require __DIR__.'/auth.php';
