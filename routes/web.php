<?php

use App\Http\Controllers\ContactController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

// TEMPORARY: One-time admin creation route - REMOVE AFTER USE!
Route::get('/create-admin-once', function () {
    $user = User::where('email', 'admin@hardrock.com')->first();

    if ($user) {
        $user->password = Hash::make('password');
        $user->is_admin = true;
        $user->save();
        return 'Admin user updated! Email: admin@hardrock.com - DELETE THIS ROUTE NOW!';
    }

    User::create([
        'name' => 'Admin',
        'email' => 'admin@hardrock.com',
        'password' => Hash::make('password'),
        'is_admin' => true,
    ]);

    return 'Admin user created! Email: admin@hardrock.com - DELETE THIS ROUTE NOW!';
});

// Landing Page (Public)
Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// Contact Form Submission
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Admin Dashboard (Protected by admin middleware)
Route::middleware(['auth', 'admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/contacts', [\App\Http\Controllers\Admin\ContactController::class, 'index'])->name('contacts.index');
    Route::delete('/contacts/{contact}', [\App\Http\Controllers\Admin\ContactController::class, 'destroy'])->name('contacts.destroy');
});

require __DIR__.'/auth.php';
