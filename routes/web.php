<?php

use App\Http\Controllers\ContactController;
use App\Http\Controllers\Dashboard\ContactController as DashboardContactController;
use App\Http\Controllers\Dashboard\DashboardController;
use App\Http\Controllers\Dashboard\UserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing Page (Public)
Route::get('/', function () {
    return Inertia::render('Landing');
})->name('home');

// Contact Form Submission (rate limited: 5 requests per minute per IP)
Route::post('/contact', [ContactController::class, 'store'])
    ->middleware('throttle:5,1')
    ->name('contact.store');

// Services Page (with optional service slug, defaults to 'branding')
Route::get('/services/{slug?}', function (string $slug = 'branding') {
    $validSlugs = ['social-media', 'paid-ads', 'seo', 'pr-social-listening', 'branding', 'software-ai'];

    if (!in_array($slug, $validSlugs)) {
        abort(404);
    }

    return Inertia::render('Services', [
        'serviceSlug' => $slug,
    ]);
})->name('services');

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
        // Team Members management (admin only)
        Route::get('/users', [UserController::class, 'index'])->name('users.index');
        Route::post('/users', [UserController::class, 'store'])->name('users.store');
        Route::put('/users/{user}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');
    });
});

require __DIR__.'/auth.php';
