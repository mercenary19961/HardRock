<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\Dashboard\ContactController as DashboardContactController;
use App\Http\Controllers\Dashboard\DashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page (Public)
Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// Contact Form Submission
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

// Dashboard (Protected - accessible by all authenticated team members)
Route::middleware(['auth'])->prefix('dashboard')->name('dashboard.')->group(function () {
    // Dashboard Home
    Route::get('/', [DashboardController::class, 'index'])->name('index');

    // Contacts - viewable by all team members
    Route::get('/contacts', [DashboardContactController::class, 'index'])->name('contacts.index');

    // Admin-only actions (delete is protected in controller)
    Route::delete('/contacts/{contact}', [DashboardContactController::class, 'destroy'])->name('contacts.destroy');

    // Admin-only routes
    Route::middleware(['admin'])->group(function () {
        // Team Members management (admin only) - placeholder for future implementation
        Route::get('/users', function () {
            return Inertia::render('Dashboard/Users');
        })->name('users.index');
    });
});

require __DIR__.'/auth.php';
